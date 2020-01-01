(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = ['$state', 'authService', 'exceptionService', 'toasterService'];

	function LoginCtrl($state, authService, exceptionService, toasterService) {
		var vm = this;
		
		vm.loading = false;
		vm.user = {};

		vm.$onInit = init();

		vm.verifyFields = verifyFields;

		function init() {
			var layersPortalToken = localStorage.getItem('layersPortalToken');

			if(layersPortalToken) {
				$state.go("main.dashboard");
			}
		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "Please complete the form!");
			} else {
				login();
			}
		}

		function login() {
			vm.loading = true;

			authService.login(vm.user)
			.then(function(response) {
				toasterService.success("Success", "Login Successful!");
				$state.go("main.dashboard");
			})
			.catch(function(error) {
				if(error.data) {
					toasterService.error("Error", error.data.error);
				} else {
					exceptionService.catcher(error);
				}
				vm.loading = false;
			});
		}
	}
})();