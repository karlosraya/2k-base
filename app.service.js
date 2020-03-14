(function () {
	angular
		.module('2kApp')
		.factory('appService', appService);

	appService.$inject = ['$filter', 'toasterService'];
	
	function appService($filter, toasterService) {

		var userDetails = {};
		var lockDate = null;
		
		var service = {
			setUserDetails: setUserDetails,
			getUserDetails: getUserDetails,
			getUserRoles: getUserRoles,
			checkUserRoles: checkUserRoles,
			checkMultipleUserRoles: checkMultipleUserRoles,
			setLockDate: setLockDate,
			checkLockDate: checkLockDate,
			compareDate: compareDate
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
		
		function setLockDate(newLockDate) {
			lockDate = newLockDate;
		}
		
		function checkLockDate(date) {
			if(compareDate(date)) {
				toasterService.error("Error", "Data lock is enforced up to " + $filter('dateFormat')(lockDate) + "!");
				return false;
			} else {
				return true;
			}
		}
		function compareDate(date) {
			if(lockDate && date) {
				var lockDatePlain = lockDate.setHours(0,0,0,0);
				var datePlain = date.setHours(0,0,0,0);
				
				return datePlain <= lockDatePlain;
			} else {
				return false;
			}
		}
	}
})();