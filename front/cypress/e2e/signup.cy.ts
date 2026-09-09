import { faker } from "@faker-js/faker";

describe("Signup page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/signup");
  });

  it("should display signup form", () => {
    cy.contains("Sign Up");
    cy.get('input[role="email"]').should("exist");
    cy.get('input[role="password"]').should("exist");
    cy.get('input[role="confirmPassword"]').should("exist");
    cy.get("select#role").should("exist");
    cy.get('[data-cy="signup"]').should("exist");
  });

  it("should show validation errors when fields are empty", () => {
    cy.get('[data-cy="signup"]').click();

    cy.contains("L'email est requis");
    cy.contains("Le mot de passe est requis");
    cy.contains("Veuillez confirmer votre mot de passe");
    cy.contains("Role is required");
  });

  it("should show error for invalid email", () => {
    cy.get('input[role="email"]').type("invalid-email");
    cy.get('[data-cy="signup"]').click();

    cy.contains("Adresse email invalide");
  });

  it("should show error when passwords do not match", () => {
    cy.get('input[role="email"]').type(faker.internet.email());
    cy.get('input[role="password"]').type("Password1");
    cy.get('input[role="confirmPassword"]').type("Password2");

    cy.get('[data-cy="signup"]').click();

    cy.contains("Les mots de passe ne correspondent pas");
  });

  it("should show error for weak password", () => {
    cy.get('input[role="email"]').type(faker.internet.email());
    cy.get('input[role="password"]').type("pass"); // too weak
    cy.get('input[role="confirmPassword"]').type("pass");

    cy.get('[data-cy="signup"]').click();

    cy.contains("Le mot de passe doit contenir au moins 8 caractères");
  });

  it("should signup successfully with valid data", () => {
    const fakeEmail = faker.internet.email();
    const password = "Password123!";

    cy.get('input[role="email"]').type(fakeEmail);
    cy.get('input[role="password"]').type(password);
    cy.get('input[role="confirmPassword"]').type(password);
    cy.get("#role").select("INDIVIDUAL");

    cy.get('[data-cy="signup"]').click();

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Inscription successful! Please log in.");
    });

    cy.url().should("include", "/signin");
  });
});
