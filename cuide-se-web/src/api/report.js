import { supabase } from '../supabase';

export const apiRelatorios = {
    // Criar novo relatório
    createReport: async (formData) => {
        try {
            const { data, error } = await supabase
                .from('relatorios')
                .insert({
                    tipo: formData.get('tipo'),
                    titulo: formData.get('titulo'),
                    descricao: formData.get('descricao'),
                    evidencia_url: formData.get('evidencia') ? await uploadEvidence(formData.get('evidencia')) : null
                })
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Listar relatórios
    listReports: async (filters = {}) => {
        try {
            let query = supabase
                .from('relatorios')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url
                    )
                `);

            if (filters.tipo) {
                query = query.eq('tipo', filters.tipo);
            }

            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.dataInicial) {
                query = query.gte('created_at', filters.dataInicial);
            }

            if (filters.dataFinal) {
                query = query.lte('created_at', filters.dataFinal);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Atualizar status do relatório
    updateReportStatus: async (reportId, status) => {
        try {
            const { data, error } = await supabase
                .from('relatorios')
                .update({ status })
                .eq('id', reportId)
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Marcar relatório como resolvido
    markAsResolved: async (reportId, resolvidoPor) => {
        try {
            const { data, error } = await supabase
                .from('relatorios')
                .update({
                    status: 'resolvido',
                    resolvido_por: resolvidoPor,
                    data_resolucao: new Date()
                })
                .eq('id', reportId)
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    }
};

// Função auxiliar para upload de evidências
const uploadEvidence = async (file) => {
    try {
        const { data, error } = await supabase.storage
            .from('evidencias')
            .upload(`evidence_${Date.now()}_${file.name}`, file);

        if (error) throw error;
        return data.path;
    } catch (error) {
        throw error;
    }
};
