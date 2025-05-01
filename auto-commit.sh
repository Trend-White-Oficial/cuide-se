# Configuração
$Branch = "main"
$CommitMessage = "Auto commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Função para fazer commit e push
function Do-Commit {
    Write-Host "Fazendo commit e push..."
    git add . || { Write-Host "Erro ao adicionar arquivos."; exit 1 }
    git commit -m $CommitMessage || { Write-Host "Erro ao fazer commit."; exit 1 }
    git push origin $Branch || { Write-Host "Erro ao fazer push."; exit 1 }
    Write-Host "Commit e push concluídos!"
}

# Verifica se há mudanças
if (git status --porcelain) {
    Do-Commit
} else {
    Write-Host "Nenhuma mudança detectada."
}