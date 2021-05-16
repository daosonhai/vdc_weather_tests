import SERP from "../Interface/SERP";

Cypress.Commands.add('searchCity', keywork => {
    cy.get(SERP.txtSearch).scrollIntoView().type(String(keywork), { delay: 100, force: true });
    cy.get(SERP.btnSubmit).click();
    cy.get(SERP.citySuggestion).first().click();
})