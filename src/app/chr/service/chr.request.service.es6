(function() {
    'use strict';

    angular
        .module('app.chr')
        .service('ChrRequest',RequestService);

    RequestService.$inject = ['RequestServiceFactory'];

    function RequestService({chr:ChrRequestFactory}) {
        this.saveRule = (rule,scope) =>  {
            ChrRequestFactory.saveRule(rule,scope.user)
                .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function() {
                        _.find(this.scope.user.chr.RAW_rules,{ruleId:this.rule.ruleId}).ruleName = this.rule.ruleName;
                        this.scope.$apply();
                    }).bind(this));

                }).bind({scope:scope,rule:rule}))
                .catch(err => console.log('Fetch Error :-S', err));
        };
        this.createRule = (rule,scope) =>  {
            ChrRequestFactory.createRule(rule,scope.user)
                .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function(data) {
                        if (data.success){
                            let chr = this.user.chr;
                            //noinspection JSPrimitiveTypeWrapperUsage
                            chr.newRule.ruleId = data.ruleId;

                            if (!angular.isArray(chr.rules)){
                                chr.rules = [];
                                chr.RAW_rules = [];
                            }

                            chr.rules.push(angular.copy(this.user.chr.newRule));
                            chr.RAW_rules.push(angular.copy(this.user.chr.newRule));
                            chr.newRule = false;
                            this.$apply();
                        }
                    }).bind(this));
                }).bind(scope))
                .catch(err => console.log('Fetch Error :-S', err));
        };
        this.deleteRule = (rule,scope) =>  {
            ChrRequestFactory.deleteRule(rule,scope.user)
                .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function(data) {
                        if (data.success){
                            _.pull(this.scope.user.chr.rules,this.rule);
                            this.scope.user.chr.RAW_rules = angular.copy(this.scope.user.chr.rules);
                            this.scope.$apply();
                        }
                    }).bind(this));
                }).bind({rule:rule,scope:scope}))
                .catch(err => console.log('Fetch Error :-S', err));
        };

        this.getList = (scope) =>  {
            ChrRequestFactory.getList(scope.user)
                .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function(data) {
                        _.pull(data.chr_rules, _.find(data.chr_rules,{number:-10}));
                        this.user.chr.rules = data.chr_rules;
                        this.user.chr.RAW_rules = angular.copy(data.chr_rules);
                        this.$apply();
                    }).bind(this));
                }).bind(scope))
                .catch(err => console.log('Fetch Error :-S', err));
        };
    }
})();
