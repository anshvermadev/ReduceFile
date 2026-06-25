const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('node_modules/@jsquash');
files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    let original = code;
    code = code.replace(/(if\s*\(\s*import\.meta\.url\s*===\s*undefined\s*\)\s*\{?\s*)import\.meta\.url\s*=\s*['"]https:\/\/localhost['"];?(\s*\}?)/g, '$1void 0;$2');
    if (code !== original) {
        fs.writeFileSync(file, code);
        console.log('Patched', file);
    }
});
