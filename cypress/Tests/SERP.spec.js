///<reference types = 'Cypress'/>

import SERP from '../Interface/SERP';
import URL from '../Interface/URL';
import API from '../Interface/API';
import Cookie from '../Interface/Cookie';
import Modal from '../Interface/Modal';


Cypress.config('defaultCommandTimeout ', 10000);

context('Open Weather - SERP - UI Level', () => {
    before('Visit the main page', () => {
        cy.setCookie(Cookie.stickFooterPanel, 'false');
    })

    beforeEach('Setup network mornitoring', () => {
        cy.intercept({ pathname: API.dataOneCall }, req => {
            req.continue(res => {
                expect(res.statusCode).to.eq(200);
            })
        }).as('dataLoaded');

        cy.intercept({ pathname: API.dataFind }, req => {
            req.continue(res => {
                expect(res.statusCode).to.eq(200);
            })
        }).as('citySuggestionLoaded');
    })

    it("TC1 - Verify user can search a valid given city", () => {
        const testCities = ['Ho Chi Minh', 'tokyo', 'Bern, CH'];

        cy.visit(URL.serpPage);
        cy.wait('@dataLoaded');
        cy.wrap(testCities).each(city => {
            cy.searchCity(city);
            cy.wait('@citySuggestionLoaded').then(({ response }) => {
                const { body: { list: [selectedCity] } } = response;

                cy.wait('@dataLoaded').then(({ request, response }) => {
                    const { body: { lat: actualLat, lon: actualLon } } = response;

                    expect(request.url).include(`lat=${selectedCity.coord.lat}`);
                    expect(request.url).include(`lon=${selectedCity.coord.lon}`);
                    expect(actualLat).to.eq(selectedCity.coord.lat);
                    expect(actualLon).to.eq(selectedCity.coord.lon);
                    cy.url().should('contain', selectedCity.id);
                    cy.getCookie(Cookie.cityId).should('have.property', 'value', String(selectedCity.id));
                });
            });
        })
    })

    //Data-driven testing can't work well on this test case 'cause of Cypress issue #408
    it("TC2 - Verify current city's weather is automatically displayed when openning the page", () => {
        const testCities = [
            { id: '2660764', name: 'Flamatt, CH' }
        ];

        cy.wrap(testCities).each(city => {
            cy.clearCookie(Cookie.cityId);
            cy.setCookie(Cookie.cityId, city.id);
            cy.visit(URL.serpPage);
            cy.wait('@dataLoaded');
            cy.get(SERP.cityName).should('contain', city.name);
        })
    })

    it.only("TC3 - Verify API error codes returned are handled properly", () => {
        const errorCodes = [
            { code: 500, body: { cod: 500, message: "Internal server error" } },
            { code: 422, body: { code: 422, message: "invalid input, please retype your city" } },
            { code: 401, body: { cod: 401, message: "Invalid API key. Please see http://openweathermap.org/faq#error401 for more info." } }
        ];

        cy.visit(URL.serpPage);
        cy.wrap(errorCodes).each(({ code, body }) => {
            cy.intercept({ pathname: API.dataFind }, req => {
                req.continue(res => {
                    res.statusCode = code;
                    res.body = body;
                })
            }).as(`mockedError${code}`);

            cy.searchCity('Bien Hoa, VN');
            cy.wait(`@mockedError${code}`).then(({ response }) => {
                expect(response.statusCode).to.equal(code)
            });
            switch (code) {
                case 500:
                    //Assume a modal dialog is shown when error 500 is returned
                    cy.get(Modal.frmErrorModal).should('be.visible');
                    break;
                case 422:
                    //Assume an error validation message is shown when error 422 is returned
                    cy.get(SERP.msgValidationError).should('be.visible').should('contain', body.message);
                    break;

                case 401:
                    //Assume browser redirect to login page when error 401 is returned
                    cy.url().should('contain', 'login');
                    break;
            }
        })
    })

    it("TC4 - Verify city suggestions are displayed in the default measure system", () => {
        const measureSystems = ['metric', 'imperial'];
        const mockedDataFind = require('../Datasets/mockedDataFind.json');

        cy.visit(URL.serpPage);
        cy.wait('@dataLoaded');
        cy.intercept({ pathname: API.dataFind }, req => {
            req.continue(res => {
                res.statusCode = 200;
                res.body = mockedDataFind;
            })
        }).as('suggestionLoaded');

        cy.wrap(measureSystems).each(system => {
            cy.selectMeasureSystem(system);
            cy.get(SERP.txtSearch).scrollIntoView().type('zurich,ch{enter}', { force: true });
            cy.wait('@suggestionLoaded');
            cy.get(SERP.citySuggestions).scrollIntoView().matchImageSnapshot(`${system} - Suggested Cities`);
        })
    })

    it("TC5 - Verify invalid data is validated", () => {
        //The way to implement this test case will be similar to the TC1, so I won't write it down
    })

    it("TC6 - Verify layout isn't broken on different screen sizes", () => {
        //The way to implement this test case will be similar to the TC4, so I won't write it down
    })
})