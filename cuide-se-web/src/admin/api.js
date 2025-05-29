import { supabase } from '../api/supabase';

// API para Autenticação do Admin
export const apiAdminAuth = {
    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) return { error };

        const { data: adminData, error: adminError } = await supabase
            .from('administradores')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

        if (adminError) return { error: adminError };

        return { data: { ...data, admin: adminData }, error: null };
    },

    register: async (userData) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password
        });

        if (authError) return { error: authError };

        const { data, error } = await supabase
            .from('administradores')
            .insert({
                user_id: authData.user.id,
                nome: userData.nome,
                email: userData.email,
                nivel_acesso: userData.nivel_acesso || 1
            })
            .select();

        return { data, error };
    },

    getCurrentAdmin: async () => {
        const user = supabase.auth.getUser();
        if (!user) return { error: 'Usuário não autenticado' };

        const { data, error } = await supabase
            .from('administradores')
            .select('*')
            .eq('user_id', user.id)
            .single();

        return { data, error };
    }
};

// API para Configurações do Sistema
export const apiConfiguracoes = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('configuracoes_sistema')
            .select('*');

        return { data, error };
    },

    update: async (chave, valor) => {
        const { data, error } = await supabase
            .from('configuracoes_sistema')
            .update({ valor })
            .eq('chave', chave)
            .select();

        return { data, error };
    },

    create: async (chave, valor, descricao, tipo_dado) => {
        const { data, error } = await supabase
            .from('configuracoes_sistema')
            .insert({
                chave,
                valor,
                descricao,
                tipo_dado
            })
            .select();

        return { data, error };
    }
};

// API para Logs do Sistema
export const apiLogs = {
    getAdminLogs: async (filters = {}) => {
        const query = supabase
            .from('admin_logs')
            .select(`
                *,
                administradores:admin_id (
                    nome,
                    email
                )
            `);

        if (filters.dataInicial) {
            query.gte('created_at', filters.dataInicial);
        }
        if (filters.dataFinal) {
            query.lte('created_at', filters.dataFinal);
        }
        if (filters.tipoAcao) {
            query.eq('acao', filters.tipoAcao);
        }

        const { data, error } = await query;
        return { data, error };
    },

    getSystemLogs: async (filters = {}) => {
        const query = supabase
            .from('logs_sistema')
            .select('*');

        if (filters.dataInicial) {
            query.gte('created_at', filters.dataInicial);
        }
        if (filters.dataFinal) {
            query.lte('created_at', filters.dataFinal);
        }
        if (filters.nivel) {
            query.eq('nivel', filters.nivel);
        }

        const { data, error } = await query;
        return { data, error };
    }
};

// API para Backup
export const apiBackup = {
    createBackup: async () => {
        const { data, error } = await supabase
            .from('backup_dados')
            .insert({
                nome_arquivo: `backup_${new Date().toISOString()}.sql`,
                caminho_arquivo: `/backups/${new Date().toISOString()}.sql`,
                status: 'em andamento'
            })
            .select();

        return { data, error };
    },

    listBackups: async (filters = {}) => {
        const query = supabase
            .from('backup_dados')
            .select('*');

        if (filters.dataInicial) {
            query.gte('created_at', filters.dataInicial);
        }
        if (filters.dataFinal) {
            query.lte('created_at', filters.dataFinal);
        }
        if (filters.tipoBackup) {
            query.eq('tipo_backup', filters.tipoBackup);
        }

        const { data, error } = await query;
        return { data, error };
    }
};

// API para Monitoramento
export const apiMonitoramento = {
    getSystemMetrics: async () => {
        const { data, error } = await supabase
            .from('monitoramento_sistema')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

        return { data, error };
    },

    getHistoricalMetrics: async (filters = {}) => {
        const query = supabase
            .from('monitoramento_sistema')
            .select('*');

        if (filters.dataInicial) {
            query.gte('created_at', filters.dataInicial);
        }
        if (filters.dataFinal) {
            query.lte('created_at', filters.dataFinal);
        }

        const { data, error } = await query;
        return { data, error };
    }
};

// API para Auditoria
export const apiAuditoria = {
    getAuditLogs: async (filters = {}) => {
        const query = supabase
            .from('auditoria')
            .select(`
                *,
                auth.users:user_id (
                    email
                )
            `);

        if (filters.dataInicial) {
            query.gte('created_at', filters.dataInicial);
        }
        if (filters.dataFinal) {
            query.lte('created_at', filters.dataFinal);
        }
        if (filters.tabela) {
            query.eq('tabela', filters.tabela);
        }
        if (filters.acao) {
            query.eq('acao', filters.acao);
        }

        const { data, error } = await query;
        return { data, error };
    }
};

// API para Notificações do Sistema
export const apiNotificacoes = {
    getSystemNotifications: async () => {
        const { data, error } = await supabase
            .from('notificacoes_sistema')
            .select('*')
            .order('created_at', { ascending: false });

        return { data, error };
    },

    markAsRead: async (id) => {
        const { data, error } = await supabase
            .from('notificacoes_sistema')
            .update({ lida: true })
            .eq('id', id)
            .select();

        return { data, error };
    }
};
