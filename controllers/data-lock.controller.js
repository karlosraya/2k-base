(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('DataLockCtrl', DataLockCtrl);

	DataLockCtrl.$inject = ['exceptionService'];

	function DataLockCtrl(exceptionService) {
		var vm = this;
		
		vm.loading = false;

		vm.$onInit = init();

		function init() {
			
		}

	}
})();