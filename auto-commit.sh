#!/bin/bash

# Configuração
REPO_PATH="$(pwd)"
BRANCH="main"
COMMIT_MESSAGE="Auto commit: $(date)"

# Função para fazer commit e push
do_commit() {
  echo "Fazendo commit e push..."
  git add .
  git commit -m "$COMMIT_MESSAGE"
  git push origin $BRANCH
  echo "Commit e push concluídos!"
}

# Verifica se há mudanças
if [[ -n $(git status -s) ]]; then
  do_commit
else
  echo "Nenhuma mudança detectada."
fi 