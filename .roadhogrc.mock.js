const mock = {}
require('fs').readdirSync(require('path')
    .join(__dirname + '/mock'))
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(file => Object.assign(mock, require('./mock/' + file)));
export default mock;