(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('ManageUsersCtrl', ManageUsersCtrl);

	ManageUsersCtrl.$inject = [];

	function ManageUsersCtrl() {
		var vm = this;
		
		vm.loading = false;

		vm.$onInit = init();

		function init() {


		}
	}
})();