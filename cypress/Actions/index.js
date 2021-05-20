import Cookie from '../Interface/Cookie';
import './SnapshotService';
import './SERP';
import addContext from 'mochawesome/addContext';

Cypress.Cookies.defaults({
    preserve: [Cookie.stickFooterPanel]
})

Cypress.on("test:after:run", (test, runnable) => {
    let videoName = Cypress.spec.name;
    videoName = videoName.replace('/.js.*', '.js');    
    const urlVideo = 'videos/' + videoName + '.mp4';    
    addContext({ test }, urlVideo);
})