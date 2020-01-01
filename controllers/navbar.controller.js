(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('NavigationBarCtrl', NavigationBarCtrl);

	NavigationBarCtrl.$inject = ['$state', 'authService', 'appService', 'exceptionService', 'toasterService'];

	function NavigationBarCtrl($state, authService, appService, exceptionService, toasterService) {
		var vm = this;

		vm.activeNavbar = false;
		vm.loading = false;
		vm.userInfo = {};

		vm.logout = "Logout";

		vm.toggleNavbar = toggleNavbar;
		vm.logout = logout;

		vm.$onInit = init();

		function init() {
			getUserInformation(); 
		}

		function toggleNavbar() {
			vm.activeNavbar = !vm.activeNavbar;
		}

		function logout() {
			vm.loading = true;
			authService.logout()
			.then(function(response) {
				$state.go("login");
				toasterService.success("Success", "Logout successful!");
				vm.loading = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
		vm.loading = false;
			});
		}

		function getUserInformation() {
			vm.userInfo = appService.getUserDetails();
		}
	}
})();