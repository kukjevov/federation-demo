const connect = require('connect'),
      gzipStatic = require('connect-gzip-static'),
      history = require('connect-history-api-fallback'),
      {createProxyMiddleware} = require('http-proxy-middleware'),
      argv = require('yargs').argv,
      path = require('path'),
      fs = require('fs'),
      https = require('https'),
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
        target: 'http://localhost:9000',
        ws: true,
    }));
}

//enable html5 routing
app.use(history());
//return static files
app.use(gzipStatic(wwwroot));

console.log("Listening on port 8888 => http://localhost:8888");
//create node.js http server and listen on port
app.listen(8888);