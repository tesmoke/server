const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml'
};

const server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;
    const ext = path.parse(pathname).ext;

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.end(`Received POST data: ${body}`);
        });
    } else if (req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.end(`Received PUT data: ${body}`);
        });
    } else if (req.method === 'DELETE') {
        res.end(`Received DELETE request for ${pathname}`);
    } else if (req.method === 'GET') {
        fs.exists(pathname, (exist) => {
            if(!exist) {
                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }
            if (fs.statSync(pathname).isDirectory()) {
                pathname += '/index.html';
            }
            fs.readFile(pathname, (err, data) => {
                if(err){
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    res.setHeader('Content-type', mimeTypes[ext] || 'text/plain' );
                    res.end(data);
                }
            });
        });
    } else {
        res.statusCode = 405;
        res.end(`Method ${req.method} not allowed`);
    }
});

server.listen(3000, () => {
    console.log(`Server listening on port 3000`);
});
