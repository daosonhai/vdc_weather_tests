import Cookie from '../Interface/Cookie'
import './SERP'


Cypress.Cookies.defaults({
    preserve: [Cookie.stickFooterPanel]
})