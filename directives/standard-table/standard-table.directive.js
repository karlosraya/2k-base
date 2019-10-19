(function () {
    angular
		.module('2kApp')
        .directive("standardTable", standardTable);

    function standardTable() {
        return {
        	restrict: 'E',
        	templateUrl: "directives/standard-table/standard-table.html",
            scope: {
            	tableDefn: "=",
                data: "="
            },
            link: link
        }

        function link(scope, element, attrs, form) {
			
        }
    };
})();