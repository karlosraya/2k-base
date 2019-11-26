(function () {
    angular
		.module('2kApp')
        .directive("standardTable", standardTable);

    standardTable.$inject = ['$filter']

    function standardTable($filter) {
        return {
        	restrict: 'E',
        	templateUrl: "directives/standard-table/standard-table.html",
            scope: {
            	tableDefn: "=",
                data: "="
            },
            link: link
        }

        function link(scope, element, attrs) {

            scope.filter = filter;

			function filter(field, filter) {
                if(filter) {
                    return $filter(filter)(field);
                } else {
                    return field;
                }
            }
        }
    };
})();