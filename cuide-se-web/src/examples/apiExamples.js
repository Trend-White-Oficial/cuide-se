import { apiProfissionais, apiServicos, apiAgendamentos, apiAvaliacoes, apiMensagens, apiDashboard, apiPlanos } from '../api/api';

// Exemplo de registro de profissional
async function registerProfessional() {
    try {
        const userData = {
            email: 'profissional@email.com',
            password: 'senha123',
            nome: 'Maria Silva',
            descricao: 'Profissional especializada em cuidados pessoais',
            especialidade: 'Estética',
            genero: 'Feminino',
            endereco: 'Rua das Flores, 123'
        };

        const { data, error } = await apiProfissionais.register(userData);
        
        if (error) throw error;
        
        console.log('Profissional registrado com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao registrar profissional:', error);
        throw error;
    }
}

// Exemplo de adicionar serviço
async function addService(profissionalId) {
    try {
        const serviceData = {
            profissional_id: profissionalId,
            nome: 'Massagem Relaxante',
            descricao: 'Massagem relaxante de 60 minutos',
            preco: 150.00,
            duracao_minutos: 60
        };

        const { data, error } = await apiServicos.addService(serviceData);
        
        if (error) throw error;
        
        console.log('Serviço adicionado com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao adicionar serviço:', error);
        throw error;
    }
}

// Exemplo de criar agendamento
async function createAppointment(profissionalId, servicoId) {
    try {
        const appointmentData = {
            profissional_id: profissionalId,
            cliente_id: 'cliente-id',
            servico_id: servicoId,
            data_agendamento: new Date('2025-05-15T14:00:00'),
            status: 'pendente',
            preco: 150.00,
            endereco: 'Rua das Flores, 123',
            observacoes: 'Primeira visita'
        };

        const { data, error } = await apiAgendamentos.createAppointment(appointmentData);
        
        if (error) throw error;
        
        console.log('Agendamento criado com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        throw error;
    }
}

// Exemplo de criar avaliação
async function createReview(profissionalId) {
    try {
        const reviewData = {
            profissional_id: profissionalId,
            cliente_id: 'cliente-id',
            nota: 5,
            comentario: 'Excelente serviço! Profissional muito atenciosa.'
        };

        const { data, error } = await apiAvaliacoes.createReview(reviewData);
        
        if (error) throw error;
        
        console.log('Avaliação criada com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        throw error;
    }
}

// Exemplo de enviar mensagem
async function sendMessage(profissionalId) {
    try {
        const messageData = {
            remetente_id: 'cliente-id',
            destinatario_id: profissionalId,
            mensagem: 'Olá! Gostaria de agendar um horário para amanhã.'
        };

        const { data, error } = await apiMensagens.sendMessage(messageData);
        
        if (error) throw error;
        
        console.log('Mensagem enviada com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
    }
}

// Exemplo de atualizar assinatura
async function updateSubscription(profissionalId) {
    try {
        const { data: plans, error: plansError } = await apiPlanos.listPlans();
        if (plansError) throw plansError;

        // Seleciona o plano completo (79,90)
        const completePlan = plans.find(plan => plan.preco === 79.9);
        
        if (!completePlan) throw new Error('Plano não encontrado');

        const { data, error } = await apiPlanos.updateSubscription(profissionalId, completePlan.id);
        
        if (error) throw error;
        
        console.log('Assinatura atualizada com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao atualizar assinatura:', error);
        throw error;
    }
}

// Exemplo de uso
async function main() {
    try {
        // 1. Registrar profissional
        const professional = await registerProfessional();
        
        // 2. Adicionar serviço
        const service = await addService(professional.user.id);
        
        // 3. Criar agendamento
        await createAppointment(professional.user.id, service[0].id);
        
        // 4. Criar avaliação
        await createReview(professional.user.id);
        
        // 5. Enviar mensagem
        await sendMessage(professional.user.id);
        
        // 6. Atualizar assinatura
        await updateSubscription(professional.user.id);
        
        console.log('Todas as operações foram realizadas com sucesso!');
    } catch (error) {
        console.error('Erro ao executar exemplos:', error);
    }
}

// Executar exemplos
main();
