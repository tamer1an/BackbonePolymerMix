var _res;

_res = tmplUtils.multiCollection(5, 20)(function () {
    return tmplUtils.getTemplate('country_currency.js');
});

module.exports = _res;
