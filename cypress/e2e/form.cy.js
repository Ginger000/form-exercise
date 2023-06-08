describe('Form', () => {
    beforeEach(() => {
        // Visit the page before each test case
        cy.visit('https://form-exercise-roan.vercel.app/');
    });

    it('fills out the form, submits it, and navigates through the form', () => {
        // Test filling out the user information form
        cy.get('input[name=name]').type('John Doe');
        cy.get('input[name=email]').type('john@example.com');
        cy.get('button[type=submit]').click();

        // Test filling out the survey form
        cy.get('select[name=question1]').select('Bagel');
        cy.get('select[name=question2]').select('Water');
        cy.get('button[type=submit]').click();

        // Test the confirm page
        cy.contains('Confirmation');
        cy.contains('Name: John Doe');
        cy.contains('Email: john@example.com');
        cy.contains('Question 1 Breakfast choice: Bagel');
        cy.contains('Question 2 Drink choice: Water');

        // Go back to survey
        cy.get('button').contains('Back').click();
        cy.contains('Survey');

        // Go back to user info
        cy.get('button').contains('Back').click();
        cy.contains('User Information');

        // Proceed forward again
        cy.get('button[type=submit]').click();
        cy.contains('Survey');
        cy.get('button[type=submit]').click();
        cy.contains('Confirmation');

        // Test form submission
        cy.get('button').contains('Submit').click();
        cy.contains('Form Submitted!');
    });
});
