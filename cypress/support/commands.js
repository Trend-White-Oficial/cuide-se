Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
            email: 'test@example.com',
            password: 'password123'
        }
    }).then((response) => {
        if (response.status === 200) {
            cy.setCookie('token', response.body.token);
        }
    });
});

Cypress.Commands.add('createTestUser', () => {
    cy.request({
        method: 'POST',
        url: '/api/auth/register',
        body: {
            email: 'test@example.com',
            password: 'password123',
            nome_completo: 'Test User',
            tipo_perfil: 'cliente'
        }
    });
});

Cypress.Commands.add('createTestProfessional', () => {
    cy.request({
        method: 'POST',
        url: '/api/auth/register',
        body: {
            email: 'professional@example.com',
            password: 'password123',
            nome_completo: 'Test Professional',
            tipo_perfil: 'profissional',
            especialidade: 'Manicure'
        }
    });
});

Cypress.Commands.add('createTestEvent', () => {
    cy.request({
        method: 'POST',
        url: '/api/events',
        body: {
            titulo: 'Test Event',
            data_inicio: '2024-05-10T10:00:00.000Z',
            data_fim: '2024-05-10T11:00:00.000Z'
        }
    });
});

Cypress.Commands.add('createTestPromotion', () => {
    cy.request({
        method: 'POST',
        url: '/api/promotions',
        body: {
            titulo: 'Test Promotion',
            valor_original: 200.00,
            valor_promocional: 150.00,
            data_inicio: '2024-05-10T00:00:00.000Z',
            data_fim: '2024-05-15T00:00:00.000Z'
        }
    });
});
