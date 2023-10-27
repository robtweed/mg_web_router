import {server, mglobal, mclass} from 'mg-dbx-napi';

let cached_mglobal = new Map();

let mgdbx = function(args) {
  if (!args) return;
  if (this.context.mgdbx) return;
  console.log('connecting to database');
  let db = new server();
  db.open(args);
  let R = this;
  this.context.mgdbx = {
    type: args.type,
    db: db,
    mglobal: mglobal,
    mclass: mclass,
    use: function() {
      let args = [...arguments];
      let key = args.toString();
      if (!cached_mglobal.has(key)) {
        R.log('** mgdbx use in ' + process.pid + ': new key so create container: ' + key);
        cached_mglobal.set(key, {
          container: new mglobal(db, ...args),
          at: Date.now()
        });
      }
      return cached_mglobal.get(key).container;
    }
  };

  this.on('stop', function() {
    R.log('Worker ' + process.pid + ' is about to be shut down');
    if (R.context.mgdbx) {
      db.close();
      R.log('mgdbx database connection closed');
    }
  });
};

export {mgdbx};
