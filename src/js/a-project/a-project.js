import {API} from './core/API';

class APROJECT {
  constructor () {
    this.name = 'A-Frame';
    this.aframeLoaded = false;
  }

  render(aframeScene) {
    this.version = (this.Config.isDev()) ? this.version + '-devel' : this.version;
    this.API = new API(this.Config.isDev(), this.version);
    this.API.setApiUrl(this.Config.getServerUrl());

    if (this.Config.stats) {
      aframeScene.setAttribute('stats', true);
    }

    this.API.isAlive().then(status => {
      if (!status) {
        this.page = '<div id="devel">' +
          'A-Frame Project<br>' +
          '<em>default scene</em><br>' +
          '<sup class="error-msg">Could not connect to A-Frame Projects API!</sup>' +
          '</div>';
        console.error('Server URL: ' + this.Config.getServerUrl() + ' [FAILED]');
      }
    });
  }
}
export default (new APROJECT());
