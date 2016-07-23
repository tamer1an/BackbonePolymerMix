var _res;

_res = tmplUtils.multiCollection(5, 20)(function () {
    return tmplUtils.getTemplate('country.js');
});

module.exports = _res;
