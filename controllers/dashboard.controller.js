(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('DashboardCtrl', DashboardCtrl);

	DashboardCtrl.$inject = ['authService', 'exceptionService'];

	function DashboardCtrl(authService, exceptionService) {
		var vm = this;
		
		vm.loading = false;

		vm.$onInit = init();

		function init() {
			
		}

	}
})();