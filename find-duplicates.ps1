# Script para encontrar arquivos duplicados
param(
    [string]$Path = "$(Get-Location)"
)

function Get-FileHashes {
    param($Path)
    $hashes = @{ }
    
    Get-ChildItem -Path $Path -File -Recurse | ForEach-Object {
        $file = $_
        $hash = (Get-FileHash -Path $file.FullName -Algorithm SHA256).Hash
        
        if (-not $hashes.ContainsKey($hash)) {
            $hashes[$hash] = @()
        }
        $hashes[$hash] += $file.FullName
    }
    
    return $hashes
}

function Find-DuplicateFiles {
    param($Path)
    
    $hashes = Get-FileHashes -Path $Path
    $duplicates = @{ }
    
    foreach ($hash in $hashes.Keys) {
        if ($hashes[$hash].Count -gt 1) {
            $duplicates[$hash] = $hashes[$hash]
        }
    }
    
    return $duplicates
}

# Encontrar duplicatas
$duplicateFiles = Find-DuplicateFiles -Path $Path

if ($duplicateFiles.Count -eq 0) {
    Write-Host "Nenhum arquivo duplicado encontrado!" -ForegroundColor Green
} else {
    Write-Host "Arquivos duplicados encontrados:" -ForegroundColor Yellow
    foreach ($hash in $duplicateFiles.Keys) {
        Write-Host "" -ForegroundColor White
        Write-Host "Hash: $hash" -ForegroundColor Cyan
        $files = $duplicateFiles[$hash]
        $files | ForEach-Object {
            Write-Host "- $_" -ForegroundColor Yellow
        }
    }
    
    # Perguntar se deseja remover duplicatas
    $remove = Read-Host "Deseja remover os arquivos duplicados? (s/n)"
    if ($remove -eq 's') {
        foreach ($hash in $duplicateFiles.Keys) {
            $files = $duplicateFiles[$hash]
            # Mantém o primeiro arquivo e remove os demais
            for ($i = 1; $i -lt $files.Count; $i++) {
                $fileToZero = $files[$i]
                Write-Host "Zerando conteúdo de: $fileToZero" -ForegroundColor Red
                Set-Content -Path $fileToZero -Value "" -Force
            }
        }
        Write-Host "Arquivos duplicados removidos com sucesso!" -ForegroundColor Green
    }
}
