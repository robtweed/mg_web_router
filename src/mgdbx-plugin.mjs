/*
 ----------------------------------------------------------------------------
 | mg_web_router: Express-like Router Interface for mg_web_node              |
 |                                                                           |
 | Copyright (c) 2023-24 MGateway Ltd,                                       |
 | Redhill, Surrey UK.                                                       |
 | All rights reserved.                                                      |
 |                                                                           |
 | https://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                                |
 |                                                                           |
 |                                                                           |
 | Licensed under the Apache License, Version 2.0 (the "License");           |
 | you may not use this file except in compliance with the License.          |
 | You may obtain a copy of the License at                                   |
 |                                                                           |
 |     http://www.apache.org/licenses/LICENSE-2.0                            |
 |                                                                           |
 | Unless required by applicable law or agreed to in writing, software       |
 | distributed under the License is distributed on an "AS IS" BASIS,         |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  |
 | See the License for the specific language governing permissions and       |
 |  limitations under the License.                                           |
 ----------------------------------------------------------------------------

5 March 2024

*/

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
