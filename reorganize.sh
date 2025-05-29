#!/bin/bash

# Criar diretórios para os novos repositórios
mkdir -p cuide-se-web cuide-se-mobile cuide-se-api

# Mover arquivos web
mv src cuide-se-web/
mv public cuide-se-web/
mv index.html cuide-se-web/
mv vite.config.ts cuide-se-web/
mv tailwind.config.js cuide-se-web/
mv vercel.json cuide-se-web/

# Mover arquivos mobile
mv app cuide-se-mobile/
mv assets cuide-se-mobile/
mv android cuide-se-mobile/
mv app.json cuide-se-mobile/
mv metro.config.js cuide-se-mobile/
mv eas.json cuide-se-mobile/

# Mover arquivos de configuração compartilhados
cp package.json cuide-se-web/
cp package.json cuide-se-mobile/
cp package.json cuide-se-api/
cp tsconfig.json cuide-se-web/
cp tsconfig.json cuide-se-mobile/
cp tsconfig.json cuide-se-api/
cp .gitignore cuide-se-web/
cp .gitignore cuide-se-mobile/
cp .gitignore cuide-se-api/

# Mover arquivos de documentação
cp README.md cuide-se-web/
cp README.md cuide-se-mobile/
cp README.md cuide-se-api/
cp LICENSE cuide-se-web/
cp LICENSE cuide-se-mobile/
cp LICENSE cuide-se-api/

# Criar novos .gitignore para cada repositório
echo "node_modules/" > cuide-se-web/.gitignore
echo "dist/" >> cuide-se-web/.gitignore
echo "node_modules/" > cuide-se-mobile/.gitignore
echo "build/" >> cuide-se-mobile/.gitignore
echo "node_modules/" > cuide-se-api/.gitignore
echo "dist/" >> cuide-se-api/.gitignore

echo "Reorganização concluída!" 