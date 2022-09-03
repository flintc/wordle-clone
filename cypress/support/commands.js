// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "@testing-library/cypress/add-commands";

Cypress.Commands.add("findGridItem", function (round, pos) {
  return cy.findByTestId(`round-${round}-pos-${pos}`);
});

Cypress.Commands.add(
  "isCorrect",
  {
    prevSubject: "element",
  },
  (subject) => {
    cy.wrap(subject)
      .should("have.class", "bg-correct-3")
      .should("not.have.class", "bg-semicorrect-3");
  }
);

Cypress.Commands.add(
  "isSemiCorrect",
  {
    prevSubject: "element",
  },
  (subject) => {
    cy.wrap(subject)
      .should("not.have.class", "bg-correct-3")
      .should("have.class", "bg-semicorrect-3");
  }
);

Cypress.Commands.add(
  "isIncorrect",
  {
    prevSubject: "element",
  },
  (subject) => {
    cy.wrap(subject)
      .should("not.have.class", "bg-correct-3")
      .should("not.have.class", "bg-semicorrect-3");
  }
);
