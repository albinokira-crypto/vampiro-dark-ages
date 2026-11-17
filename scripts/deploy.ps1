param (
    [string]$Mensagem = "chore: atualizacao automatica vampiro-dark-ages",
    [switch]$SemBump = $false
)

# ============================================================
# Deploy Rápido e Auto-Atualização — Vampiro: A Idade das Trevas
# Uso: .\scripts\deploy.ps1 -Mensagem "feat: sua alteracao"
# ============================================================
$ErrorActionPreference = "Stop"
$sw = [System.Diagnostics.Stopwatch]::StartNew()

$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

if (-not $SemBump) {
    Write-Host ">> [1/4] Incrementando versão para auto-atualização instantânea..." -ForegroundColor Cyan
    $vPath = Join-Path $rootDir "public\version.json"
    $vJson = Get-Content $vPath -Raw | ConvertFrom-Json

    $cleanVer = ($vJson.version -replace '^v', '')
    $parts = $cleanVer.Split('.')
    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2] + 1
    $newVersion = "v$major.$minor.$patch"
    $newCode = [int]$vJson.versionCode + 1
    $nowIso = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

    $vJson.version = $newVersion
    $vJson.versionCode = $newCode
    $vJson.updatedAt = $nowIso
    $vJson.changelog = $Mensagem
    $vJson | ConvertTo-Json -Depth 4 | Set-Content -Path $vPath -Encoding UTF8

    $tsContent = "export const APP_VERSION = '$newVersion';`nexport const APP_VERSION_CODE = $newCode;`n"
    Set-Content -Path (Join-Path $rootDir "src\config\version.ts") -Value $tsContent -Encoding UTF8

    $swPath = Join-Path $rootDir "public\sw.js"
    $swContent = Get-Content $swPath -Raw
    $swContent = $swContent -replace 'vampiro-dark-ages-v\d+', "vampiro-dark-ages-v$newCode"
    $swContent = $swContent -replace 'Service Worker v\d+', "Service Worker v$newCode"
    Set-Content -Path $swPath -Value $swContent -Encoding UTF8

    Write-Host "   Nova versão: $newVersion (build $newCode)" -ForegroundColor Green
}

Write-Host ">> [2/4] Compilando build estático (Vite)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { throw "Falha no build do Vite." }

Write-Host ">> [3/4] Publicando diretamente no Cloudflare Workers..." -ForegroundColor Yellow
npx wrangler deploy
if ($LASTEXITCODE -ne 0) { throw "Falha no deploy do Cloudflare Workers." }

Write-Host ">> [4/4] Sincronizando repositório GitHub (main e master)..." -ForegroundColor Yellow
git add .
git commit -m $Mensagem
git push origin main
git push origin main:master

$sw.Stop()
$tempo = [math]::Round($sw.Elapsed.TotalSeconds, 1)
Write-Host ">> Deploy concluído com sucesso em ${tempo}s!" -ForegroundColor Green
Write-Host ">> Online em: https://vampiro-dark-ages.albino-kira.workers.dev" -ForegroundColor Cyan
