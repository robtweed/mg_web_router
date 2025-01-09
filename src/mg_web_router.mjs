/*
 ----------------------------------------------------------------------------
 | mg_web_router: Express-like Router Interface for mg_web_node              |
 |                                                                           |
 | Copyright (c) 2023-25 MGateway Ltd,                                       |
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

9 January 2025

*/

import { createRequire } from "module";
const require = createRequire(import.meta.url);
let router = require('find-my-way')();

const CRLF = '\r\n';
const statusText = new Map([
  [100, 'Continue'],
  [101, 'Switching Protocols'],
  [102, 'Processing'],
  [103, 'Early Hints'],
  [200, 'OK'],
  [201, 'Created'],
  [202, 'Accepted'],
  [203, 'Non-Authoritative Information'],
  [204, 'No Content'],
  [205, 'Reset Content'],
  [206, 'Partial Content'],
  [207, 'Multi-Status'],
  [208, 'Already Reported'],
  [218, 'This is Fine'],
  [226, 'IM Used'],
  [300, 'Multi Choices'],
  [301, 'Moved Permanently'],
  [302, 'Found'],
  [303, 'See Other'],
  [304, 'Not Modified'],
  [305, 'Use Proxy'],
  [306, 'Switch Proxy'],
  [307, 'Temporary Redirect'],
  [308, 'Permanent Redirect'],
  [400, 'Bad Request'],
  [401, 'Unauthorised'],
  [402, 'Payment Required'],
  [403, 'Forbidden'],
  [404, 'Not Found'],
  [405, 'Method Not Allowed'],
  [406, 'Not Acceptable'],
  [407, 'Proxy Authentication Required'],
  [408, 'Request Timeout'],
  [409, 'Conflict'],
  [410, 'Gone'],
  [411, 'Length Required'],
  [412, 'Precondition Failed'],
  [413, 'Payload Too Large'],
  [414, 'URI Too Long'],
  [415, 'Unsupported Media Type'],
  [416, 'Range Not Satisfiable'],
  [417, 'Expectation Failed'],
  [418, "I'm A Teapot"],
  [419, 'Page Expired'],
  [420, 'Method Failure'],
  [421, 'Misdirected Request'],
  [422, 'Unprocessable Entity'],
  [423, 'Locked'],
  [424, 'Failed Dependency'],
  [425, 'Too Early'],
  [426, 'Upgrade Required'],
  [428, 'Precondition Required'],
  [429, 'Too Many Requests'],
  [430, 'Request Header Fields Too Large'],
  [431, 'Request Header Fields Too Large'],
  [440, 'Login Time-out'],
  [444, 'No Response'],
  [449, 'Retry With'],
  [450, 'Blocked by Windows Parental Controls'],
  [451, 'Unavailable For Legal Reasons'],
  [494, 'Request header too large'],
  [495, 'SSL Certificate Error'],
  [496, 'SSL Certificate Required'],
  [497, 'HTTP Request Sent to HTTPS Port'],
  [498, 'Invalid Token'],
  [499, 'Token Required'],
  [500, 'Internal Server Error'],
  [501, 'Not Implemented'],
  [502, 'Bad Gateway'],
  [503, 'Service Unavailable'],
  [504, 'Gateway Timeout'],
  [505, 'HTTP Version Not Supported'],
  [506, 'Variant Also Negotiates'],
  [507, 'Insufficient Storage'],
  [508, 'Loop Detected'],
  [509, 'Bandwidth Limit Exceeded '],
  [510, 'Not Extended'],
  [511, 'Network Authentication Required'],
  [529, 'Site is overloaded'],
  [530, 'Site is Frozen'],
  [598, 'Network read timeout error'],
  [598, 'Network Connect Timeout Error'],
]);

let handlers = new Map();
let r_log;
let r_emit;
let r_logging;
var r_context;
let socket;
let evTarget;
let noOfRequests = 0;

class Router {
  constructor(options) {
    options = options || {};
    let listeners = new Map();
    this.name = 'mg_web_router';
    this.build = '0.2';
    this.buildDate = '5 March 2024';
    this.logging = options.logging || false;
    this.context = {};
    r_context = this.context;
    let R = this;
    r_log = this.log;
    r_logging = this.logging;

    this.on = function(type, callback) {
      if (!listeners.has(type)) {
        listeners.set(type, callback);
      }
    };

    this.off = function(type) {
      if (listeners.has(type)) {
        listeners.delete(type);
      }
    };

    this.emit = function(type, data) {
      if (listeners.has(type)) {
        let handler =  listeners.get(type);
        handler.call(R, data);
      }
    }

    r_emit = this.emit;
  };

  register(pluginFn, options) {
    pluginFn.call(this, options);
  }

  route(method, url, handlerFn) {
    if (!method) return;
    if (!url) return;
    if (!handlerFn || typeof handlerFn !== 'function') return;
    let R = this;
    router.on(method, url, async function(Request, params) {
      //console.log('*** handling ' + url + ' in process ' + process.pid);
      //console.log('params:');
      //console.log(params);
      Request.params = params;
      Request.routerPath = url;

      let Response;
      if (handlerFn.constructor.name === 'AsyncFunction') {
        //console.log('async handler function');
        Response = await handlerFn.call(R, Request, R.context);
      }
      else {
        //console.log('normal handler function');
        Response = handlerFn.call(R, Request, R.context);
      }
      return Response;
    });
  }

  sse(url, handlerFn) {
    this.route('PATCH', url, handlerFn);
  }

  get(url, handlerFn) {
    this.route('GET', url, handlerFn);
  }

  post(url, handlerFn) {
    this.route('POST', url, handlerFn);
  }

  put(url, handlerFn) {
    this.route('PUT', url, handlerFn);
  }

  delete(url, handlerFn) {
    this.route('DELETE', url, handlerFn);
  }

  head(url, handlerFn) {
    this.route('HEAD', url, handlerFn);
  }

  options(url, handlerFn) {
    this.route('OPTIONS', url, handlerFn);
  }

  patch(url, handlerFn) {
    this.route('PATCH', url, handlerFn);
  }

  handler() {
    let R = this;
    return async function(ws, cgi, content, sys) {

      //console.log('*** handled by ' + process.pid);
      //console.log('handler called by mg-web');
      //console.log('R');
      //console.log(R);

      noOfRequests++;

      if (!socket) {
        socket = sys.get('socket');
        evTarget = sys.get('evTarget');

        evTarget.addEventListener('stop', function() {
          console.log('*** stop event triggered');
          console.log('*** Shut down worker ' + process.pid + ' cleanly...');
          r_emit('stop');
        });

        process.on('uncaughtException', (err, origin) => {
          console.log('*** Worker ' + process.pid + ' detected uncaught exception: shutting down gracefully...');
          console.log(err);
          //clearInterval(timer);
          r_emit('stop');
          process.exit();
        });
      }

      if (ws.sse === true) {
        //
        // Initialise SSE server

        let result = ws.initsse(sys, "");
        let url = cgi.get('SCRIPT_NAME');
        let route = router.find('PATCH', url);
        //console.log('route found:');
        //console.log(route);
        let resp = route.handler(ws, R.context);
        return result;
      }

      let protocol = cgi.get('SERVER_PROTOCOL').split('/')[0].toLowerCase();
      let contentType = cgi.get('CONTENT_TYPE');
      let queryStr = cgi.get('QUERY_STRING') || '';
      let query = new URLSearchParams(queryStr);
      query = Object.fromEntries(query);
      let body = content.toString();
      if (contentType === 'application/json') {
        try {
          body = JSON.parse(body);
        }
        catch(err) {
        }
      }
      let Request = {
        method: cgi.get('REQUEST_METHOD'),
        query: query,
        body: body,
        headers: {
          'Content-Type': contentType,
          'Content-Length': cgi.get('CONTENT_LENGTH'),
          Host: cgi.get('HTTP_HOST'),
          'User-Agent': cgi.get('HTTP_USER_AGENT'),
          Accept: cgi.get('HTTP_ACCEPT')
        },
        ip: cgi.get('REMOTE_ADDR'),
        hostname: cgi.get('HTTP_HOST'),
        protocol: protocol,
        url: cgi.get('SCRIPT_NAME')
      };

      let Response;
      let route = router.find(Request.method, Request.url);
      if (route) {
        try {
          //console.log('route params:');
          //console.log(route.params);
          Response = await route.handler(Request, route.params);
        }
        catch(err) {
          let error = 'Error running handler for ' + Request.method + ' ' + Request.url;
          r_log(error);
          r_log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
          r_emit('error', {
            error: error,
            caughtError: JSON.stringify(err, Object.getOwnPropertyNames(err))
          });
          Response = {
            payload: {
              error: 'Error Running Handler',
              caughtError: JSON.stringify(err, Object.getOwnPropertyNames(err))
            },
            status: 500
          };
        }
      }
      else {
        Response = {
          payload: {error: 'Invalid Request'},
          status: 400
        };
      }

      let status = Response.status || 200;
      let text = statusText.get(status) || 'OK';
  
      let res = cgi.get('SERVER_PROTOCOL') + ' ' + status + ' ' + text + CRLF;
      contentType = 'application/json';
      if (Response.headers && Response.headers['Content-Type']) {
        contentType = Response.headers['Content-Type']
      }
      res = res + 'Content-Type: ' + contentType + CRLF;
      let connection = 'close';
      if (Response.headers && Response.headers.Connection) {
        connection = Response.headers.Connection
      }
      res = res + 'Connection: ' + connection + CRLF;
      if (Response.headers) {
        for (let name in Response.headers) {
          if (name !== 'Content-Type' && name !== 'Connection') {
            res = res + name + ': ' + Response.headers[name] + CRLF
          }
        }
      }
      res = res + CRLF;

      if (Response.payload) {
        let payload = Response.payload;
        if (contentType === 'application/json') {
          payload = JSON.stringify(payload);
        }
        res = res + payload;
      }
      return res;
    };
  }

  log(message) {
    if (r_logging) {
      console.log(Date.now() + ': ' + message);
    }
  }
};

export {Router};
