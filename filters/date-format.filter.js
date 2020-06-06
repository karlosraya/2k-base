(function () {
    angular
		.module('2kApp')
        .filter("dateFormat", dateFormat);

    dateFormat.$inject = ['$filter']

    function dateFormat($filter) {
       return function (input) {
            if(input) {
                var date = new Date(input);
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                return $filter('date')(date, "M/d/yyyy");
            } else {
                return null;
            }
       }
    }
})();