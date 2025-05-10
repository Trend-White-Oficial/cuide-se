describe('Promotions', () => {
    beforeEach(() => {
        cy.visit('/promotions');
        cy.login();
    });

    it('should display promotions list', () => {
        cy.get('[data-testid="promotions-list"]').should('be.visible');
        cy.get('[data-testid="promotion-item"]').should('be.visible');
    });

    it('should add new promotion', () => {
        cy.get('[data-testid="add-promotion-button"]').click();
        
        cy.get('[data-testid="promotion-title"]').type('Test Promotion');
        cy.get('[data-testid="original-price"]').type('200.00');
        cy.get('[data-testid="discounted-price"]').type('150.00');
        cy.get('[data-testid="start-date"]').type('2024-05-10');
        cy.get('[data-testid="end-date"]').type('2024-05-15');
        
        cy.get('[data-testid="save-promotion-button"]').click();
        
        cy.get('[data-testid="promotion-item"]').contains('Test Promotion').should('be.visible');
    });

    it('should update promotion', () => {
        cy.get('[data-testid="promotion-item"]').first().click();
        cy.get('[data-testid="edit-promotion-button"]').click();
        
        cy.get('[data-testid="promotion-title"]').clear().type('Updated Promotion');
        cy.get('[data-testid="save-promotion-button"]').click();
        
        cy.get('[data-testid="promotion-item"]').contains('Updated Promotion').should('be.visible');
    });

    it('should delete promotion', () => {
        cy.get('[data-testid="promotion-item"]').first().click();
        cy.get('[data-testid="delete-promotion-button"]').click();
        
        cy.get('[data-testid="promotion-item"]').should('not.contain', 'Updated Promotion');
    });

    it('should handle API errors gracefully', () => {
        cy.intercept('GET', '/api/promotions', {
            statusCode: 500,
            body: { error: 'Internal Server Error' }
        });

        cy.get('[data-testid="promotions-list"]').should('be.visible');
        cy.get('[data-testid="error-message"]').should('be.visible');
    });

    it('should show notifications for new promotions', () => {
        cy.intercept('POST', '/api/notifications', {
            statusCode: 200,
            body: { message: 'New notification created' }
        });

        cy.get('[data-testid="add-promotion-button"]').click();
        cy.get('[data-testid="promotion-title"]').type('New Promotion');
        cy.get('[data-testid="save-promotion-button"]').click();
        
        cy.get('[data-testid="notifications-button"]').click();
        cy.get('[data-testid="notification-item"]').contains('Nova Promoção').should('be.visible');
    });
});
