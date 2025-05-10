-- Criar tabela de perfis de clientes
CREATE TABLE perfis_clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    nome_completo VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    data_nascimento DATE,
    genero VARCHAR(20),
    telefone VARCHAR(20),
    foto_perfil_url TEXT,
    profissao VARCHAR(50),
    sobre_mim TEXT,
    endereco TEXT,
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(9),
    status_verificacao VARCHAR(20) DEFAULT 'pendente',
    documentos_verificados BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de indicações
CREATE TABLE indicacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indicador_id UUID REFERENCES perfis_clientes(id),
    indicado_id UUID REFERENCES perfis_clientes(id),
    codigo_indicacao VARCHAR(20) UNIQUE,
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, confirmado, recompensado
    data_indicacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    data_confirmacao TIMESTAMP WITH TIME ZONE,
    recompensa_confirmada BOOLEAN DEFAULT false,
    recompensa_indicador DECIMAL(10,2),
    recompensa_indicado DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de recompensas
CREATE TABLE recompensas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES perfis_clientes(id),
    tipo VARCHAR(50), -- indicação, primeira_compra, etc
    valor DECIMAL(10,2),
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, confirmado, utilizado
    data_emissao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    data_utilizacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de documentos verificados
CREATE TABLE documentos_verificados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    tipo_documento VARCHAR(50), -- cpf, rg, etc
    documento_url TEXT,
    status_verificacao VARCHAR(20), -- pendente, aprovado, reprovado
    observacoes TEXT,
    verificado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de histórico de alterações de perfil
CREATE TABLE historico_alteracoes_perfil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    campo_alterado VARCHAR(50),
    valor_anterior TEXT,
    novo_valor TEXT,
    data_alteracao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    alterado_por UUID REFERENCES auth.users(id)
);

-- Criar índices para melhorar performance
CREATE INDEX idx_perfis_clientes_user_id ON perfis_clientes(user_id);
CREATE INDEX idx_indicacoes_indicador_id ON indicacoes(indicador_id);
CREATE INDEX idx_indicacoes_indicado_id ON indicacoes(indicado_id);
CREATE INDEX idx_recompensas_cliente_id ON recompensas(cliente_id);
CREATE INDEX idx_documentos_verificados_perfil_id ON documentos_verificados(perfil_id);

-- Criar função para gerar código de indicação único
CREATE OR REPLACE FUNCTION gerar_codigo_indicacao()
RETURNS VARCHAR AS $$
DECLARE
    codigo VARCHAR;
BEGIN
    codigo := upper(substr(md5(random()::text), 1, 6));
    
    -- Verificar se o código já existe
    IF EXISTS (
        SELECT 1 FROM indicacoes 
        WHERE codigo_indicacao = codigo
    ) THEN
        -- Se existir, gerar um novo código
        RETURN gerar_codigo_indicacao();
    END IF;

    RETURN codigo;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para gerar código de indicação
CREATE OR REPLACE FUNCTION trigger_gerar_codigo_indicacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.codigo_indicacao := gerar_codigo_indicacao();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gerar_codigo_indicacao
BEFORE INSERT ON indicacoes
FOR EACH ROW
EXECUTE FUNCTION trigger_gerar_codigo_indicacao();

-- Criar função para calcular recompensas
CREATE OR REPLACE FUNCTION calcular_recompensas(
    indicador_id UUID,
    indicado_id UUID
)
RETURNS TABLE (
    recompensa_indicador DECIMAL(10,2),
    recompensa_indicado DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        50.00 as recompensa_indicador, -- R$50,00 para o indicador
        25.00 as recompensa_indicado   -- R$25,00 para o indicado
    FROM perfis_clientes pc
    WHERE pc.id = indicado_id
    AND pc.status_verificacao = 'aprovado';
END;
$$ LANGUAGE plpgsql;

-- Criar função para registrar alteração de perfil
CREATE OR REPLACE FUNCTION registrar_alteracao_perfil(
    perfil_id UUID,
    campo_alterado VARCHAR,
    valor_anterior TEXT,
    novo_valor TEXT,
    alterado_por UUID
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO historico_alteracoes_perfil (
        perfil_id,
        campo_alterado,
        valor_anterior,
        novo_valor,
        alterado_por
    ) VALUES (
        perfil_id,
        campo_alterado,
        valor_anterior,
        novo_valor,
        alterado_por
    );
END;
$$ LANGUAGE plpgsql;
