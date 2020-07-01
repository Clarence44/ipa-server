const router = require('koa-route');
const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();
const config = require('./config');
const { createPlistBody } = require('./libs/plist');
const ipaManager = require('./libs/ipa-manager');
const apkManager = require('./libs/apk-manager');
const upload = require('./middle/upload');
const locale = require('koa-locale');
const moment = require('moment');
const path = require('path');
const fs = require('fs-extra');
const publicURL = require('./libs/public-url');

// locale
locale(app);
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  // set moment language
  moment.locale(ctx.getLocaleFromCookie());
  await next();
});

// static files
app.use(serve(path.join(__dirname, '/fontend/dist'), { defer: true }));
app.use(
  serve(config.uploadDir, { maxage: 1000 * 3600 * 24 * 365, defer: true })
);

// get app list
app.use(
  router.get('/api/list', async (ctx) => {
    if (!canAccess(ctx)) {
      return;
    }
    ctx.body = ipaManager.list(publicURL(ctx), ctx.request.query.p);
  })
);

app.use(
  router.get('/api/info', async (ctx) => {
    // ctx.body = { message: 'hello' };
    const { p, i, id } = ctx.request.query;
    ctx.body = ipaManager.find(id, publicURL(ctx), p, i);
  })
);

// import ipa
app.use(
  router.post(
    '/api/upload',
    upload({}, async (ctx, files, oldFileName) => {
      if (!canAccess(ctx)) {
        return;
      }
      try {
        // console.log(oldFileName);
        if (/.apk/.test(oldFileName)) {
          await apkManager.add(files[0], oldFileName);
        } else {
          await ipaManager.add(files[0]);
        }
        ctx.body = { msg: 'Upload Done' };
      } catch (err) {
        console.log('Upload fail:', err);
        ctx.body = { err: 'Upload fail' };
      }
    })
  )
);

// get install plist
app.use(
  router.get('/plist/:id.plist', async (ctx, id) => {
    const info = ipaManager.find(id, publicURL(ctx));
    ctx.set(
      'Content-Disposition',
      `attachment; filename=${encodeURI(info.identifier)}.plist`
    );
    ctx.body = createPlistBody(info);
  })
);

app.use(
  router.get('/app', async (ctx) => {
    ctx.response.status = 200;
    ctx.response.type = 'text/html;utf-8';
    ctx.response.body = fs.createReadStream(
      path.join(__dirname, '/fontend/dist/index.html')
    );
  })
);

app.use(
  router.get('/key', async (ctx) => {
    ctx.response.status = 200;
    ctx.response.type = 'text/html;utf-8';
    ctx.response.body = fs.createReadStream(
      path.join(__dirname, '/fontend/dist/index.html')
    );
  })
);

// catch crash
app.on('error', (err) => {
  console.error('*** SERVER ERROR ***\n', err);
  err.status !== 400 &&
    config.debug &&
    require('child_process').spawn('say', ['oh my god, crash!']);
});

// start service
app.listen(config.port, config.host, () => {
  console.log(`Server started: http://${config.host}:${config.port}`);
});

const ACCESS_KEY = process.env.ACCESS_KEY;
function canAccess(ctx) {
  if (ACCESS_KEY && ctx.request.query.key != ACCESS_KEY) {
    console.log('Access Fail!');
    ctx.body = { err: 'Access Fail!' };
    return false;
  }
  return true;
}
