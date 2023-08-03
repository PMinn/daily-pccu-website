var fs = require('fs');

const querystring = require('querystring');
const https = require('https');

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, (err, filenames) => {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(filename => {
            if (fs.lstatSync(dirname + filename).isDirectory()) {
                readFiles(dirname + filename + '/', onFileContent, onError);
            } else {
                fs.readFile(dirname + filename, 'utf-8', (err, content) => {
                    if (err) {
                        onError(err);
                        return;
                    }
                    onFileContent(dirname + filename, content);
                });
            }
        });
    });
}

function minify(content) {
    return new Promise((resolve, reject) => {
        var chunk = '';
        const query = querystring.stringify({
            input: content
        });
        const req = https.request({
            method: 'POST',
            hostname: 'www.toptal.com',
            path: '/developers/javascript-minifier/api/raw',
        }, function (res) {
            res.setEncoding('utf8');
            res.on('data', d => {
                chunk += d;
            });
            res.on('end', () => {
                if (res.statusCode !== 200) reject(JSON.parse(chunk));
                else resolve(chunk);
            });
        });
        req.on('error', function (err) {
            reject(err);
        });
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Content-Length', query.length);
        req.end(query, 'utf8');
    })
}

readFiles('./out/_next/static/chunks/', (path, content) => {
    minify(content)
        .then(minified => {
            console.log(path)
            fs.writeFileSync(path, minified);
        })
        .catch(err => {
            console.error(err);
        })
}, function (err) {
    console.error(err);
});

readFiles('./out/_next/static/css/', (path, content) => {
    console.log(path)
    content = content.replace(/\/\*([\s\S]*?)\*\//gi, '');
    fs.writeFileSync(path, content);
}, function (err) {
    console.error(err);
});