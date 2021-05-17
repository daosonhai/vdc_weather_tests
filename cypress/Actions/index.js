import Cookie from '../Interface/Cookie';
import './SnapshotService';
import './SERP';


Cypress.Cookies.defaults({
    preserve: [Cookie.stickFooterPanel]
})