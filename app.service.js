(function () {
	angular
		.module('2kApp')
		.factory('appService', appService);

	appService.$inject = ['authService'];

	function appService(authService) {

		var userDetails = {};

		var service = {
			setUserDetails: setUserDetails,
			getUserDetails: getUserDetails
		};

		return service;

		function setUserDetails(newUserDetails) {
			userDetails = newUserDetails;
		}

		function getUserDetails() {
			return userDetails;
		}
	}
})();