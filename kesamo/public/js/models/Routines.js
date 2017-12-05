import fb from '../firebase-adapter';

export default class Routines {
  constructor(routines) {
    this.values = routines;
    console.log('[Routines]constructor');
  }
  getValues() {
    return this.values;
  }
  saveValues(routines) {
    this.values = routines;
    console.log('[saveValues]');
    fb.updateRoutines(routines);
  }
}