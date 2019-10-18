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
				readonly: '=',
				required: '='
            },
            link: link
        }

        function link(scope, element, attrs, form) {
			scope.maxDate = new Date();
			
			scope.dateOptions = {
				showWeeks:false,
				maxDate: scope.maxDate
			}
        }
    };
})();