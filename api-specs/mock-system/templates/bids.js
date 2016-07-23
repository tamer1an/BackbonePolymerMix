var _res;

_res = tmplUtils.multiCollection(5, 20)(function () {
    return tmplUtils.getTemplate('bid.js');
});

module.exports = _res;
