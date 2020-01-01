(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('FeedsDeliveryCtrl', FeedsDeliveryCtrl);

	FeedsDeliveryCtrl.$inject = ['$timeout', '$filter', 'feedsDeliveryService', 'productionService', 'toasterService', 'exceptionService'];

	function FeedsDeliveryCtrl($timeout, $filter, feedsDeliveryService, productionService, toasterService, exceptionService) {
		var vm = this;
		
		vm.loading = false;
		vm.loadingProduction = false;
		vm.displayFeedsDelivery = false;
		vm.displayFeedsConsumption = false;
		vm.endBalance = null;
		vm.beginningBalance = null;

		vm.eggsProductionData = [];
		vm.eggsProductionDataCopy = [];
		vm.delivery = {};
		vm.deliveryDate = new Date();
		vm.total = 0;
		
		vm.$onInit = init();

		vm.computeBalance = computeBalance;
		vm.verifyFields = verifyFields;
		vm.selectDate = selectDate;

		function init() {
			getFeedsDeliveryByDate();
			getProductionReportsByDate();
		}

		function getFeedsDeliveryByDate() {
			vm.loading = true;

			var requestDate = $filter('date')(vm.deliveryDate, 'yyyy-MM-dd');

			feedsDeliveryService.getFeedsDeliveryByDate(requestDate)
			.then(function(response) {
				if(response) {
					vm.delivery = response;
					vm.beginningBalance = vm.delivery.totalAvailable - vm.delivery.totalConsumption;
					computeBalance();
				}
				vm.displayFeedsDelivery = true;
				vm.loading = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.displayFeedsDelivery = false;
				vm.loading = false;
			});
		}

		function getProductionReportsByDate() {
			vm.loadingProduction = true;

			var reportDate = $filter('date')(vm.deliveryDate, "yyyy-MM-dd");

			productionService.getProductionReportsByDate(reportDate)
			.then(function(response) {
				processEggsProductionData(response);
				vm.loadingProduction = false;
				vm.displayFeedsConsumption = true;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loadingProduction = false;
				vm.displayFeedsConsumption = false;
			});
		}

		function processEggsProductionData(data) {
			vm.eggsProductionData = [];

			data.forEach(function(prodData) {
				var eggProdData = {};
				eggProdData.houseName = prodData.name;

				if(prodData.productionByDate) {
					eggProdData.feeds = prodData.productionByDate.feeds;
				}
				vm.eggsProductionData.push(eggProdData);
			});

			vm.eggsProductionDataCopy = angular.copy(vm.eggsProductionData);

			vm.total = sum(vm.eggsProductionData, 'feeds');
		}

		function computeBalance(balance, cull, mortality) {
			var c = cull ? cull : 0;
			var m = mortality ? mortality : 0;

			return balance - c - m;
		}

		function sum(array, property) {
			return array.reduce(function(a, b) {
				return a + (b[property] || 0);
			}, 0);
		}

		function selectDate(form) {
			form.$submitted = false;
			form.$setUntouched();
			form.$setPristine();
			$timeout(function() {
				if(vm.deliveryDate) {
					getFeedsDeliveryByDate();
					getProductionReportsByDate();
				}
			});
		}

		function computeBalance() {
			$timeout(function() {
				var delivery = vm.delivery.delivery ? vm.delivery.delivery  : 0;
				var totalAvailable = parseInt(vm.delivery.totalAvailable);
				
				vm.endBalance = totalAvailable + delivery - vm.delivery.totalConsumption - vm.delivery.dailyConsumption;
			});
		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(form.$pristine) {
				toasterService.warning("Warning", "No changes were made to the fields!");
			} else {
				submitDelivery();
			}
		}

		function submitDelivery() {
			vm.loading = true;

			var request = angular.copy(vm.delivery);
			request.deliveryDate = $filter('date')(vm.deliveryDate, 'yyyy-MM-dd');
			request.lastInsertUpdateBy = "Antonio Raya";

			feedsDeliveryService.createUpdateFeedsDelivery(request)
			.then(function(response) {
				getFeedsDeliveryByDate();
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}
	}
})();