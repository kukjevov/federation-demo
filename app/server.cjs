const connect = require('connect'),
      gzipStatic = require('connect-gzip-static'),
      path = require('path');

const app = connect();

const wwwroot = path.join(__dirname, 'wwwroot');

//return static files
app.use(gzipStatic(wwwroot));

console.log("Listening on port 8888 => http://localhost:8888");
//create node.js http server and listen on port
app.listen(8888);