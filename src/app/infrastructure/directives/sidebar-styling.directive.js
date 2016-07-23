let sidebarStyling = function ($state) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            if(angular.equals($state.current.name, 'bidManagement')){
                // return element[0].classList.add("flex");
                return element[0].style.width = "498px";
            }else{
                return element[0].style.width = "416px";
            }
        }
    }
};

export default sidebarStyling;
