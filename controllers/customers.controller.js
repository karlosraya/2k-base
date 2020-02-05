(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('CustomersCtrl', CustomersCtrl);

	CustomersCtrl.$inject = ['appService', 'customerService', 'exceptionService', 'toasterService'];

	function CustomersCtrl(appService, customerService, exceptionService, toasterService) {
		var vm = this;
		
		vm.loading = false;
		vm.editingCustomer = false;
		vm.addingCustomer = false;
		vm.editingPermission = false;

		vm.editingRoles = ['administrator', 'editCustomer'];
		vm.customers = [];
		vm.customerInfo = {};

		vm.$onInit = init();

		vm.editCustomer = editCustomer;
		vm.addCustomer = addCustomer;
		vm.back = back;
		vm.verifyFields = verifyFields;

		function init() {
			getCustomers();
			vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
		}

		function getCustomers(back, id) {
			vm.loading = true;
			customerService.getCustomers()
			.then(function(response) {
				if(response && response.length == 0) {
					toasterService.info("Info", "No customers found!")
				}
				vm.customers = response;
				vm.loading = false;
				if(back) {
					if(id) {
						toasterService.success("Success", "The customer was successfully updated!");
					} else {
						toasterService.success("Success", "The customer was successfully added!");
					}
					back();
				}
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}

		function addCustomer() {
			vm.addingCustomer = true;
			vm.customerInfo = {};
		}
		
		function back() {
			vm.editingCustomer = false;
			vm.addingCustomer = false;
		}
		
		function editCustomer(customer) {
			vm.editingCustomer = true;
			vm.customerInfo = angular.copy(customer);
		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(form.$pristine) {
				toasterService.warning("Warning", "No changes were made to the fields!");
			}else {
				submitCustomer();
			}
		}

		function submitCustomer() {
			vm.loading = true;
			customerService.createUpdateCustomer(vm.customerInfo)
			.then(function(response) {
				vm.customers = response;
				vm.loading = false;
				getCustomers(back, vm.customerInfo.id);
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}
	}
})();