const path = require('path')

module.exports = require.main ? path.dirname(require.main.filename) : process.cwd();
