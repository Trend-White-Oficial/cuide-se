import { supabase } from './supabase';

// API para Perfis de Clientes
export const apiPerfis = {
    // Criar perfil
    createProfile: async (profileData) => {
        const { data, error } = await supabase
            .from('perfis_clientes')
            .insert(profileData)
            .select();

        return { data, error };
    },

    // Atualizar perfil (exceto CPF, email e nome)
    updateProfile: async (id, updates) => {
        // Remover campos que não podem ser atualizados
        const allowedUpdates = {
            telefone: updates.telefone,
            foto_perfil_url: updates.foto_perfil_url,
            profissao: updates.profissao,
            sobre_mim: updates.sobre_mim,
            endereco: updates.endereco,
            bairro: updates.bairro,
            cidade: updates.cidade,
            estado: updates.estado,
            cep: updates.cep
        };

        const { data, error } = await supabase
            .from('perfis_clientes')
            .update(allowedUpdates)
            .eq('id', id)
            .select();

        return { data, error };
    },

    // Obter perfil
    getProfile: async (id) => {
        const { data, error } = await supabase
            .from('perfis_clientes')
            .select(`
                *,
                documentos_verificados (
                    id,
                    tipo_documento,
                    documento_url,
                    status_verificacao,
                    observacoes
                ),
                recompensas (
                    id,
                    tipo,
                    valor,
                    descricao,
                    status,
                    data_emissao,
                    data_utilizacao
                )
            `)
            .eq('id', id)
            .single();

        return { data, error };
    },

    // Verificar documentos
    verifyDocuments: async (id, documentData) => {
        const { data, error } = await supabase
            .from('documentos_verificados')
            .insert({
                perfil_id: id,
                tipo_documento: documentData.tipo_documento,
                documento_url: documentData.documento_url,
                status_verificacao: 'pendente'
            })
            .select();

        return { data, error };
    }
};

// API para Indicações
export const apiIndicacoes = {
    // Criar indicação
    createReferral: async (indicadorId, indicadoId) => {
        const { data: rewards, error: rewardsError } = await supabase
            .rpc('calcular_recompensas', {
                indicador_id: indicadorId,
                indicado_id: indicadoId
            });

        if (rewardsError) return { error: rewardsError };

        const { data, error } = await supabase
            .from('indicacoes')
            .insert({
                indicador_id: indicadorId,
                indicado_id: indicadoId,
                recompensa_indicador: rewards[0].recompensa_indicador,
                recompensa_indicado: rewards[0].recompensa_indicado
            })
            .select();

        return { data, error };
    },

    // Confirmar indicação
    confirmReferral: async (id) => {
        const { data, error } = await supabase
            .from('indicacoes')
            .update({
                status: 'confirmado',
                data_confirmacao: new Date(),
                recompensa_confirmada: true
            })
            .eq('id', id)
            .select();

        return { data, error };
    },

    // Listar indicações
    listReferrals: async (userId) => {
        const { data, error } = await supabase
            .from('indicacoes')
            .select(`
                *,
                indicador:indicador_id (
                    nome_completo,
                    foto_perfil_url
                ),
                indicado:indicado_id (
                    nome_completo,
                    foto_perfil_url
                )
            `)
            .or(`indicador_id.eq.${userId},indicado_id.eq.${userId}`)
            .order('data_indicacao', { ascending: false });

        return { data, error };
    },

    // Obter recompensas disponíveis
    getAvailableRewards: async (userId) => {
        const { data, error } = await supabase
            .from('recompensas')
            .select('*')
            .eq('cliente_id', userId)
            .eq('status', 'pendente')
            .order('data_emissao', { ascending: false });

        return { data, error };
    },

    // Utilizar recompensa
    useReward: async (rewardId) => {
        const { data, error } = await supabase
            .from('recompensas')
            .update({
                status: 'utilizado',
                data_utilizacao: new Date()
            })
            .eq('id', rewardId)
            .select();

        return { data, error };
    }
};
