# Backup do Banco de Dados Supabase

Este diretório contém backups do banco de dados do projeto Cuide-Se.

## Informações do Backup

- Data do backup: 02/05/2025
- Versão do projeto: Supabase
- Estado do projeto: Pausado (Free Tier)
- Prazo máximo de restauração: 31/07/2025

## Como Restaurar o Backup

1. Crie um novo projeto no Supabase
2. Vá para Database > SQL Editor
3. Copie e cole o conteúdo do arquivo `20250502_database_backup.sql`
4. Execute as queries

## Estrutura do Backup

O arquivo de backup contém:
- Schema da tabela `notes`
- Dados de exemplo
- Triggers para atualização automática do `updated_at`
- Políticas de Row Level Security (RLS)
- Comentários documentando a estrutura
