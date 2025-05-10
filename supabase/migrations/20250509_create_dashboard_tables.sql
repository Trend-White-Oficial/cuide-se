-- Criar tabela de planos
CREATE TABLE planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2),
    descricao TEXT,
    beneficios TEXT[],
    is_destaque BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de assinaturas
CREATE TABLE assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    plano_id UUID REFERENCES planos(id),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de categorias
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de profissionais_destaque
CREATE TABLE profissionais_destaque (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    categoria_id UUID REFERENCES categorias(id),
    mes DATE NOT NULL,
    ano INTEGER NOT NULL,
    nota_media DECIMAL(3,2),
    total_avaliacoes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de estatísticas do dashboard
CREATE TABLE dashboard_estatisticas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    mes DATE NOT NULL,
    ano INTEGER NOT NULL,
    total_agendamentos INTEGER DEFAULT 0,
    total_receita DECIMAL(10,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    nota_media DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de anúncios
CREATE TABLE anuncios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de notificações
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES profissionais(id),
    tipo VARCHAR(50) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar índices para melhorar performance
CREATE INDEX idx_profissionais_destaque_categoria ON profissionais_destaque(categoria_id);
CREATE INDEX idx_dashboard_estatisticas_profissional ON dashboard_estatisticas(profissional_id);
CREATE INDEX idx_notificacoes_profissional ON notificacoes(profissional_id);

-- Criar funções para atualizar estatísticas
CREATE OR REPLACE FUNCTION atualizar_estatisticas_dashboard()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar estatísticas quando um agendamento é criado/alterado
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE dashboard_estatisticas
        SET 
            total_agendamentos = total_agendamentos + 1,
            total_receita = total_receita + NEW.preco,
            updated_at = timezone('utc'::text, now())
        WHERE 
            profissional_id = NEW.profissional_id 
            AND EXTRACT(MONTH FROM NEW.data_agendamento) = mes
            AND EXTRACT(YEAR FROM NEW.data_agendamento) = ano;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para a função
CREATE TRIGGER trigger_atualizar_estatisticas
AFTER INSERT OR UPDATE ON agendamentos
FOR EACH ROW
EXECUTE FUNCTION atualizar_estatisticas_dashboard();

-- Criar função para selecionar profissionais em destaque
CREATE OR REPLACE FUNCTION selecionar_profissionais_destaque()
RETURNS TABLE(
    profissional_id UUID,
    nome VARCHAR,
    especialidade VARCHAR,
    nota_media DECIMAL,
    total_avaliacoes INTEGER,
    categoria_id UUID,
    categoria_nome VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH profissionais_nota AS (
        SELECT 
            p.id as profissional_id,
            p.nome,
            p.especialidade,
            p.nota_media,
            COUNT(ar.id) as total_avaliacoes,
            p.categoria_id,
            c.nome as categoria_nome
        FROM profissionais p
        LEFT JOIN avaliacoes_clientes ar ON p.id = ar.profissional_id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.nota_media >= 4.5
        GROUP BY p.id, p.nome, p.especialidade, p.nota_media, p.categoria_id, c.nome
    )
    SELECT DISTINCT ON (categoria_id)
        pn.profissional_id,
        pn.nome,
        pn.especialidade,
        pn.nota_media,
        pn.total_avaliacoes,
        pn.categoria_id,
        pn.categoria_nome
    FROM profissionais_nota pn
    ORDER BY pn.categoria_id, pn.nota_media DESC;
END;
$$ LANGUAGE plpgsql;

-- Criar função para atualizar profissionais em destaque mensalmente
CREATE OR REPLACE FUNCTION atualizar_profissionais_destaque()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar profissionais em destaque no início de cada mês
    IF EXTRACT(DAY FROM NEW.data_agendamento) = 1 THEN
        DELETE FROM profissionais_destaque WHERE mes = DATE_TRUNC('month', NEW.data_agendamento);
        
        INSERT INTO profissionais_destaque (
            profissional_id,
            categoria_id,
            mes,
            ano,
            nota_media,
            total_avaliacoes
        )
        SELECT 
            p.profissional_id,
            p.categoria_id,
            DATE_TRUNC('month', NEW.data_agendamento),
            EXTRACT(YEAR FROM NEW.data_agendamento),
            p.nota_media,
            p.total_avaliacoes
        FROM selecionar_profissionais_destaque() p;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar profissionais em destaque
CREATE TRIGGER trigger_atualizar_prof_destaque
AFTER INSERT ON agendamentos
FOR EACH ROW
EXECUTE FUNCTION atualizar_profissionais_destaque();
