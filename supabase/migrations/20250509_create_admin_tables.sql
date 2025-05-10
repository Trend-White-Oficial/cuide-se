-- Criar tabela de administradores
CREATE TABLE administradores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    nivel_acesso INTEGER DEFAULT 1, -- 1 = admin, 2 = super admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de logs de administração
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES administradores(id),
    acao VARCHAR(50) NOT NULL,
    descricao TEXT,
    tabela_afetada VARCHAR(50),
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de configurações do sistema
CREATE TABLE configuracoes_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor JSONB,
    descricao TEXT,
    tipo_dado VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de backup de dados
CREATE TABLE backup_dados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho_arquivo TEXT NOT NULL,
    tamanho_bytes BIGINT,
    tipo_backup VARCHAR(50), -- completo, incremental
    status VARCHAR(20), -- em andamento, concluido, falha
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de logs de acesso
CREATE TABLE logs_acesso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    ip VARCHAR(45),
    user_agent TEXT,
    acao VARCHAR(50),
    caminho TEXT,
    status INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de monitoramento do sistema
CREATE TABLE monitoramento_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memoria_usada BIGINT,
    memoria_total BIGINT,
    cpu_usada DECIMAL(5,2),
    disco_usado BIGINT,
    disco_total BIGINT,
    requisicoes_por_minuto INTEGER,
    erros_ultima_hora INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de notificações do sistema
CREATE TABLE notificacoes_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensagem TEXT NOT NULL,
    nivel VARCHAR(20), -- info, warning, error, success
    lida BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de atualizações do sistema
CREATE TABLE atualizacoes_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    versao VARCHAR(20) NOT NULL,
    data_lancamento DATE NOT NULL,
    descricao TEXT,
    arquivos_afetados TEXT[],
    status VARCHAR(20), -- planejado, em desenvolvimento, testando, em produção
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de configurações de segurança
CREATE TABLE configuracoes_seguranca (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor JSONB,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de logs de segurança
CREATE TABLE logs_seguranca (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    ip VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de auditoria
CREATE TABLE auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tabela VARCHAR(100) NOT NULL,
    registro_id UUID NOT NULL,
    acao VARCHAR(20) NOT NULL, -- insert, update, delete
    dados_anteriores JSONB,
    dados_novos JSONB,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar índices para melhorar performance
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_tabela_afetada ON admin_logs(tabela_afetada);
CREATE INDEX idx_admin_logs_registro_id ON admin_logs(registro_id);
CREATE INDEX idx_logs_acesso_user_id ON logs_acesso(user_id);
CREATE INDEX idx_monitoramento_sistema_created_at ON monitoramento_sistema(created_at);
CREATE INDEX idx_notificacoes_sistema_lida ON notificacoes_sistema(lida);
CREATE INDEX idx_auditoria_tabela ON auditoria(tabela);
CREATE INDEX idx_auditoria_registro_id ON auditoria(registro_id);

-- Criar funções para auditoria
CREATE OR REPLACE FUNCTION auditar_mudancas()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria (
            tabela,
            registro_id,
            acao,
            dados_novos,
            user_id
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            'insert',
            to_jsonb(NEW),
            auth.uid()
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria (
            tabela,
            registro_id,
            acao,
            dados_anteriores,
            dados_novos,
            user_id
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            'update',
            to_jsonb(OLD),
            to_jsonb(NEW),
            auth.uid()
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (
            tabela,
            registro_id,
            acao,
            dados_anteriores,
            user_id
        ) VALUES (
            TG_TABLE_NAME,
            OLD.id,
            'delete',
            to_jsonb(OLD),
            auth.uid()
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para auditoria
CREATE OR REPLACE FUNCTION criar_trigger_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format(
        'CREATE TRIGGER trigger_auditoria_%I
        AFTER INSERT OR UPDATE OR DELETE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION auditar_mudancas();',
        TG_TABLE_NAME,
        TG_TABLE_NAME
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para criar triggers de auditoria
CREATE OR REPLACE FUNCTION criar_triggers_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar triggers para todas as tabelas importantes
    CREATE TRIGGER trigger_auditoria_administradores
    AFTER INSERT OR UPDATE OR DELETE ON administradores
    FOR EACH ROW
    EXECUTE FUNCTION auditar_mudancas();

    CREATE TRIGGER trigger_auditoria_configuracoes
    AFTER INSERT OR UPDATE OR DELETE ON configuracoes_sistema
    FOR EACH ROW
    EXECUTE FUNCTION auditar_mudancas();

    CREATE TRIGGER trigger_auditoria_backup
    AFTER INSERT OR UPDATE OR DELETE ON backup_dados
    FOR EACH ROW
    EXECUTE FUNCTION auditar_mudancas();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para monitoramento do sistema
CREATE OR REPLACE FUNCTION monitorar_sistema()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO monitoramento_sistema (
        memoria_usada,
        memoria_total,
        cpu_usada,
        disco_usado,
        disco_total,
        requisicoes_por_minuto,
        erros_ultima_hora
    ) VALUES (
        pg_size_pretty(pg_database_size(current_database())),
        pg_size_pretty(pg_total_relation_size('pg_class')),
        pg_stat_get_backend_activity_stats('cpu'),
        pg_size_pretty(pg_database_size(current_database())),
        pg_size_pretty(pg_total_relation_size('pg_class')),
        (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active'),
        (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'idle in transaction')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para logs de segurança
CREATE OR REPLACE FUNCTION registrar_log_seguranca()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO logs_seguranca (
        tipo,
        descricao,
        user_id,
        ip
    ) VALUES (
        'login',
        'Usuário realizou login no sistema',
        auth.uid(),
        inet_client_addr()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
