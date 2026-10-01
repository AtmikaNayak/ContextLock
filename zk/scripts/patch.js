const path = require('path');
const oldJoin = path.join;
path.join = function(...args) {
    return oldJoin(...args).replace(/\\/g, '/');
};
