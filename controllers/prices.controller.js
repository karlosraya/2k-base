(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('PricesCtrl', PricesCtrl);

	PricesCtrl.$inject = ['$timeout', 'appService', 'pricesService', 'customerService', 'exceptionService', 'toasterService'];

	function PricesCtrl($timeout, appService, pricesService, customerService, exceptionService, toasterService) {
		var vm = this;
		
		vm.loading = false;
		vm.editingPrices = false;
		vm.editingPermission = false;
		vm.customerSelected = false;
		vm.customerId = null;
		
		vm.editingRoles = ['administrator', 'editPrice'];
		vm.customers = [];
		vm.prices = {};

		vm.$onInit = init();

		vm.setCustomer = setCustomer;
		vm.editPrices = editPrices;
		vm.verifyFields = verifyFields;
		vm.updatePrices = updatePrices;
		vm.cancel = cancel;

		function init() {
			getCustomers();
			vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
		}

		function getCustomers() {
			vm.loading = true;
			customerService.getCustomers()
			.then(function(customers) {
				if(customers && customers.length > 0) {
					customers.forEach(function(customer) {
						var firstName = customer.firstName;
						var lastName = customer.lastName ? " " + customer.lastName : "";
						customer.fullName = firstName + lastName;
					});
				}
				vm.customers = customers;
				vm.loading = false;
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}
		
		function setCustomer() {
			cancel();
			$timeout(function() {
				vm.customerSelected = true;
				getPrices(vm.customerId);
			});
		}
		
		function getPrices() {
			vm.prices = {};
			vm.loading = true;
			pricesService.getPricesByCustomerId(vm.customerId)
			.then(function(response) {
				if(response) {
					vm.prices = response;
					var keys = Object.keys(vm.prices);

					keys.forEach(function(key) {
						if(!vm.prices[key]) {
							vm.prices[key] = 0;
						}
					});
				}
				vm.loading = false;
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}

		function editPrices(form) {
			form.$submitted = false;
			form.$setUntouched();
			form.$setPristine();
			vm.editingPrices = true;
			vm.pricesCopy = angular.copy(vm.prices);
		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(form.$pristine) {
				toasterService.warning("Warning", "No changes were made to the fields!");
			} else {
				updatePrices();
			}
		}

		function updatePrices() {
			vm.loading = true;
			vm.prices.customerId = vm.customerId;
			
			pricesService.updatePrices(vm.prices)
			.then(function(response) {
				if(response) {
					vm.prices = response;
					var keys = Object.keys(vm.prices);

					keys.forEach(function(key) {
						if(!vm.prices[key]) {
							vm.prices[key] = 0;
						}
					});
				}
				toasterService.success("Success", "The prices were successfully updated!");
				vm.loading = false;
				vm.editingPrices = false;
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}
		
		function cancel() {
			vm.editingPrices = false;
			vm.prices = angular.copy(vm.pricesCopy);
			vm.pricesCopy = {};
		}
	}
})();