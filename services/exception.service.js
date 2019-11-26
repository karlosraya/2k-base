(function () {
	angular
		.module('2kApp')
		.factory('exceptionService', exceptionService);

	exceptionService.$inject = ['toasterService'];

	function exceptionService(toasterService) {

		var service = {
			catcher : catcher
		};

		return service;
		
		function catcher(exception) {
			if(exception.data) {
				if(exception.data.message) {
					toasterService.error("Error", exception.data.message);
				} else {
					defaultError();
				}
			} else {
				defaultError();
			}
		}

		function defaultError() {
			toasterService.error("Error", "The application has encountered an unknown error!");
		}
	}
})();