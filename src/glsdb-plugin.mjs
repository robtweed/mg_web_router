import {glsDB} from 'glsdb';
import {mgdbx} from 'mgw-router/mgdbx';

let glsdb = function(args) {

  if (!this.context.mgdbx) {
    this.register(mgdbx, args);
  }
  this.context.glsdb = new glsDB(this.context.mgdbx);
};

export {glsdb};
