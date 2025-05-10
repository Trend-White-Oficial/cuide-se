-- Adicionar campos para CPF e CNPJ nos perfis
ALTER TABLE perfis_clientes
ADD COLUMN cpf VARCHAR(11),
ADD COLUMN cnpj VARCHAR(14),
ADD COLUMN tipo_documento VARCHAR(10) CHECK (tipo_documento IN ('cpf', 'cnpj', 'ambos'));

-- Criar tabela de verificação de documentos
CREATE TABLE verificacao_documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    tipo_documento VARCHAR(10) CHECK (tipo_documento IN ('cpf', 'cnpj')),
    documento_front_url TEXT,
    documento_back_url TEXT,
    status_verificacao VARCHAR(20) DEFAULT 'pendente',
    observacoes TEXT,
    verificado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de planos
CREATE TABLE planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    beneficios TEXT[],
    duracao_dias INTEGER NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de assinaturas
CREATE TABLE assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    plano_id UUID REFERENCES planos(id),
    status VARCHAR(20) DEFAULT 'ativo',
    data_inicio TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    data_fim TIMESTAMP WITH TIME ZONE,
    valor DECIMAL(10,2),
    forma_pagamento VARCHAR(20),
    recibo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de transações financeiras
CREATE TABLE transacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    tipo VARCHAR(20) CHECK (tipo IN ('receita', 'despesa', 'recompensa')),
    descricao TEXT,
    valor DECIMAL(10,2),
    categoria VARCHAR(50),
    data_transacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    comprovante_url TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de extrato
CREATE TABLE extrato (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    transacao_id UUID REFERENCES transacoes(id),
    saldo_anterior DECIMAL(10,2),
    saldo_atual DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de comprovantes de pagamento
CREATE TABLE comprovantes_pagamento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transacao_id UUID REFERENCES transacoes(id),
    arquivo_url TEXT,
    tipo_arquivo VARCHAR(20),
    status_verificacao VARCHAR(20) DEFAULT 'pendente',
    observacoes TEXT,
    verificado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar índices para melhorar performance
CREATE INDEX idx_verificacao_documentos_perfil_id ON verificacao_documentos(perfil_id);
CREATE INDEX idx_assinaturas_perfil_id ON assinaturas(perfil_id);
CREATE INDEX idx_transacoes_perfil_id ON transacoes(perfil_id);
CREATE INDEX idx_extrato_perfil_id ON extrato(perfil_id);
CREATE INDEX idx_comprovantes_pagamento_transacao_id ON comprovantes_pagamento(transacao_id);

-- Criar função para calcular saldo atual
CREATE OR REPLACE FUNCTION calcular_saldo_atual(perfil_id UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(
            CASE 
                WHEN tipo = 'receita' THEN valor
                WHEN tipo = 'despesa' THEN -valor
                ELSE 0
            END
        ), 0) as saldo
        FROM transacoes
        WHERE perfil_id = $1
        AND status = 'confirmado'
    );
END;
$$ LANGUAGE plpgsql;

-- Criar função para registrar transação
CREATE OR REPLACE FUNCTION registrar_transacao(
    perfil_id UUID,
    tipo VARCHAR,
    descricao TEXT,
    valor DECIMAL(10,2),
    categoria VARCHAR,
    comprovante_url TEXT
)
RETURNS UUID AS $$
DECLARE
    transacao_id UUID;
    saldo_anterior DECIMAL(10,2);
    saldo_atual DECIMAL(10,2);
BEGIN
    -- Verificar se o perfil tem assinatura ativa
    IF NOT EXISTS (
        SELECT 1 FROM assinaturas
        WHERE perfil_id = $1
        AND status = 'ativo'
        AND data_fim > now()
    ) THEN
        RAISE EXCEPTION 'Assinatura não encontrada ou não ativa';
    END IF;

    -- Calcular saldo anterior
    saldo_anterior := calcular_saldo_atual($1);

    -- Inserir transação
    INSERT INTO transacoes (
        perfil_id,
        tipo,
        descricao,
        valor,
        categoria,
        comprovante_url
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
    ) RETURNING id INTO transacao_id;

    -- Calcular novo saldo
    saldo_atual := saldo_anterior +
        CASE 
            WHEN $2 = 'receita' THEN $4
            WHEN $2 = 'despesa' THEN -$4
            ELSE 0
        END;

    -- Inserir no extrato
    INSERT INTO extrato (
        perfil_id,
        transacao_id,
        saldo_anterior,
        saldo_atual
    ) VALUES (
        $1,
        transacao_id,
        saldo_anterior,
        saldo_atual
    );

    RETURN transacao_id;
END;
$$ LANGUAGE plpgsql;

-- Criar função para verificar comprovante
CREATE OR REPLACE FUNCTION verificar_comprovante(
    transacao_id UUID,
    arquivo_url TEXT,
    tipo_arquivo VARCHAR
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO comprovantes_pagamento (
        transacao_id,
        arquivo_url,
        tipo_arquivo
    ) VALUES (
        $1,
        $2,
        $3
    );
END;
$$ LANGUAGE plpgsql;
