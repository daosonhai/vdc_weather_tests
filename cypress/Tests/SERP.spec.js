///<reference types = 'Cypress'/>

import SERP from '../Interface/SERP';
import URL from '../Interface/URL';
import API from '../Interface/API';
import Cookie from '../Interface/Cookie';


Cypress.config('defaultCommandTimeout ', 10000);

context('Open Weather - SERP', () => {
    before('Visit the main page', () => {
        cy.intercept({ pathname: API.dataOneCall }, req => {
            req.continue(res => {
                expect(res.statusCode).to.eq(200);
            })
        }).as('dataLoaded');

        cy.setCookie(Cookie.stickFooterPanel, 'false');
        cy.visit(URL.serpPage);
        cy.wait('@dataLoaded');
    })

    beforeEach('Setup network mornitoring', () => {
        cy.intercept({ pathname: API.dataFind }, req => {
            req.continue(res => {
                expect(res.statusCode).to.eq(200);
            })
        }).as('citySuggestionLoaded');
    })

    it("TC1 - User can search a valid given city", () => {
        const testCities = ['Ho Chi Minh', 'tokyo'];

        cy.wrap(testCities).each(city => {
            cy.get(SERP.txtSearch).scrollIntoView().type(city, { delay: 100 });
            cy.get(SERP.btnSubmit).click();
            cy.wait('@citySuggestionLoaded').then(({ response }) => {
                const { body: { list: [selectedCity] } } = response;

                cy.get(SERP.citySuggestion).first().click();
                cy.wait('@dataLoaded').then(({ request, response }) => {
                    const { body: { lat: actualLat, lon: actualLon } } = response;

                    expect(request.url).include(`lat=${selectedCity.coord.lat}`);
                    expect(request.url).include(`lon=${selectedCity.coord.lon}`);
                    expect(actualLat).to.eq(selectedCity.coord.lat);
                    expect(actualLon).to.eq(selectedCity.coord.lon);
                    cy.url().should('contain', selectedCity.id);
                    cy.getCookie(Cookie.cityId).then(({ value }) => {
                        expect(Number(value)).to.eq(selectedCity.id);
                    });
                });
            });
        })
    })

})