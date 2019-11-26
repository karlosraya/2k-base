(function () {
    angular
		.module('2kApp')
        .directive("loadingSpinner", loadingSpinner);

    function loadingSpinner() {
        return {
        	restrict: 'E',
        	templateUrl: "directives/loading-spinner/loading-spinner.html",
            scope: {
            	isLoading:'='
            }
        }
    };
})();