var _res;

_res = tmplUtils.multiCollection(5, 20)(function (i) {
    return tmplUtils.getTemplate('user.js');
});

module.exports = _res;
