-- Inserir planos iniciais
INSERT INTO planos (nome, preco, descricao, beneficios, is_destaque)
VALUES 
    (
        'Gratuito',
        0,
        'Plano básico com anúncios',
        ARRAY[
            'Perfil básico',
            'Acesso a agendamentos',
            'Anúncios no feed',
            'Avaliações de clientes'
        ],
        false
    ),
    (
        'Completo',
        79.90,
        'Plano completo sem anúncios',
        ARRAY[
            'Perfil premium',
            'Sem anúncios',
            'Acesso completo',
            'Avaliações de clientes',
            'Estatísticas detalhadas',
            'Notificações em tempo real'
        ],
        false
    ),
    (
        'Destaque',
        109.90,
        'Plano premium com destaque',
        ARRAY[
            'Todas as funcionalidades do Completo',
            'Destaque em resultados de busca',
            'Badge de profissional destacado',
            'Prioridade em listagens',
            'Anúncios personalizados'
        ],
        true
    );
