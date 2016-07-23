var _res;

_res = tmplUtils.multiCollection(5, 20)(function (i) {
    return tmplUtils.getTemplate('_chr_rule.js');
});

module.exports = {
    "chr_rules" : _res,
    "command" : "get_chr_list",
    "index" : 0,
    "success" : true
};


