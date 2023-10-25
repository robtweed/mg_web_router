import {Router} from 'mg-web-router';
import { randomUUID } from 'crypto';

import { createClient } from 'redis';

const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

const router = new Router({logging: true});




router.mgdbx({
  type: "YottaDB",
  path: "/usr/local/lib/yottadb/r138",
  env_vars: {
    ydb_dir: '/opt/yottadb',
    ydb_gbldir: '/opt/yottadb/yottadb.gld',
    ydb_routines: '/opt/qoper8/m /usr/local/lib/yottadb/r138/libyottadbutil.so',
    ydb_ci: '/usr/local/lib/yottadb/r138/zmgsi.ci'
  }
});

router.get('/mgweb/helloworld', (Request, ctx) => {
  //ctx.time = Date.now();

  return {
    payload: {
      hello: 'world 123',
      //Request: Request
    }
  };

});

// parametric route:

//curl -v http://localhost:8080/mgweb/user/12

router.get('/mgweb/user/:userId', (Request, ctx) => {

  // By using this use() method, the mglobal container is
  // instantiated and cached for subsequent use within this
  // child process.  If not used within 10 minutes, the
  // container is deleted from the cache.

  let person = ctx.mgdbx.use('Person', 'data');
  let key = Request.params.userId;
  let data = person.get(key);

  return {
    payload: {
      key: key,
      data: data
    }
  };

});


router.get('/mgweb/uuid', (Request, ctx) => {

  return {
    payload: {
      uuid: randomUUID()
    }
  };

});

router.get('/mgweb/uuidRedis', async (Request, ctx) => {

  let uuid = randomUUID();

  await client.HSET('redistest', uuid, 'hello world');

  return {
    payload: {
      uuid: uuid
    }
  };

});

router.get('/mgweb/uuidYdb', (Request, ctx) => {

  let uuid = randomUUID();

  ctx.mgdbx.use('ydbtest').set(uuid, 'hello world');

  return {
    payload: {
      uuid: uuid
    }
  };

});


// post route
// if applcation.json content-type, body is parsed automatically as jSON

//  3 versions using various levels of mg-dbx-napi abstraction

// curl -v -X POST -H "Content-Type: application/json" -d "{\"name\": \"Chris Munt\"}" 

// direct mg-dbx-napi APIs

http://localhost:8080/mgweb/save1


router.post('/mgweb/save1', (Request, ctx) => {

  let person = ctx.mgdbx.use('Person');
  let key = person.increment('nextId', 1);
  person.set('data', key, 'name', Request.body.name);

  return {
    payload: {
      saved: true
    }
  };

});

// 1st-level glsdb abstraction APIs

router.post('/mgweb/save2', (Request, ctx) => {

  let personId = new ctx.glsdb.node('Person.nextId');
  let person = new ctx.glsdb.node('Person.data');

  let id = personId.increment();
  person.$(id).document = {
    name: Request.body.name,
  };

  return {
    payload: {
      saved: true
    }
  };

});

// proxied glsdb abstraction using _increment

router.post('/mgweb/save3', (Request, ctx) => {

  let person = new ctx.glsdb.node('Person').proxy;
  let id = person.nextId._increment();

  person.data[id] = {
    name: Request.body.name
  }

  return {
    payload: {
      saved: true
    }
  };

});

// proxied glsdb abstraction using ++ and lock/unlock

router.post('/mgweb/save4', (Request, ctx) => {

  let person = new ctx.glsdb.node('Person').proxy;
  person.nextId._lock();
  person.nextId++;
  person.nextId._unlock();
  let id = person.nextId.valueOf();

  person.data[id] = {
    name: Request.body.name
  }

  return {
    payload: {
      saved: true
    }
  };

});



let handler = router.handler;

export {handler};