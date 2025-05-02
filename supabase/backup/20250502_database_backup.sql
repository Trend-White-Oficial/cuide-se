-- Backup do banco de dados Supabase - 02/05/2025

-- Schema e dados da tabela notes

-- Drop existing table if exists
DROP TABLE IF EXISTS public.notes CASCADE;

-- Create table
CREATE TABLE public.notes (
    id bigint NOT NULL,
    title text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set primary key
ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);

-- Create sequence
CREATE SEQUENCE public.notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Set sequence ownership
ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;

-- Set default value for id
ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);

-- Insert backup data
INSERT INTO public.notes (id, title, created_at, updated_at) VALUES
(1, 'Primeira nota do Cuide-Se', '2025-05-02 11:24:34+00', '2025-05-02 11:24:34+00'),
(2, 'Sistema de agendamento implementado', '2025-05-02 11:24:34+00', '2025-05-02 11:24:34+00'),
(3, 'Interface de profissionais configurada', '2025-05-02 11:24:34+00', '2025-05-02 11:24:34+00');

-- Set sequence value
SELECT pg_catalog.setval('public.notes_id_seq', 3, true);

-- Create trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "public can read notes"
    ON public.notes FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "users can insert notes"
    ON public.notes FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "users can update their own notes"
    ON public.notes FOR UPDATE
    TO authenticated
    USING (auth.uid() = notes.user_id)
    WITH CHECK (auth.uid() = notes.user_id);

CREATE POLICY "users can delete their own notes"
    ON public.notes FOR DELETE
    TO authenticated
    USING (auth.uid() = notes.user_id);

-- Add comments
COMMENT ON TABLE public.notes IS 'Tabela de notas do projeto Cuide-Se';
COMMENT ON COLUMN public.notes.id IS 'ID único da nota';
COMMENT ON COLUMN public.notes.title IS 'Título da nota';
COMMENT ON COLUMN public.notes.created_at IS 'Data e hora de criação da nota';
COMMENT ON COLUMN public.notes.updated_at IS 'Data e hora da última atualização da nota';
