param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("epico", "feat", "story", "task", "bug", "investigacao")]
    [string]$Tipo,

    [int]$Versao = 0,
    [int]$Epico
)

function Get-EpicosRoot {
    $dir = Get-Location
    while ($dir) {
        if (Test-Path (Join-Path $dir ".cursor\skills\processo-agil")) {
            return Join-Path $dir "Epicos"
        }
        if (Test-Path (Join-Path $dir "Epicos")) {
            return Join-Path $dir "Epicos"
        }
        $parent = Split-Path $dir -Parent
        if ($parent -eq $dir) { break }
        $dir = $parent
    }
    return Join-Path (Get-Location) "Epicos"
}

function Get-LatestVersionNumber {
    param([string]$Epicos)
    $max = 0
    if (Test-Path $Epicos) {
        Get-ChildItem $Epicos -Directory | Where-Object { $_.Name -match '^V(\d+)$' } | ForEach-Object {
            $n = [int]$Matches[1]
            if ($n -gt $max) { $max = $n }
        }
    }
    return $max
}

function Get-VersionDir {
    param([string]$Epicos, [int]$VersaoNum, [switch]$Create)
    if ($VersaoNum -le 0) {
        $VersaoNum = Get-LatestVersionNumber -Epicos $Epicos
        if ($VersaoNum -eq 0) { $VersaoNum = 1 }
    }
    $vDir = Join-Path $Epicos ("V{0}" -f $VersaoNum)
    if (-not (Test-Path $vDir)) {
        if ($Create -or $Tipo -in @("epico", "investigacao")) {
            New-Item -ItemType Directory -Path $vDir -Force | Out-Null
            return $vDir
        }
        return $null
    }
    return $vDir
}

function Get-MaxFromNames {
    param([string[]]$Names, [string]$Pattern)
    $max = 0
    foreach ($name in $Names) {
        if ($name -match $Pattern) {
            $n = [int]$Matches[1]
            if ($n -gt $max) { $max = $n }
        }
    }
    return $max
}

function Find-EpicDir {
    param([string]$VersionDir, [int]$EpicoNum)
    $epicPrefix = 'E' + ('{0:D2}' -f $EpicoNum) + '-'
    if (-not (Test-Path $VersionDir)) { return $null }
    return Get-ChildItem $VersionDir -Directory | Where-Object { $_.Name -ilike "$epicPrefix*" } | Select-Object -First 1
}

function Get-TypeDir {
    param([string]$ParentDir, [string]$Subfolder)
    $path = Join-Path $ParentDir $Subfolder
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
    return $path
}

$epicos = Get-EpicosRoot
$versionDir = Get-VersionDir -Epicos $epicos -VersaoNum $Versao -Create

if ($Tipo -eq "investigacao") {
    if (-not $versionDir) {
        Write-Error "Nao foi possivel resolver versao em $epicos"
        exit 1
    }
    $tsDir = Get-TypeDir -ParentDir $versionDir -Subfolder "TROUBLESHOOTING"
    $files = Get-ChildItem $tsDir -File -Filter "INV*.md" -ErrorAction SilentlyContinue | ForEach-Object { $_.Name }
    $max = Get-MaxFromNames -Names $files -Pattern "^INV(\d{2})-"
    Write-Output ("INV{0:D2}" -f ($max + 1))
    exit 0
}

if ($Tipo -eq "epico") {
    if (-not $versionDir) {
        Write-Error "Versao nao encontrada em $epicos"
        exit 1
    }
    $nums = @()
    Get-ChildItem $versionDir -Directory | Where-Object { $_.Name -match "^E(\d{2})-" } | ForEach-Object {
        $nums += [int]$Matches[1]
    }
    $nextNum = if ($nums.Count -gt 0) { ($nums | Measure-Object -Maximum).Maximum + 1 } else { 1 }
    Write-Output "E$($nextNum.ToString('00'))"
    exit 0
}

if (-not $Epico) {
    Write-Error "Parametro -Epico obrigatorio para tipo $Tipo"
    exit 1
}

if (-not $versionDir) {
    Write-Error "Versao nao encontrada em $epicos"
    exit 1
}

$epicDir = Find-EpicDir -VersionDir $versionDir -EpicoNum $Epico
if (-not $epicDir) {
    Write-Error ('Epico E' + ('{0:D2}' -f $Epico) + " nao encontrado")
    exit 1
}

switch ($Tipo) {
    "feat" {
        $featDir = Get-TypeDir -ParentDir $epicDir.FullName -Subfolder "FEAT"
        $files = Get-ChildItem $featDir -File -Filter "FEAT*.md" | ForEach-Object { $_.Name }
        $max = Get-MaxFromNames -Names $files -Pattern "^FEAT(\d{2})-"
        Write-Output ("FEAT{0:D2}" -f ($max + 1))
    }
    "story" {
        $storyDir = Get-TypeDir -ParentDir $epicDir.FullName -Subfolder "STORY"
        $files = Get-ChildItem $storyDir -File -Filter "S*.md" | ForEach-Object { $_.Name }
        $max = Get-MaxFromNames -Names $files -Pattern "^S(\d{2})-"
        Write-Output ("S{0:D2}" -f ($max + 1))
    }
    "task" {
        $taskDir = Get-TypeDir -ParentDir $epicDir.FullName -Subfolder "TASK"
        $files = Get-ChildItem $taskDir -File -Filter "T*.md" | ForEach-Object { $_.Name }
        $max = Get-MaxFromNames -Names $files -Pattern "^T(\d{2})-"
        Write-Output ("T{0:D2}" -f ($max + 1))
    }
    "bug" {
        $bugDir = Get-TypeDir -ParentDir $epicDir.FullName -Subfolder "BUG"
        $files = Get-ChildItem $bugDir -File -Filter "F*.md" | ForEach-Object { $_.Name }
        $max = Get-MaxFromNames -Names $files -Pattern "^F(\d{2})-"
        $fNum = $max + 1
        Write-Output ('E' + ('{0:D2}' -f $Epico) + '-F' + ('{0:D2}' -f $fNum))
    }
}
