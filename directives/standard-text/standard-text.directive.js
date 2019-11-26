(function () {
    angular
		.module('2kApp')
        .directive("standardText", standardText);

    function standardText() {
        return {
        	require: {
                form: '^'
            },
        	restrict: 'A',
        	templateUrl: "directives/standard-text/standard-text.html",
            scope: {
            	header:'@',
				model:'=',
				readonly: '=',
				required: '='
            },
            link: link
        }

        function link(scope, element, attrs, form) {
            scope.parentForm = form.form;
            scope.form = scope.parentForm[scope.header];
        }
    };
})();