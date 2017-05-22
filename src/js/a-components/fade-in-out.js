const THREE = window.THREE;
/* eslint-disable */
function Timer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function() {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = function() {
    start = new Date();
    window.clearTimeout(timerId);
    timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
}

AFRAME.registerComponent('fade-in-out', {
  schema: {
    ypos: {type: 'number'},
    dur: {type: 'number'},
  },

  init() {
    const {data, el} = this;
    this.dur = data.dur;
    this.fadeTime = (data.dur / 2) + 2000;
    this.fading = false
    this.paused = false;

    const radius = 1;
    const xAngle = THREE.Math.degToRad(Math.random() * 360);
    const yAngle = THREE.Math.degToRad(Math.random() * 360);
    const yOffset = radius * Math.sin(xAngle) * Math.sin(yAngle);
    const xOffset = (radius / 4) * Math.cos(xAngle) * Math.sin(yAngle);
    const zOffset = (radius / 4) * Math.cos(yAngle);

    const fallName = 'animation__fall';
    const fallHeight = data.ypos + yOffset;

    el.addEventListener('click', () => {
      if (!this.paused) {
        el.emit('pauseFall');
        this.paused = true;
      }
    });
    el.addEventListener('mouseleave', () => {
      if (this.paused) {
        el.emit('resumeFall');
        this.paused = false;
      }
    });

    el.setAttribute(fallName, {
      property: 'position',
      from: `${xOffset} ${fallHeight} ${zOffset}`,
      to: `${xOffset} -${fallHeight} ${zOffset}`,
      startEvents: 'startFall',
      restartEvents: 'restartFall',
      pauseEvents: 'pauseFall',
      resumeEvents: 'resumeFall',
      dur: this.dur,
    });

    el.setAttribute('animation__fade_in', {
      property: 'material.opacity',
      startEvents: 'fade-material-in',
      restartEvents: 'refade-material-in',
      pauseEvents: 'pauseFadeIn',
      resumeEvents: 'resumeFadeIn',
      easing: 'linear',
      dur: this.dur / 2,
      from: '0',
      to: '1',
    });

    el.setAttribute('animation__fade_out', {
      property: 'material.opacity',
      startEvents: 'fade-material-out',
      restartEvents: 'refade-material-out',
      pauseEvents: 'pauseFadeOut',
      resumeEvents: 'resumeFadeOut',
      easing: 'linear',
      dur: this.dur / 2,
      from: '1',
      to: '0',
    });

    el.addEventListener(`${fallName}-complete`, () => {
      el.emit('restartFall');
      el.emit('refade-material-in');
      this.fading = false
      this.timer = new Timer(() => {
        el.emit('refade-material-out');
      }, this.fadeTime);
    });

    el.emit('startFall');
    el.emit('fade-material-in');

    this.timer = new Timer(() => {
      el.emit('fade-material-out');
      this.fading = true;
    }, this.fadeTime);

    el.addEventListener('pauseFall', () => {
      el.emit(this.fading ? 'pauseFadeOut' : 'pauseFadeIn');
      this.timer && this.timer.pause();
    });

    el.addEventListener('resumeFall', () => {
      el.emit(this.fading ? 'resumeFadeOut' : 'resumeFadeIn');
      this.timer && this.timer.resume();
    });
  },
});
