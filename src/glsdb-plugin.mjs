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

import {glsDB} from 'glsdb';

let glsdb = function(args) {

  this.context.glsdb = new glsDB();
  this.context.glsdb.open(args);

  let _this = this;

  this.on('stop', function() {
    _this.log('Worker ' + process.pid + ' is about to be shut down');
    if (_this.context.glsdb) {
      _this.context.glsdb.close();
      _this.log('glsdb database connection closed');
    }
  });
};

export {glsdb};
