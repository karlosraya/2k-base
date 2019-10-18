(function () {
    angular
		.module('2kApp')
        .directive("standardNumber", standardNumber);

    function standardNumber() {
        return {
        	require: {
                form: '^'
            },
        	restrict: 'A',
        	templateUrl: "directives/standard-number/standard-number.html",
            scope: {
            	header:'@',
				model:'=',
				readonly: '=',
				required: '=',
				changeAction: "&"
            },
            link: link
        }

        function link(scope, element, attrs, form) {
			
        }
    };
})();