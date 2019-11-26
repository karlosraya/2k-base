(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('DashboardCtrl', DashboardCtrl);

	DashboardCtrl.$inject = [];

	function DashboardCtrl() {
		var vm = this;
		
		vm.loading = false;

		vm.$onInit = init();

		function init() {


		}
	}
})();