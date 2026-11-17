import { APP_VERSION, APP_VERSION_CODE } from '../config/version';

export interface InfoAtualizacao {
  temAtualizacao: boolean;
  versaoServidor?: string;
  changelog?: string;
}

const LAST_RELOAD_KEY = 'vda_last_auto_update_reload_ts';

let swControllerReloading = false;

export function registrarServiceWorkerAtualizacao(): void {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (swControllerReloading) return;
    const lastReload = Number(sessionStorage.getItem(LAST_RELOAD_KEY) || 0);
    if (Date.now() - lastReload < 15000) return;

    swControllerReloading = true;
    sessionStorage.setItem(LAST_RELOAD_KEY, String(Date.now()));
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`/sw.js?v=${APP_VERSION_CODE}`, { updateViaCache: 'none' })
      .then((reg) => {
        reg.update().catch(() => {});
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              installing.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(() => {});
  });
}

export async function verificarAtualizacaoVersao(): Promise<InfoAtualizacao> {
  try {
    const res = await fetch(`/version.json?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    if (!res.ok) return { temAtualizacao: false };
    const data = await res.json();
    if (data && data.version && data.version !== APP_VERSION) {
      return {
        temAtualizacao: true,
        versaoServidor: data.version,
        changelog: data.changelog,
      };
    }
  } catch {
    // Offline ou indisponível
  }
  return { temAtualizacao: false };
}

export async function forcarAtualizacaoCompleta(): Promise<void> {
  try {
    sessionStorage.setItem(LAST_RELOAD_KEY, String(Date.now()));
  } catch {}

  if ('serviceWorker' in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } catch {}
  }

  if ('caches' in window) {
    try {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    } catch {}
  }

  window.location.reload();
}

export function podeRecarregarAutomaticamente(): boolean {
  try {
    const lastReload = Number(sessionStorage.getItem(LAST_RELOAD_KEY) || 0);
    return Date.now() - lastReload > 60000;
  } catch {
    return true;
  }
}
