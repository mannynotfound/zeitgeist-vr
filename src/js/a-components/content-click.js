AFRAME.registerComponent('content-click', {
  schema: {},
  init() {
    /* eslint-disable no-unreachable */
    // do nothing for now
    const {el} = this;
    this.paused = false;

    el.addEventListener('click', () => {
      if (!this.paused) {
        el.emit('pauseFall');
        this.paused = true;
      }
    });
    el.addEventListener('mouseleave', () => {
      if (this.paused) {
        el.emit('resumeFall');
        el.paused = false;
      }
    });
  },
});
