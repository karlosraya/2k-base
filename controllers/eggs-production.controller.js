(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('EggsProductionCtrl', EggsProductionCtrl);

	EggsProductionCtrl.$inject = ['$filter', '$timeout', 'appService', 'productionService', 'dataLockService', 'toasterService', 'exceptionService'];

	function EggsProductionCtrl($filter, $timeout, appService, productionService, dataLockService, toasterService, exceptionService) {
		var vm = this;
		
		vm.loading = false;
		vm.editingPermission = false;
		vm.eggProdForm = null;
		vm.lockDate = null;

		vm.editingRoles = ['administrator', 'editInvoice'];
		vm.reportDate = new Date();
		vm.total = {};
		vm.houseOptions = [];
		vm.eggsProductionData = [];
		vm.eggsProductionDataCopy = [];


		vm.$onInit = init();
		
		vm.compareDate = appService.compareDate;
		vm.selectDate = selectDate;
		vm.editEggsProd = editEggsProd;
		vm.verifyFields = verifyFields;
		vm.submitEggsProd = submitEggsProd;
		vm.getEndingBirdBalance = getEndingBirdBalance;
		vm.editPermission = editPermission;
		vm.back = back;
		
		function init() {
			vm.editing = false;

			getProductionReportsByDate();
			getLatestLockedDate();
		}
		
		function getProductionReportsByDate(updated) {
			vm.loading = true;

			var reportDate = $filter('date')(vm.reportDate, "yyyy-MM-dd");

			productionService.getProductionReportsByDate(reportDate)
			.then(function(response) {
				getHouseOptions(response);
				processEggsProductionData(response);
				vm.loading = false;

				if(updated) {
					toasterService.success("Success", "Input data successfully updated!");
				}
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function selectDate() {
			$timeout(function() {
				if(vm.reportDate) {
					getProductionReportsByDate();
					vm.editing = false;
				}
			});
		}

		function getHouseOptions(response) {
			if(response && response.length > 0) {
				response.forEach(function(batch) {
					var option = {};
					option.id = batch.houseId + "";
					option.name = batch.name;
					vm.houseOptions.push(option);
				});
			}
		}

		function processEggsProductionData(data) {
			vm.eggsProductionData = [];

			data.forEach(function(prodData) {
				var eggProdData = {};
				eggProdData.batchId = prodData.id;
				eggProdData.houseName = prodData.name;
				eggProdData.houseId = prodData.houseId + "";

				if(prodData.productionByDate) {
					eggProdData.id = prodData.productionByDate.id;
					eggProdData.feeds = prodData.productionByDate.feeds;
					eggProdData.cull = prodData.productionByDate.cull;
					eggProdData.mortality = prodData.productionByDate.mortality;
					eggProdData.eggProduction = prodData.productionByDate.eggProduction;
				}
				
				eggProdData.beginningBirdBalance = computeBalance(prodData.initialBirdBalance, prodData.totals.totalMortality, prodData.totals.totalCull);
				eggProdData.endingBirdBalance = computeBalance(eggProdData.beginningBirdBalance, eggProdData.cull, eggProdData.mortality);

				eggProdData.reportDate = vm.reportDate;

				vm.eggsProductionData.push(eggProdData);
			});

			vm.eggsProductionDataCopy = angular.copy(vm.eggsProductionData);

			var total = {};
			total.houseName = "Total";
			total.feeds = sum(vm.eggsProductionData, 'feeds');
			total.eggProduction = sum(vm.eggsProductionData, 'eggProduction');
			total.beginningBirdBalance = sum(vm.eggsProductionData, 'beginningBirdBalance');
			total.endingBirdBalance = sum(vm.eggsProductionData, 'endingBirdBalance');

			vm.total = total;
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

		function editEggsProd(data) {
			if(appService.checkLockDate(vm.reportDate)) {

				vm.eggProdForm.$submitted = false;
				vm.eggProdForm.$setUntouched();
				vm.eggProdForm.$setPristine();

				vm.editing = true;
				vm.eggProd = angular.copy(data);
			}
		}

		function verifyFields() {
			if(vm.eggProdForm.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(vm.eggProdForm.$pristine) {
				toasterService.warning("Warning", "No changes were made to the fields!");
			} else {
				submitEggsProd();
			}
		}

		function submitEggsProd() {
			vm.loading = true;

			var request = angular.copy(vm.eggProd);
			request.reportDate = $filter('date')(request.reportDate, 'yyyy-MM-dd');

			productionService.createUpdateProductionReport(request)
			.then(function(response) {
				getProductionReportsByDate(true); 
				vm.editing = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}
		
		function back() {
			vm.eggProd = {};
			vm.editing = false;
		}

		function getEndingBirdBalance() {
			$timeout(function() {
				var cull = vm.eggProd.cull ? vm.eggProd.cull : 0;
				var mortality = vm.eggProd.mortality ? vm.eggProd.mortality : 0;
				vm.eggProd.endingBirdBalance = vm.eggProd.beginningBirdBalance - cull - mortality;
			});
		}

		function editPermission(name) {
			var userDetails = appService.getUserDetails();
			var editPermission = userDetails.roles.find(function(role) {
				return (role.role == "editEggProduction" && role.houseName == name) || role.role == "administrator";
			});

			return editPermission;
		}
		
		function getLatestLockedDate() {
			dataLockService.getLatestLockedDate()
			.then(function(response) {
				appService.setLockDate(new Date(response.lockDate));
				vm.lockDate = new Date(response.lockDate);
			})
			.catch(function(error){
				console.log(error);
				exceptionService.catcher(error);
			});
		}
	}
})();