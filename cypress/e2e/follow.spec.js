describe('Follow', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.login();
    });

    it('should follow/unfollow professional', () => {
        cy.get('[data-testid="professional-card"]').first().click();
        
        cy.get('[data-testid="follow-button"]').should('contain', 'Seguir');
        cy.get('[data-testid="follow-button"]').click();
        
        cy.get('[data-testid="follow-button"]').should('contain', 'Seguindo');
        cy.get('[data-testid="follow-button"]').click();
        
        cy.get('[data-testid="follow-button"]').should('contain', 'Seguir');
    });

    it('should display following list', () => {
        cy.get('[data-testid="following-button"]').click();
        
        cy.get('[data-testid="following-list"]').should('be.visible');
        cy.get('[data-testid="following-item"]').should('be.visible');
    });

    it('should handle API errors gracefully', () => {
        cy.intercept('GET', '/api/following', {
            statusCode: 500,
            body: { error: 'Internal Server Error' }
        });

        cy.get('[data-testid="following-button"]').click();
        cy.get('[data-testid="error-message"]').should('be.visible');
    });

    it('should show notifications for new followers', () => {
        cy.intercept('POST', '/api/notifications', {
            statusCode: 200,
            body: { message: 'New notification created' }
        });

        cy.get('[data-testid="professional-card"]').first().click();
        cy.get('[data-testid="follow-button"]').click();
        
        cy.get('[data-testid="notifications-button"]').click();
        cy.get('[data-testid="notification-item"]').contains('Novo Seguidor').should('be.visible');
    });
});
