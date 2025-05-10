describe('Calendar', () => {
    beforeEach(() => {
        cy.visit('/calendar');
        cy.login();
    });

    it('should display events list', () => {
        cy.get('[data-testid="calendar"]').should('be.visible');
        cy.get('[data-testid="event-item"]').should('be.visible');
    });

    it('should add new event', () => {
        cy.get('[data-testid="add-event-button"]').click();
        
        cy.get('[data-testid="event-title"]').type('Test Event');
        cy.get('[data-testid="event-start-time"]').type('2024-05-10T10:00');
        cy.get('[data-testid="event-end-time"]').type('2024-05-10T11:00');
        
        cy.get('[data-testid="save-event-button"]').click();
        
        cy.get('[data-testid="event-item"]').contains('Test Event').should('be.visible');
    });

    it('should update event', () => {
        cy.get('[data-testid="event-item"]').first().click();
        cy.get('[data-testid="edit-event-button"]').click();
        
        cy.get('[data-testid="event-title"]').clear().type('Updated Event');
        cy.get('[data-testid="save-event-button"]').click();
        
        cy.get('[data-testid="event-item"]').contains('Updated Event').should('be.visible');
    });

    it('should delete event', () => {
        cy.get('[data-testid="event-item"]').first().click();
        cy.get('[data-testid="delete-event-button"]').click();
        
        cy.get('[data-testid="event-item"]').should('not.contain', 'Updated Event');
    });

    it('should handle API errors gracefully', () => {
        cy.intercept('GET', '/api/events', {
            statusCode: 500,
            body: { error: 'Internal Server Error' }
        });

        cy.get('[data-testid="calendar"]').should('be.visible');
        cy.get('[data-testid="error-message"]').should('be.visible');
    });
});
