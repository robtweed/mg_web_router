import {Router} from 'mg_web_router';

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
  ctx.time = Date.now();

  return {
    payload: {
      hello: 'world 123',
      Request: Request
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

// post route
// if applcation.json content-type, body is parsed automatically as jSON

// curl -v -X POST -H "Content-Type: application/json" -d "{\"name\": \"Chris Munt\"}" http://localhost:8080/mgweb/save

router.post('/mgweb/save', (Request, ctx) => {
  ctx.time = Date.now();

  let person = ctx.mgdbx.use('Person');
  let key = person.increment('nextId', 1);
  person.set('data', key, Request.body.name);

  return {
    payload: {
      saved: true,
      Request: Request
    }
  };

});

let handler = router.handler;

export {handler};