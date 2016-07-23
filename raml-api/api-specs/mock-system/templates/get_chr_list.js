var _res, num = 1;

_res = tmplUtils.multiCollection(25, 70)(function (i) {
    return tmplUtils.getTemplate('_chr_rule.js');
});

_res.forEach(function(v){
    v.number = num++
});

module.exports = {
    "chr_rules" : _res,
    "command" : "get_chr_list",
    "index" : 0,
    "success" : true
};


