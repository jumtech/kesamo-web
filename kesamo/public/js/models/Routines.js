import fb from '../firebase-adapter';

export default class Routines {
  constructor(routines) {
    this.values = routines;
  }
  getValues() {
    return this.values;
  }
  saveValues(routines) {
    this.values = routines;
    fb.updateRoutines(routines);
  }
}