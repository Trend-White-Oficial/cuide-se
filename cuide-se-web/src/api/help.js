import { supabase } from '../supabase';

export const apiFAQ = {
    // Listar todas as FAQs
    listFAQs: async (filters = {}) => {
        try {
            let query = supabase
                .from('faq')
                .select(`
                    *,
                    categoria (
                        nome,
                        descricao
                    )
                `);

            if (filters.categoria) {
                query = query.eq('categoria', filters.categoria);
            }

            if (filters.ativo !== undefined) {
                query = query.eq('ativo', filters.ativo);
            }

            const { data, error } = await query.order('ordem', { ascending: true });
            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Criar nova FAQ
    createFAQ: async (faqData) => {
        try {
            const { data, error } = await supabase
                .from('faq')
                .insert(faqData)
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Atualizar FAQ
    updateFAQ: async (faqId, updates) => {
        try {
            const { data, error } = await supabase
                .from('faq')
                .update(updates)
                .eq('id', faqId)
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Desativar FAQ
    deactivateFAQ: async (faqId) => {
        try {
            const { data, error } = await supabase
                .from('faq')
                .update({ ativo: false })
                .eq('id', faqId)
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    }
};

export const apiTutoriais = {
    // Listar todos os tutoriais
    listTutoriais: async (filters = {}) => {
        try {
            let query = supabase
                .from('tutoriais')
                .select(`
                    *,
                    categoria (
                        nome,
                        descricao
                    )
                `);

            if (filters.categoria) {
                query = query.eq('categoria', filters.categoria);
            }

            if (filters.ativo !== undefined) {
                query = query.eq('ativo', filters.ativo);
            }

            const { data, error } = await query.order('ordem', { ascending: true });
            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Criar novo tutorial
    createTutorial: async (tutorialData) => {
        try {
            const { data, error } = await supabase
                .from('tutoriais')
                .insert(tutorialData)
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Atualizar tutorial
    updateTutorial: async (tutorialId, updates) => {
        try {
            const { data, error } = await supabase
                .from('tutoriais')
                .update(updates)
                .eq('id', tutorialId)
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    },

    // Desativar tutorial
    deactivateTutorial: async (tutorialId) => {
        try {
            const { data, error } = await supabase
                .from('tutoriais')
                .update({ ativo: false })
                .eq('id', tutorialId)
                .select();

            return { data, error };
        } catch (error) {
            return { error };
        }
    }
};
