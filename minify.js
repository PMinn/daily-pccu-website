var fs = require('fs');

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
    console.log(path)
    content = content.replace(/\/\*([\s\S]*?)\*\//gi, '');
    fs.writeFileSync(path, content);
},
    function (err) {
        throw err;
    });

readFiles('./out/_next/static/css/', (path, content) => {
    console.log(path)
    content = content.replace(/\/\*([\s\S]*?)\*\//gi, '');
    fs.writeFileSync(path, content);
},
    function (err) {
        throw err;
    });