(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = [];

	function LoginCtrl() {
		var vm = this;
		
		vm.loading = false;

		vm.$onInit = init();

		function init() {


		}
	}
})();