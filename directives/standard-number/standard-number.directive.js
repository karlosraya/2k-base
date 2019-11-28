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
                hideHeader: '=',
				model:'=',
				readonly: '=',
				required: '=',
				changeAction: "&"
            },
            link: link
        }

        function link(scope, element, attrs, form) {
            scope.parentForm = form.form;
			scope.form = scope.parentForm[scope.header];
        }
    };
})();