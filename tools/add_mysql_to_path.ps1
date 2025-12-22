<#
add_mysql_to_path.ps1
Usage: Run in an elevated PowerShell (Run as Administrator):
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  .\tools\add_mysql_to_path.ps1 [-UseXAMPP]

This script searches for Laragon's MySQL bin folder (e.g. C:\laragon\bin\mysql\mysql-8.x.x\bin) and adds it to the Machine PATH if not present.
Set -UseXAMPP to prefer XAMPP's MySQL (C:\xampp\mysql\bin) when Laragon not found.
#>
param(
    [switch]$UseXAMPP
)

function Add-PathIfMissing($p) {
    $current = [Environment]::GetEnvironmentVariable('Path','Machine')

    if ($null -eq $current) { $current = '' }

    if ($current.ToLower().Split(';') -contains $p.ToLower()) {
        Write-Host "Path already present: $p" -ForegroundColor Yellow
        return $false
    }

    $new = $current
    if ($new -ne '' -and -not $new.EndsWith(';')) { $new += ';' }
    $new += $p

    [Environment]::SetEnvironmentVariable('Path',$new,'Machine')
    Write-Host "Added to machine PATH: $p" -ForegroundColor Green
    return $true
}

function Find-LaragonMySQL {
    $base = 'C:\laragon\bin\mysql'
    if (!(Test-Path $base)) { return $null }
    $dirs = Get-ChildItem $base -Directory -ErrorAction SilentlyContinue
    if (!$dirs) { return $null }
    $chosen = $dirs | Sort-Object Name -Descending | Select-Object -First 1
    return Join-Path $chosen.FullName 'bin'
}

function Find-XAMPPMySQL {
    $base = 'C:\xampp\mysql\bin'
    if (Test-Path $base) { return $base }
    return $null
}

Write-Host "Searching for Laragon MySQL..." -ForegroundColor Cyan
$bin = Find-LaragonMySQL
if (!$bin -and $UseXAMPP) {
    Write-Host "Laragon not found, checking XAMPP..." -ForegroundColor Cyan
    $bin = Find-XAMPPMySQL
}

if (!$bin) {
    Write-Host "Could not find Laragon nor XAMPP MySQL path." -ForegroundColor Red
    Write-Host "If installed in a custom path, run the script with -UseXAMPP or edit this script to point to your MySQL bin." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found MySQL bin at: $bin" -ForegroundColor Green
$confirm = Read-Host "Proceed to add this to Machine PATH? (Y/N)"
if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "Cancelled by user." -ForegroundColor Yellow
    exit 0
}

Add-PathIfMissing $bin | Out-Null

Write-Host "Done. Restart your terminal(s) or sign out/in to apply PATH changes." -ForegroundColor Green
Write-Host "Verify: open NEW terminal and run: mysql --version  or where.exe mysql " -ForegroundColor Cyan
