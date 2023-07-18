const connect = require('connect'),
      gzipStatic = require('connect-gzip-static'),
      serveStatic = require('serve-static');

const app = connect();

const wwwroot = path.join(__dirname, 'wwwroot');

//return static files
app.use(gzipStatic(wwwroot, 
                   {
                       maxAge: '7d',
                       setHeaders: function setCustomCacheControl (res, path) 
                       {
                           if (serveStatic.mime.lookup(path) === 'text/html') 
                           {
                               // Custom Cache-Control for HTML files
                               res.setHeader('Cache-Control', 'public, max-age=0');
                           }
                       }
                   }));

console.log("Listening on port 8888 => http://localhost:8888");
//create node.js http server and listen on port
app.listen(8888);