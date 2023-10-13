# mg_web_router: Express-like Router for mg_web
 
Rob Tweed <rtweed@mgateway.com>  
13 October 2023, MGateway Ltd [https://www.mgateway.com](https://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


## What is mg_web_router?

*mg_web_router* is a Node.js/JavaScript Module that is designed for use with the Node.js interface
to [*mg_web*](https://github.com/chrisemunt/mg_web).

*mg_web_router* abstracts the low-level *mg_web* protocol to a Router-style interface that has been
inspired by Express.js.

*mg_web_router*, in conjunction with *mg_web* allows API routes to be directly handled in Node.js 
with the three main industry-standard Web Servers:

- nginx
- Apache
- IIS

As a result, there is no need to use or run a JavaScript Web Framework, since all the HTTP handling is carried out by the Web Server, and it dispatches directly to a pool of persistent Node.js Child Processes where each API handler is invoked.

In most production scenarios, a JavaScript Web Framework would be proxied behind one of the industry-standard
web servers anyway, and in doing so, performance of both the front-line Web Server and the proxied JavaScript Web
Framework are significantly reduced.

*mg_web*, together with *mg_web_router*, therefore makes a JavaScript Web Framework redundant, and creates a very
high-performance API server platform without any unnecessary duplication of the HTTP service.

## Installing *mg_web_router*

        npm install mg_web_router

## Using *mg_web_router*

See the Example files in the [/examples](./examples) folder.



## License

 Copyright (c) 2023 MGateway Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  https://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      


