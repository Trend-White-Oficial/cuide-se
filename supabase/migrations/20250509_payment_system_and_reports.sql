-- Criar tabela de cartões de crédito
CREATE TABLE cartoes_credito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    numero_cartao TEXT,
    nome_titular TEXT,
    data_expiracao DATE,
    codigo_seguranca TEXT,
    bandeira VARCHAR(20),
    tipo_cartao VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ativo',
    criado_por UUID REFERENCES auth.users(id),
    atualizado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de transações com cartão
CREATE TABLE transacoes_cartao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    cartao_id UUID REFERENCES cartoes_credito(id),
    valor DECIMAL(10,2),
    tipo_transacao VARCHAR(20) CHECK (tipo_transacao IN ('pagamento', 'recebimento', 'reembolso')),
    status VARCHAR(20) DEFAULT 'pendente',
    data_transacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    data_liberacao TIMESTAMP WITH TIME ZONE,
    descricao TEXT,
    comprovante_url TEXT,
    criado_por UUID REFERENCES auth.users(id),
    atualizado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de níveis de cliente
CREATE TABLE niveis_cliente (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    beneficios TEXT[],
    requisitos TEXT[],
    nivel_acesso INTEGER,
    ativo BOOLEAN DEFAULT true,
    criado_por UUID REFERENCES auth.users(id),
    atualizado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de relatórios
CREATE TABLE relatorios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES perfis_clientes(id),
    tipo VARCHAR(20) CHECK (tipo IN ('erro', 'bug', 'fraude', 'outro')),
    titulo TEXT,
    descricao TEXT,
    evidencia_url TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    prioridade VARCHAR(20) DEFAULT 'normal',
    resolvido_por UUID REFERENCES auth.users(id),
    data_resolucao TIMESTAMP WITH TIME ZONE,
    criado_por UUID REFERENCES auth.users(id),
    atualizado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de FAQ
CREATE TABLE faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria VARCHAR(50),
    pergunta TEXT,
    resposta TEXT,
    ordem INTEGER,
    ativo BOOLEAN DEFAULT true,
    criado_por UUID REFERENCES auth.users(id),
    atualizado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de tutoriais
CREATE TABLE tutoriais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT,
    descricao TEXT,
    categoria VARCHAR(50),
    conteudo TEXT,
    video_url TEXT,
    ordem INTEGER,
    ativo BOOLEAN DEFAULT true,
    criado_por UUID REFERENCES auth.users(id),
    atualizado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar índices para melhorar performance
CREATE INDEX idx_cartoes_credito_perfil_id ON cartoes_credito(perfil_id);
CREATE INDEX idx_transacoes_cartao_perfil_id ON transacoes_cartao(perfil_id);
CREATE INDEX idx_niveis_cliente_nivel_acesso ON niveis_cliente(nivel_acesso);
CREATE INDEX idx_relatorios_tipo ON relatorios(tipo);
CREATE INDEX idx_relatorios_status ON relatorios(status);
CREATE INDEX idx_faq_categoria ON faq(categoria);
CREATE INDEX idx_tutoriais_categoria ON tutoriais(categoria);

-- Criar função para liberar transações após 7 dias
CREATE OR REPLACE FUNCTION liberar_transacao_apos_7_dias()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo_transacao = 'pagamento' THEN
        NEW.data_liberacao := NEW.data_transacao + interval '7 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_liberar_transacao
BEFORE INSERT ON transacoes_cartao
FOR EACH ROW
EXECUTE FUNCTION liberar_transacao_apos_7_dias();

-- Criar função para verificar status de transação
CREATE OR REPLACE FUNCTION verificar_status_transacao()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo_transacao = 'pagamento' THEN
        IF NEW.status = 'pendente' AND NEW.data_liberacao < now() THEN
            NEW.status := 'liberado';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_verificar_status
BEFORE UPDATE ON transacoes_cartao
FOR EACH ROW
EXECUTE FUNCTION verificar_status_transacao();
