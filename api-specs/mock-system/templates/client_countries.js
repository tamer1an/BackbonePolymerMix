var _res;

_res = tmplUtils.multiCollection(5, 20)(function () {
    return tmplUtils.getTemplate('client_country.js');
});

module.exports = _res;
