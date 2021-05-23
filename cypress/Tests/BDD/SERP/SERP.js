///<reference types = 'Cypress'/>

import { Given, Then, When, And } from "cypress-cucumber-preprocessor/steps";
import SERP from '../../../Interface/SERP';
import URL from '../../../Interface/URL';

Given(`I visit OpenWeather page`, () => {
    cy.visit(URL.serpPage);
})

When(`I enter an weird {string}`, keyword => {
    cy.get(SERP.txtSearch).scrollIntoView().type(keyword, { delay: 100, force: true });
})

And('I click the Search button', () => {
    cy.get(SERP.btnSubmit).click();
})

Then('I see a hint message as following result table', datatable => {
    datatable.hashes().forEach(row => {
        cy.get(SERP.msgValidationError).should('be.visible').and('contain', row.result);
    })
})