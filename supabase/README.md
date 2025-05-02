# Supabase Configuration

This directory contains the Supabase configuration and migrations for the Cuide-Se project.

## Migration Files

- `20250502_create_notes.sql`: Creates the notes table with RLS policies and sample data

## Configuration

The configuration file `config.toml` contains the default Supabase settings. Update the credentials with your actual Supabase project credentials.

## Applying Migrations

To apply these migrations to your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to Database > SQL Editor
3. Copy and paste the contents of the migration file
4. Execute the queries

## Security

The notes table has the following security policies:
- Public read access (anon role)
- Authenticated users can create, update, and delete their own notes
- Row Level Security (RLS) is enabled to enforce these policies
