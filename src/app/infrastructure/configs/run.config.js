export default function ($rootScope) {
    class RunConfig {
        constructor () {
            $rootScope.$on('$stateChangeError', (...args) => {
                console.log(...args);
            });
        }

    }
    RunConfig.$inject = [ '$rootScope' ];

    // let runConfig = new RunConfig();
}
