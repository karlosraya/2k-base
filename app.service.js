(function () {
	angular
		.module('2kApp')
		.factory('appService', appService);

	appService.$inject = ['authService'];

	function appService(authService) {

		var userDetails = {};

		var service = {
			setUserDetails: setUserDetails,
			getUserDetails: getUserDetails,
			getUserRoles: getUserRoles,
			checkUserRoles: checkUserRoles,
			checkMultipleUserRoles: checkMultipleUserRoles
		};

		return service;

		function setUserDetails(newUserDetails) {
			userDetails = newUserDetails;
		}

		function getUserDetails() {
			return userDetails;
		}

		function getUserRoles() {
			return userDetails.roles;
		}

		function checkUserRoles(role) {
			if(userDetails.roles && userDetails.roles.length > 0) {
				return userDetails.roles.map(function(e) { return e.role}).indexOf(role) > -1;
			} else {
				return false;
			}
		}

		function checkMultipleUserRoles(roles) {
			if(roles && roles.length > 0) {
				for(var i=0; i<roles.length; i++) {
					if(checkUserRoles(roles[i])) {
						return true;
					}
				}
				return false;
			} else {
				return false;
			}
		}
	}
})();