(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('PricesCtrl', PricesCtrl);

	PricesCtrl.$inject = ['pricesService', 'exceptionService', 'toasterService'];

	function PricesCtrl(pricesService, exceptionService, toasterService) {
		var vm = this;
		
		vm.loading = false;
		vm.editingPrices = false;
		vm.prices = {};

		vm.$onInit = init();

		vm.editPrices = editPrices;
		vm.verifyFields = verifyFields;
		vm.updatePrices = updatePrices;
		vm.cancel = cancel;

		function init() {
			getPrices();
		}

		function getPrices() {
			vm.loading = true;
			pricesService.getPrices()
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
			vm.prices.lastInsertUpdateBy = "Antonio Raya";
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