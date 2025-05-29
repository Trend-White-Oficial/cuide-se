# Criar diretórios para os novos repositórios
New-Item -ItemType Directory -Force -Path cuide-se-web
New-Item -ItemType Directory -Force -Path cuide-se-mobile
New-Item -ItemType Directory -Force -Path cuide-se-api

# Mover arquivos web
Move-Item -Path src -Destination cuide-se-web/ -Force
Move-Item -Path public -Destination cuide-se-web/ -Force
Move-Item -Path index.html -Destination cuide-se-web/ -Force
Move-Item -Path vite.config.ts -Destination cuide-se-web/ -Force
Move-Item -Path tailwind.config.js -Destination cuide-se-web/ -Force
Move-Item -Path vercel.json -Destination cuide-se-web/ -Force

# Mover arquivos mobile
Move-Item -Path app -Destination cuide-se-mobile/ -Force
Move-Item -Path assets -Destination cuide-se-mobile/ -Force
Move-Item -Path android -Destination cuide-se-mobile/ -Force
Move-Item -Path app.json -Destination cuide-se-mobile/ -Force
Move-Item -Path metro.config.js -Destination cuide-se-mobile/ -Force
Move-Item -Path eas.json -Destination cuide-se-mobile/ -Force

# Copiar arquivos de configuração compartilhados
Copy-Item -Path package.json -Destination cuide-se-web/ -Force
Copy-Item -Path package.json -Destination cuide-se-mobile/ -Force
Copy-Item -Path package.json -Destination cuide-se-api/ -Force
Copy-Item -Path tsconfig.json -Destination cuide-se-web/ -Force
Copy-Item -Path tsconfig.json -Destination cuide-se-mobile/ -Force
Copy-Item -Path tsconfig.json -Destination cuide-se-api/ -Force
Copy-Item -Path .gitignore -Destination cuide-se-web/ -Force
Copy-Item -Path .gitignore -Destination cuide-se-mobile/ -Force
Copy-Item -Path .gitignore -Destination cuide-se-api/ -Force

# Copiar arquivos de documentação
Copy-Item -Path README.md -Destination cuide-se-web/ -Force
Copy-Item -Path README.md -Destination cuide-se-mobile/ -Force
Copy-Item -Path README.md -Destination cuide-se-api/ -Force
Copy-Item -Path LICENSE -Destination cuide-se-web/ -Force
Copy-Item -Path LICENSE -Destination cuide-se-mobile/ -Force
Copy-Item -Path LICENSE -Destination cuide-se-api/ -Force

# Criar novos .gitignore para cada repositório
Set-Content -Path cuide-se-web/.gitignore -Value "node_modules/`ndist/"
Set-Content -Path cuide-se-mobile/.gitignore -Value "node_modules/`nbuild/"
Set-Content -Path cuide-se-api/.gitignore -Value "node_modules/`ndist/"

Write-Host "Reorganização concluída!" 