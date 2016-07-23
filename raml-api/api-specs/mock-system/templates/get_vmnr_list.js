var _res, num = 1;

_res = tmplUtils.multiCollection(25, 100)(function (i) {
    return tmplUtils.getTemplate('_vmnr_rule.js');
});

_res.forEach(function(v){
    v.number = num++
});

module.exports = {
    "vmnr_rules" : _res,
    "command" : "get_vmnr_list",
    "index" : 0,
    "success" : true
};

