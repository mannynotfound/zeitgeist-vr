import 'aframe';

import 'aframe-animation-component';
import 'aframe-event-set-component';
import 'aframe-layout-component';
import 'aframe-template-component';
import 'aframe-look-at-component';
import 'aframe-particle-system-component';
import 'aframe-randomizer-components';
import './a-components';

import './a-project';

import content from '../fixtures/content';

if (module.hot) {
  module.hot.accept();
}

const config = {
  rowRadius: 2.75,
  contentPerRow: 12,
};

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

let contents = shuffle(content.filter(c => c.type === 'image').map(c => ({
  ...c,
  yPos: Math.PI,
  dur: 50000,
}))).slice(0, config.contentPerRow);

while (contents.length < config.contentPerRow) {
  contents = contents.concat(contents).slice(0, config.contentPerRow);
}

const aScene = require('../scene/scene.hbs');
document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = aScene({config, contents});
});
