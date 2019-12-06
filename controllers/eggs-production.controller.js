(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('EggsProductionCtrl', EggsProductionCtrl);

	EggsProductionCtrl.$inject = ['$filter', '$timeout', 'appService', 'productionService', 'toasterService', 'exceptionService'];

	function EggsProductionCtrl($filter, $timeout, appService, productionService, toasterService, exceptionService) {
		var vm = this;
		
		vm.loading = false;
		vm.eggProdForm = null;
		vm.reportDate = new Date();
		vm.houseOptions = {};
		vm.eggsProductionData = [];
		vm.productions = [];

		vm.$onInit = init();
		
		vm.selectDate = selectDate;
		vm.verifyFields = verifyFields;
		vm.submitEggsProd = submitEggsProd;
		vm.getEndingBirdBalance = getEndingBirdBalance;
		vm.back = back;
		
		function init() {
			vm.editing = false;

			getProductionReportsByDate();

			vm.eggsProdTableDefn = [
				{
					name: "houseName",
					attributes: {},
					label: "House"
					
				},
				{
					name: "feeds",
					attributes: {},
					label: "Feeds"
					
				},
				{
					name: "eggProduction",
					attributes: {},
					label: "Eggs Produced"
					
				},
				{
					name: "beginningBirdBalance",
					attributes: {
						dataBreakpoints: "md"
					},
					label: "Beginning Bird Balance"
					
				},
				{
					name: "cull",
					attributes: {},
					label: "Culls"
					
				},
				{
					name: "mortality",
					attributes: {},
					label: "Mortality"
					
				},
				{
					name: "endingBirdBalance",
					attributes: {
						dataBreakpoints: "md"
					},
					label: "Ending Bird Balance"
					
				},
				{
					attributes: {
						dataBreakpoints: "md",
						columnType: "html"
					},
					isButton: true,
					buttonLabel: "Edit",
					buttonAction: editEggsProd
				}
			];
		}
		
		function getProductionReportsByDate(updated) {
			vm.loading = true;

			var reportDate = $filter('date')(vm.reportDate, "yyyy-MM-dd");

			productionService.getProductionReportsByDate(reportDate)
			.then(function(response) {
				vm.productions = response;
				getHouseOptions(response);
				processEggsProductionData();
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
				getProductionReportsByDate();
				vm.editing = false;
			});
		}

		function getHouseOptions(response) {
			if(response && response.length > 0) {
				response.forEach(function(batch) {
					vm.houseOptions[batch.houseId] = batch.name;
				});
			}
		}

		function processEggsProductionData() {
			vm.eggsProductionData = [];

			vm.productions.forEach(function(prod) {
				var eggProdData = {};
				eggProdData.batchId = prod.id;
				eggProdData.houseName = prod.name;
				eggProdData.houseId = prod.houseId + "";

				var dailyReport = getDailyReport(prod.productions);
				if(dailyReport) {
					eggProdData.id = dailyReport.id;
					eggProdData.feeds = dailyReport.feeds;
					eggProdData.cull = dailyReport.cull;
					eggProdData.mortality = dailyReport.mortality;
					eggProdData.eggProduction = dailyReport.eggProduction;
				}

				eggProdData.beginningBirdBalance = computeBeginningBirdBalance(prod.initialBirdBalance, prod.productions);
				eggProdData.endingBirdBalance = computeEndingBirdBalance(eggProdData.beginningBirdBalance, eggProdData.cull, eggProdData.mortality);; 

				eggProdData.reportDate = vm.reportDate;

				vm.eggsProductionData.push(eggProdData);
			});
		}

		function computeBeginningBirdBalance(initialBirdBalance, prodReports) {
			var culls = sum(prodReports, "cull");
			var mortality = sum(prodReports, "mortality");

			return initialBirdBalance - culls - mortality;
		}

		function computeEndingBirdBalance(beginningBirdBalance, cull, mortality) {
			var c = cull ? cull : 0;
			var m = mortality ? mortality : 0;

			return beginningBirdBalance - c - m;
		}

		function getDailyReport(array, property) {
			var currentDate = angular.copy(vm.reportDate);
			currentDate.setHours(0,0,0,0);

			if(array && array.length > 0) {
				var latestReportDate = new Date(array[array.length - 1].reportDate);
				latestReportDate.setHours(0,0,0,0);
				if(latestReportDate.getTime() === currentDate.getTime()) {
					return array[array.length - 1];
				} else {
					return null;
				}
			} else {
				return null;
			}
		}

		function sum(array, property) {
			return array.reduce(function(a, b) {
				return a + (b[property] || 0);
			}, 0);
		}


		function editEggsProd(index) {
			vm.eggProdForm.$submitted = false;
			vm.eggProdForm.$setUntouched();
			vm.eggProdForm.$setPristine();

			vm.editing = true;
			vm.eggProd = angular.copy(vm.eggsProductionData[index]);
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
			request.lastInsertUpdateBy = "Antonio Raya";
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
	}
})();