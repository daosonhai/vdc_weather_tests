///<reference types = 'Cypress'/>

import { Given, Then, When, And } from "cypress-cucumber-preprocessor/steps";
import SERP from '../../../Interface/SERP';
import URL from '../../../Interface/URL';

Given(`I visit OpenWeather page`, () => {
    cy.visit(URL.serpPage);
})

When(`I enter an weird {keyword}`, (keyword) => {
    cy.get(SERP.txtSearch).scrollIntoView().type(String(keyword), { delay: 100, force: true });
})

And('I click to search', () => {
    cy.get(SERP.btnSubmit).click();
})

Then('A hint message is displayed for me', () => {
    cy.get(SERP.msgValidationError).should('be.visible');
})