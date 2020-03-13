(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('FeedsDeliveryCtrl', FeedsDeliveryCtrl);

	FeedsDeliveryCtrl.$inject = ['$timeout', '$filter','appService', 'alertService', 'feedsDeliveryService', 'productionService', 'toasterService', 'exceptionService', 'Constants'];

	function FeedsDeliveryCtrl($timeout, $filter, appService, alertService, feedsDeliveryService, productionService, toasterService, exceptionService, Constants) {
		var vm = this;
		
		vm.loading = false;
		vm.loadingProduction = false;
		vm.displayFeedsDelivery = false;
		vm.displayFeedsConsumption = false;
		vm.editingPermission = false;
		vm.deletePermission = false;
		vm.beginningBalance = 0;
		vm.totalDelivered = 0;
		vm.totalConsumption = 0;
		vm.endBalance = 0;

		vm.editingRoles = ['administrator', 'editFeedsDelivery'];
		vm.deleteRoles = ['administrator', 'deleteFeedsDelivery'];
		vm.eggsProductionData = [];
		vm.eggsProductionDataCopy = [];
		vm.deliveries = [];
		vm.deliveriesCopy = [];
		vm.dailyReport = {};
		vm.deliveryData = {};
		vm.deliveryDate = new Date();
		
		vm.$onInit = init();

		vm.verifyFields = verifyFields;
		vm.selectDate = selectDate;
		vm.addDelivery = addDelivery;
		vm.editDelivery = editDelivery;
		vm.confirmDeleteReportAlert = confirmDeleteReportAlert;
		vm.back = back;
		
		function init() {
			getFeedsDeliveryByDate();
			getProductionReportsByDate();
			vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
			vm.deletePermission = appService.checkMultipleUserRoles(vm.deleteRoles);
		}

		function getFeedsDeliveryByDate(submitToaster, deleteToaster) {
			vm.loading = true;

			var requestDate = $filter('date')(vm.deliveryDate, 'yyyy-MM-dd');

			feedsDeliveryService.getFeedsDeliveryByDate(requestDate)
			.then(function(response) {
				if(response) {
					vm.dailyReport = response;
					vm.deliveries = vm.dailyReport.deliveries;
					vm.deliveriesCopy = angular.copy(vm.deliveries);
					vm.beginningBalance = vm.dailyReport.totalAvailable;
					vm.totalConsumption = vm.dailyReport.dailyConsumption;
					computeBalance();
				}
				vm.displayFeedsDelivery = true;
				vm.loading = false;
				vm.editing = false;
				if(submitToaster) {
					toasterService.success("Success", "Feeds delivery data successfully updated!");
				}
				if(deleteToaster) {
					toasterService.success("Success", "Feeds delivery data successfully deleted!");
				}
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
				var delivery = sum(vm.dailyReport.deliveries, "delivery");
				vm.totalDelivered = delivery;
				var totalAvailable = parseInt(vm.dailyReport.totalAvailable);
				
				vm.endBalance = totalAvailable + delivery - vm.dailyReport.dailyConsumption;
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

			var request = angular.copy(vm.deliveryData);
			request.deliveryDate = $filter('date')(vm.deliveryDate, 'yyyy-MM-dd');

			feedsDeliveryService.createUpdateFeedsDelivery(request)
			.then(function() {
				getFeedsDeliveryByDate(true);
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function addDelivery(form) {
			form.$submitted = false;
			vm.editing = true;
			vm.deliveryData = {};
		}
		
		function editDelivery(deliveryData) {
			vm.editing = true;
			vm.deliveryData = angular.copy(deliveryData);
		}
		
		function confirmDeleteReportAlert(reportId) {

			var deleteReportAlertObject = {
			  	type: "warning",
				title: 'Delete Record',
  				text: "Are you sure you want to delete the record? Once deleted it can never be recovered.",
  				showCancelButton: true,
  				confirmButtonText: 'Yes'
			};

			var deleteReportAlertAction = function (result) {
				if(result.value) {
					deleteDelivery(reportId);
				}
			};

			alertService.custom(deleteReportAlertObject, deleteReportAlertAction);
		}
		
		function deleteDelivery(id) {
			vm.loading = true;

			feedsDeliveryService.deleteFeedsDelivery(id)
			.then(function() {
				getFeedsDeliveryByDate(false, true);
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}
		
		function back() {
			vm.editing = false;
		}
	}
})();