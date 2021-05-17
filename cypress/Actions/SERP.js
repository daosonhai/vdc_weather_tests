import SERP from "../Interface/SERP";
import Cookie from "../Interface/Cookie";


Cypress.Commands.add('searchCity', keywork => {
    cy.get(SERP.txtSearch).scrollIntoView().type(String(keywork), { delay: 100, force: true });
    cy.get(SERP.btnSubmit).click();
    cy.get(SERP.citySuggestion).first().click();
})

Cypress.Commands.add('selectMeasureSystem', system => {
    cy.get(SERP.measureSystems).scrollIntoView().contains(system, { matchCase: false }).click({ force: true });
    cy.getCookie(Cookie.units).should('have.property', 'value', String(system));
})