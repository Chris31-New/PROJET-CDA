describe("Signin page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/signin");
  });

  it("should display the login form", () => {
    cy.contains("Sign in");
    cy.get('input[role="email"]').should("exist");
    cy.get('input[role="password"]').should("exist");
    cy.get('[data-cy="login"]').should("contain", "Log in");
  });

  it("should show errors when submitting empty form", () => {
    cy.get('[data-cy="login"]').click();

    cy.contains("L'email est requis");
    cy.contains("Le mot de passe est requis");
  });

  it("should show error for invalid email", () => {
    cy.get('input[role="email"]').type("invalid-email");
    cy.get('input[role="password"]').type("123456");

    cy.get('[data-cy="login"]').click();

    cy.contains("Adresse email invalide").should("be.visible");
  });

  it("should allow user to type in inputs", () => {
    cy.get('input[role="email"]')
      .type("test@test.com")
      .should("have.value", "test@test.com");
    cy.get('input[role="password"]')
      .type("password123")
      .should("have.value", "password123");
  });

  it("should submit form and redirect on success", () => {
    cy.get('input[role="email"]').type("manager1@example.com");
    cy.get('input[role="password"]').type("password123!");

    cy.get('[data-cy="login"]').click();

    cy.url().should("eq", "http://localhost:5173/");
  });
});
