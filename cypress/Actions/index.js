import Cookie from '../Interface/Cookie';
import './SnapshotService';
import './SERP';
import addContext from 'mochawesome/addContext';

Cypress.Cookies.defaults({
    preserve: [Cookie.stickFooterPanel]
})

Cypress.on("test:after:run", (test, runnable) => {
    let videoName = Cypress.spec.name;
    console(videoName)
    videoName = videoName.replace('/.js.*', '.js');
    console(videoName)
    const urlVideo = 'Attachment/Videos/' + videoName + '.mp4';
    console(urlVideo)
    addContext({ test }, urlVideo);
})