(function () {
    angular
		.module('2kApp')
        .directive("standardDatepicker", standardDatepicker);

    function standardDatepicker() {
        return {
        	require: {
                form: '^'
            },
        	restrict: 'A',
        	templateUrl: "directives/standard-datepicker/standard-datepicker.html",
            scope: {
            	header:'@',
				model:'=',
				minDate: '=',
				readonly: '=',
				required: '=',
                changeAction: "&"
            },
            link: link
        }

        function link(scope, element, attrs, form) {
            scope.parentForm = form.form;
            scope.form = scope.parentForm[scope.header];

			scope.maxDate = new Date();
			
			scope.dateOptions = {
				showWeeks:false,
				maxDate: scope.maxDate,
				minDate: scope.minDate,
                formatYear: 'yyyy'
			}
        }
    };
})();