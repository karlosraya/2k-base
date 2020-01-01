(function () {
    angular
		.module('2kApp')
        .directive("standardPassword", standardPassword);

    function standardPassword() {
        return {
        	require: {
                form: '^'
            },
        	restrict: 'A',
        	templateUrl: "directives/standard-password/standard-password.html",
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