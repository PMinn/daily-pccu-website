const fs = require('fs');

const minify = require('@node-minify/core');
const gcc = require('@node-minify/google-closure-compiler');

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

readFiles('./out/_next/static/chunks/', (path, content) => {
    minify({
        compressor: gcc,
        input: path,
        output: path,
        callback: function (err, min) {
            if (err) console.error(err);
            else console.log(path);
        }
    });
}, err => console.error(err));

readFiles('./out/_next/static/css/', (path, content) => {
    var minified = content.replace(/\/\*([\s\S]*?)\*\//gi, '');
    fs.writeFile(path, minified, err => {
        if (err) console.error(err);
        else console.log(path);
    });
}, err => console.error(err));