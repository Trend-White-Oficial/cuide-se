import { supabase } from './supabase';

// API para gerenciamento de assinaturas
export const apiAssinaturas = {
    // Criar assinatura
    createSubscription: async (subscriptionData) => {
        const { data, error } = await supabase
            .from('assinaturas')
            .insert(subscriptionData)
            .select();

        return { data, error };
    },

    // Atualizar status de assinatura
    updateSubscriptionStatus: async (id, status) => {
        const { data, error } = await supabase
            .from('assinaturas')
            .update({ status })
            .eq('id', id)
            .select();

        return { data, error };
    },

    // Obter assinatura ativa
    getActiveSubscription: async (perfilId) => {
        const { data, error } = await supabase
            .from('assinaturas')
            .select(`
                *,
                plano:plano_id (
                    nome,
                    descricao,
                    valor,
                    beneficios,
                    duracao_dias
                )
            `)
            .eq('perfil_id', perfilId)
            .eq('status', 'ativo')
            .order('data_inicio', { ascending: false })
            .single();

        return { data, error };
    },

    // Listar histórico de assinaturas
    listSubscriptionHistory: async (perfilId) => {
        const { data, error } = await supabase
            .from('assinaturas')
            .select(`
                *,
                plano:plano_id (
                    nome,
                    descricao,
                    valor,
                    beneficios,
                    duracao_dias
                )
            `)
            .eq('perfil_id', perfilId)
            .order('data_inicio', { ascending: false });

        return { data, error };
    }
};

// API para gerenciamento de transações
export const apiTransacoes = {
    // Criar transação
    createTransaction: async (transactionData) => {
        const { data, error } = await supabase
            .from('transacoes')
            .insert(transactionData)
            .select();

        return { data, error };
    },

    // Atualizar status de transação
    updateTransactionStatus: async (id, status) => {
        const { data, error } = await supabase
            .from('transacoes')
            .update({ status })
            .eq('id', id)
            .select();

        return { data, error };
    },

    // Listar transações
    listTransactions: async (perfilId, filters = {}) => {
        const query = supabase
            .from('transacoes')
            .select(`
                *,
                extrato:transacao_id (
                    saldo_anterior,
                    saldo_atual
                )
            `)
            .eq('perfil_id', perfilId);

        if (filters.tipo) {
            query.eq('tipo', filters.tipo);
        }

        if (filters.categoria) {
            query.eq('categoria', filters.categoria);
        }

        if (filters.dataInicial) {
            query.gte('data_transacao', filters.dataInicial);
        }

        if (filters.dataFinal) {
            query.lte('data_transacao', filters.dataFinal);
        }

        const { data, error } = await query
            .order('data_transacao', { ascending: false });

        return { data, error };
    },

    // Obter saldo atual
    getBalance: async (perfilId) => {
        const { data, error } = await supabase
            .rpc('calcular_saldo_atual', {
                perfil_id: perfilId
            });

        return { data, error };
    }
};

// API para gerenciamento de comprovantes
export const apiComprovantes = {
    // Enviar comprovante
    uploadReceipt: async (transactionId, file) => {
        const { data, error } = await supabase
            .storage
            .from('comprovantes')
            .upload(`receipt_${transactionId}_${Date.now()}`, file);

        if (error) throw error;

        const { data: receiptData, error: receiptError } = await supabase
            .from('comprovantes_pagamento')
            .insert({
                transacao_id: transactionId,
                arquivo_url: data.path,
                tipo_arquivo: file.type
            })
            .select();

        return { data: receiptData, error: receiptError };
    },

    // Verificar comprovante
    verifyReceipt: async (receiptId, status, observations = '') => {
        const { data, error } = await supabase
            .from('comprovantes_pagamento')
            .update({
                status_verificacao: status,
                observacoes: observations
            })
            .eq('id', receiptId)
            .select();

        return { data, error };
    }
};

// API para gerenciamento de documentos
export const apiDocumentos = {
    // Enviar documento
    uploadDocument: async (perfilId, tipoDocumento, file, isFront = true) => {
        const { data, error } = await supabase
            .storage
            .from('documentos')
            .upload(`document_${tipoDocumento}_${perfilId}_${Date.now()}_${isFront ? 'front' : 'back'}`, file);

        if (error) throw error;

        const { data: documentData, error: documentError } = await supabase
            .from('verificacao_documentos')
            .upsert({
                perfil_id: perfilId,
                tipo_documento: tipoDocumento,
                documento_front_url: isFront ? data.path : null,
                documento_back_url: !isFront ? data.path : null
            })
            .select();

        return { data: documentData, error: documentError };
    },

    // Verificar documento
    verifyDocument: async (documentId, status, observations = '') => {
        const { data, error } = await supabase
            .from('verificacao_documentos')
            .update({
                status_verificacao: status,
                observacoes: observations
            })
            .eq('id', documentId)
            .select();

        return { data, error };
    }
};
