(function () {
    angular
		.module('2kApp')
        .directive("standardDropdown", standardDropdown);

    function standardDropdown() {
        return {
        	require: {
                form: '^'
            },
        	restrict: 'A',
        	templateUrl: "directives/standard-dropdown/standard-dropdown.html",
            scope: {
            	header:'@',
				model:'=',
				readonly: '=',
				required: '=',
				changeAction: "&",
				options: '=',
                key: '@',
                value: '@'
            },
            link: link
        }

        function link(scope, element, attrs, form) {
            scope.parentForm = form.form;
            scope.form = scope.parentForm[scope.header];
        }
    };
})();