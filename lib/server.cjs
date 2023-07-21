const connect = require('connect'),
      gzipStatic = require('connect-gzip-static'),
      serveStatic = require('serve-static'),
      {createProxyMiddleware} = require('http-proxy-middleware'),
      argv = require('yargs').argv,
      path = require('path'),
      cors = require('cors'),
      connectExtensions = require('nodejs-connect-extensions');

require('dotenv').config();

const app = connect();

connectExtensions.extendConnectUse(app);

const wwwroot = path.join(__dirname, 'wwwroot');

//enable webpack only if run with --webpack param
if(!!argv.webpack)
{
    app.use(cors());

    //WEBPACK 5 DEV SERVER
    app.use(createProxyMiddleware(['/dist'],
    {
        target: 'http://localhost:9001',
        ws: true,
    }));
}

//return static files
app.use(gzipStatic(wwwroot));

console.log("Listening on port 8080 => http://localhost:8080");
//create node.js http server and listen on port
app.listen(8080);