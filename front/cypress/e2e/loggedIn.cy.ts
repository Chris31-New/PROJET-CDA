describe("Sign In", () => {
    beforeEach(() => {
        cy.intercept("POST", "**/auth/login").as("loginReq");

        cy.visit("/signin");
        cy.get('input[name="email"]').type("manager1@example.com");
        cy.get('input[name="password"]').type("password123!");
        cy.get('button[type="submit"]').click();

        cy.wait("@loginReq").its("response.statusCode").should("be.oneOf", [200, 201]);
    })

    it("should signIn", () => {
        cy.getCookie("refreshToken", { timeout: 10000 }).should("exist");
    })

    it("should visit /profile", () => {
        cy.visit('/');
        cy.getCookie("refreshToken").should("exist");
        cy.get('.burger-button').eq(0).click();
        cy.get('a[href*="profile"]').eq(1).click();
        cy.url().should("include", "/user-profile");
    })
})