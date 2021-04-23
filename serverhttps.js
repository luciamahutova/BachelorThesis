var https = require("https"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
port = process.argv[2] || 443;

var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/planets.luciamahutova.eu/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/planets.luciamahutova.eu/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/planets.luciamahutova.eu/chain.pem')
};

https.createServer(options, function(request, response) {

    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    var contentTypesByExtension = {
        '.html': "text/html",
        '.css': "text/css",
        '.js': "text/javascript"
    };

    fs.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(err + "\n");
                response.end();
                return;
            }

            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

var http = require('http');
http.createServer(function(req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

console.log("Static file server running at\n  => https://planets.luciamahutova.eu:" + port + "/\nCTRL + C to shutdown");