-- Criar tabela de profissionais
CREATE TABLE profissionais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    especialidade VARCHAR(50),
    genero VARCHAR(10),
    endereco TEXT,
    foto_perfil_url TEXT,
    nota_media DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de serviços
CREATE TABLE servicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    duracao_minutos INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de avaliações de clientes
CREATE TABLE avaliacoes_clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    cliente_id UUID REFERENCES auth.users(id),
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de fotos dos profissionais
CREATE TABLE fotos_profissionais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    foto_url TEXT NOT NULL,
    descricao TEXT,
    is_foto_cliente BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de agendamentos
CREATE TABLE agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    cliente_id UUID REFERENCES auth.users(id),
    servico_id UUID REFERENCES servicos(id),
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    preco DECIMAL(10,2),
    endereco TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de mensagens
CREATE TABLE mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    remetente_id UUID REFERENCES auth.users(id),
    destinatario_id UUID REFERENCES auth.users(id),
    mensagem TEXT NOT NULL,
    lida_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de filtros de busca
CREATE TABLE filtros_busca (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    preco_minimo DECIMAL(10,2),
    preco_maximo DECIMAL(10,2),
    localizacao TEXT,
    preferencia_genero VARCHAR(10),
    especialidade VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE filtros_busca ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Profissionais podem ver seus próprios dados"
    ON profissionais
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Profissionais podem atualizar seus próprios dados"
    ON profissionais
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Profissionais podem ver seus próprios serviços"
    ON servicos
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM profissionais WHERE id = profissional_id));

CREATE POLICY "Profissionais podem criar serviços"
    ON servicos
    FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM profissionais WHERE id = profissional_id));

CREATE POLICY "Clientes podem ver profissionais"
    ON profissionais
    FOR SELECT
    USING (true);

CREATE POLICY "Clientes podem criar avaliações"
    ON avaliacoes_clientes
    FOR INSERT
    WITH CHECK (auth.uid() = cliente_id);

CREATE POLICY "Profissionais podem ver suas próprias avaliações"
    ON avaliacoes_clientes
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM profissionais WHERE id = profissional_id));

CREATE POLICY "Profissionais podem ver suas próprias fotos"
    ON fotos_profissionais
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM profissionais WHERE id = profissional_id));

CREATE POLICY "Profissionais podem fazer upload de fotos"
    ON fotos_profissionais
    FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM profissionais WHERE id = profissional_id));

CREATE POLICY "Profissionais podem ver seus próprios agendamentos"
    ON agendamentos
    FOR SELECT
    USING (auth.uid() = profissional_id);

CREATE POLICY "Clientes podem ver seus próprios agendamentos"
    ON agendamentos
    FOR SELECT
    USING (auth.uid() = cliente_id);

CREATE POLICY "Profissionais podem criar agendamentos"
    ON agendamentos
    FOR INSERT
    WITH CHECK (auth.uid() = profissional_id);

CREATE POLICY "Clientes podem enviar mensagens"
    ON mensagens
    FOR INSERT
    WITH CHECK (auth.uid() = remetente_id);

CREATE POLICY "Usuários podem ver suas próprias mensagens"
    ON mensagens
    FOR SELECT
    USING (auth.uid() = remetente_id OR auth.uid() = destinatario_id);
