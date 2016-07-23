(function() {
    'use strict';

    angular
        .module('app.vmnr')
        .service('VmnrRequest',RequestService);

    RequestService.$inject = ['RequestServiceFactory'];

    function RequestService({vmnr:VmnrRequestFactory}) {
        this.saveRule = (rule,scope) =>  {
            VmnrRequestFactory.saveRule(rule,scope.user)
                .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function(data) {
                        _.find(this.scope.user.vmnr.RAW_rules,{ruleId:this.rule.ruleId})
                            .ruleName = this.rule.ruleName;

                        this.scope.$apply();
                    }).bind(this));
                }).bind({rule:rule,scope:scope}))
                .catch(err => console.log('Fetch Error :-S', err));
        };
        this.createRule = (rule,scope) =>  {
            VmnrRequestFactory.createRule(rule,scope.user)
                .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function(data) {
                        if (data.success){
                            let vmnr = this.user.vmnr;

                            if (!angular.isArray(vmnr.rules)){
                                vmnr.rules = [];
                                vmnr.RAW_rules = [];
                            }

                            //noinspection JSPrimitiveTypeWrapperUsage
                            vmnr.newRule.ruleId = data.ruleId;
                            vmnr.rules.push(angular.copy(this.user.vmnr.newRule));
                            vmnr.RAW_rules.push(angular.copy(this.user.vmnr.newRule));

                            vmnr.newRule = false;
                            this.$apply();
                        }
                    }).bind(this));
                }).bind(scope))
                .catch(err => console.log('Fetch Error :-S', err));
        };
        this.deleteRule = (rule,scope) =>  {
            VmnrRequestFactory.deleteRule(rule,scope.user)
                .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem.
                                        Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function(data){
                        if (data.success){
                            _.pull(this.scope.user.vmnr.rules,this.rule);
                            this.scope.user.vmnr.RAW_rules = angular.copy(this.scope.user.vmnr.rules);
                            this.scope.$apply();
                        }
                    }).bind(this));
                }).bind({rule:rule,scope:scope}))
                .catch(err => console.log('Fetch Error :-S', err));
        };

        this.getList = (scope) =>  {
            VmnrRequestFactory.getList(scope.user)
                .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem.
                                        Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function(data) {
                        this.user.vmnr.rules = data.vmnr_rules;
                        this.user.vmnr.RAW_rules = angular.copy(data.vmnr_rules);
                        this.$apply();
                    }).bind(this));
                }).bind(scope))
                .catch(err => console.log('Fetch Error :-S', err));
        };
    }
})();
