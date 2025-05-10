describe('Notifications', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.login();
    });

    it('should display notifications list', () => {
        cy.get('[data-testid="notifications-button"]').click();
        cy.get('[data-testid="notification-item"]').should('be.visible');
        cy.get('[data-testid="unread-count"]').should('exist');
    });

    it('should mark notification as read', () => {
        cy.get('[data-testid="notifications-button"]').click();
        cy.get('[data-testid="notification-item"]').first().click();
        cy.get('[data-testid="unread-count"]').should('not.exist');
    });

    it('should mark all notifications as read', () => {
        cy.get('[data-testid="notifications-button"]').click();
        cy.get('[data-testid="mark-all-read"]').click();
        cy.get('[data-testid="unread-count"]').should('not.exist');
    });

    it('should handle API errors gracefully', () => {
        cy.intercept('GET', '/api/notifications', {
            statusCode: 500,
            body: { error: 'Internal Server Error' }
        });

        cy.get('[data-testid="notifications-button"]').click();
        cy.get('[data-testid="error-message"]').should('be.visible');
    });
});
