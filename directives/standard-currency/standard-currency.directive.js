(function () {
    angular
		.module('2kApp')
        .directive("standardCurrency", standardCurrency);

    function standardCurrency() {
        return {
        	require: {
                form: '^'
            },
        	restrict: 'A',
        	templateUrl: "directives/standard-currency/standard-currency.html",
            scope: {
            	header:'@',
                hideHeader: '=',
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