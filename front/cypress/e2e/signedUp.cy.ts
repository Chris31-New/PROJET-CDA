describe("Sign Up", () => {
    it("should Sign Up and Create Profile", () => {
        cy.visit("/signup");
        cy.get('input[name="email"]').type("example5@gmail.com");
        cy.get('input[name="password"]').type("Password123!");
        cy.get('input[name="confirmPassword"]').type("Password123!");
        cy.get('select[name="role"]').select("Individual");
        cy.get('.signup').click();

        cy.visit("/signin");
        cy.get('input[name="email"]').type("example5@gmail.com");
        cy.get('input[name="password"]').type("Password123!");
        cy.get('button[type="submit"]').click();
        
        cy.get('.burger-button').eq(0).click();
        cy.get('a[href*="profile"]').eq(1).click();
        cy.url().should("include", "/user-profile");
        cy.get('.create-profile').eq(0).click();
        cy.get('input[name="firstName"]').type("Dimitri");
        cy.get('input[name="lastName"]').type("Brisbart");
        cy.get('input[name="phone"]').type("06 42 60 77 21");
        cy.get('.create-profile').eq(1).click();
    })
})