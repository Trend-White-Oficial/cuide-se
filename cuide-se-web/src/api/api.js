import { supabase } from './supabase';

// API para Profissionais
export const apiProfissionais = {
    // Autenticação
    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    // Cadastro de profissional
    register: async (userData) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password
        });

        if (authError) return { error: authError };

        const { data, error } = await supabase
            .from('profissionais')
            .insert({
                user_id: authData.user.id,
                nome: userData.nome,
                descricao: userData.descricao,
                especialidade: userData.especialidade,
                genero: userData.genero,
                endereco: userData.endereco
            });

        return { data, error };
    },

    // Atualizar perfil
    updateProfile: async (id, updates) => {
        const { data, error } = await supabase
            .from('profissionais')
            .update(updates)
            .eq('id', id)
            .select();

        return { data, error };
    },

    // Obter perfil do profissional
    getProfile: async (id) => {
        const { data, error } = await supabase
            .from('profissionais')
            .select(`
                *,
                servicos (
                    id,
                    nome,
                    preco,
                    duracao_minutos
                ),
                fotos_profissionais (
                    id,
                    foto_url,
                    descricao
                )
            `)
            .eq('id', id)
            .single();

        return { data, error };
    },

    // Buscar profissionais
    searchProfessionals: async (filters) => {
        const query = supabase
            .from('profissionais')
            .select(`
                *,
                servicos (
                    id,
                    nome,
                    preco,
                    duracao_minutos
                ),
                fotos_profissionais (
                    id,
                    foto_url,
                    descricao
                )
            `);

        if (filters.minPrice) {
            query.gte('servicos.preco', filters.minPrice);
        }
        if (filters.maxPrice) {
            query.lte('servicos.preco', filters.maxPrice);
        }
        if (filters.location) {
            query.ilike('endereco', `%${filters.location}%`);
        }
        if (filters.gender) {
            query.eq('genero', filters.gender);
        }
        if (filters.specialty) {
            query.eq('especialidade', filters.specialty);
        }

        const { data, error } = await query;
        return { data, error };
    }
};

// API para Serviços
export const apiServicos = {
    // Adicionar serviço
    addService: async (serviceData) => {
        const { data, error } = await supabase
            .from('servicos')
            .insert(serviceData)
            .select();

        return { data, error };
    },

    // Atualizar serviço
    updateService: async (id, updates) => {
        const { data, error } = await supabase
            .from('servicos')
            .update(updates)
            .eq('id', id)
            .select();

        return { data, error };
    },

    // Remover serviço
    deleteService: async (id) => {
        const { data, error } = await supabase
            .from('servicos')
            .delete()
            .eq('id', id);

        return { data, error };
    }
};

// API para Agendamentos
export const apiAgendamentos = {
    // Criar agendamento
    createAppointment: async (appointmentData) => {
        const { data, error } = await supabase
            .from('agendamentos')
            .insert(appointmentData)
            .select();

        return { data, error };
    },

    // Listar agendamentos do profissional
    listProfessionalAppointments: async (professionalId) => {
        const { data, error } = await supabase
            .from('agendamentos')
            .select(`
                *,
                servicos (
                    id,
                    nome,
                    preco
                )
            `)
            .eq('profissional_id', professionalId)
            .order('data_agendamento', { ascending: true });

        return { data, error };
    },

    // Listar agendamentos do cliente
    listClientAppointments: async (clientId) => {
        const { data, error } = await supabase
            .from('agendamentos')
            .select(`
                *,
                servicos (
                    id,
                    nome,
                    preco
                ),
                profissionais (
                    id,
                    nome,
                    foto_perfil_url
                )
            `)
            .eq('cliente_id', clientId)
            .order('data_agendamento', { ascending: true });

        return { data, error };
    },

    // Atualizar status do agendamento
    updateAppointmentStatus: async (id, status) => {
        const { data, error } = await supabase
            .from('agendamentos')
            .update({ status })
            .eq('id', id)
            .select();

        return { data, error };
    }
};

// API para Avaliações
export const apiAvaliacoes = {
    // Criar avaliação
    createReview: async (reviewData) => {
        const { data, error } = await supabase
            .from('avaliacoes_clientes')
            .insert(reviewData)
            .select();

        return { data, error };
    },

    // Listar avaliações do profissional
    listProfessionalReviews: async (professionalId) => {
        const { data, error } = await supabase
            .from('avaliacoes_clientes')
            .select(`
                *,
                auth.users:cliente_id (
                    id,
                    email
                )
            `)
            .eq('profissional_id', professionalId)
            .order('created_at', { ascending: false });

        return { data, error };
    },

    // Calcular nota média do profissional
    getAverageRating: async (professionalId) => {
        const { data, error } = await supabase
            .from('avaliacoes_clientes')
            .select('nota')
            .eq('profissional_id', professionalId);

        if (error) return { error };
        
        const total = data.reduce((sum, review) => sum + review.nota, 0);
        const average = data.length > 0 ? total / data.length : 0;
        
        return { data: { averageRating: average }, error: null };
    }
};

// API para Mensagens
export const apiMensagens = {
    // Enviar mensagem
    sendMessage: async (messageData) => {
        const { data, error } = await supabase
            .from('mensagens')
            .insert(messageData)
            .select();

        return { data, error };
    },

    // Listar conversas
    listConversations: async (userId) => {
        const { data, error } = await supabase
            .from('mensagens')
            .select(`
                *,
                auth.users:remetente_id (
                    id,
                    email
                ),
                auth.users:destinatario_id (
                    id,
                    email
                )
            `)
            .or(`remetente_id.eq.${userId},destinatario_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        return { data, error };
    },

    // Marcar mensagem como lida
    markAsRead: async (id) => {
        const { data, error } = await supabase
            .from('mensagens')
            .update({ lida_em: new Date() })
            .eq('id', id)
            .select();

        return { data, error };
    }
};

// API para Dashboard
export const apiDashboard = {
    // Obter estatísticas do dashboard
    getDashboardStats: async (professionalId, month, year) => {
        const { data, error } = await supabase
            .from('dashboard_estatisticas')
            .select(`
                total_agendamentos,
                total_receita,
                total_avaliacoes,
                nota_media
            `)
            .eq('profissional_id', professionalId)
            .eq('mes', month)
            .eq('ano', year)
            .single();

        return { data, error };
    },

    // Obter profissionais em destaque
    getFeaturedProfessionals: async () => {
        const { data, error } = await supabase
            .rpc('selecionar_profissionais_destaque');

        return { data, error };
    },

    // Obter notificações
    getNotifications: async (professionalId) => {
        const { data, error } = await supabase
            .from('notificacoes')
            .select('*')
            .eq('profissional_id', professionalId)
            .order('created_at', { ascending: false });

        return { data, error };
    }
};

// API para Planos
export const apiPlanos = {
    // Listar planos disponíveis
    listPlans: async () => {
        const { data, error } = await supabase
            .from('planos')
            .select('*');

        return { data, error };
    },

    // Obter plano atual
    getCurrentPlan: async (professionalId) => {
        const { data, error } = await supabase
            .from('assinaturas')
            .select(`
                *,
                planos (
                    id,
                    nome,
                    preco,
                    descricao,
                    beneficios
                )
            `)
            .eq('profissional_id', professionalId)
            .order('data_fim', { ascending: false })
            .limit(1)
            .single();

        return { data, error };
    },

    // Atualizar assinatura
    updateSubscription: async (professionalId, planId) => {
        const { data, error } = await supabase
            .from('assinaturas')
            .insert({
                profissional_id: professionalId,
                plano_id: planId,
                data_inicio: new Date(),
                data_fim: new Date(new Date().setMonth(new Date().getMonth() + 1))
            })
            .select();

        return { data, error };
    }
};
