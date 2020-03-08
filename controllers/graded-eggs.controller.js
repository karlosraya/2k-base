(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('GradedEggsCtrl', GradedEggsCtrl);

	GradedEggsCtrl.$inject = ['$state', '$filter', '$timeout', 'appService', 'gradedEggsService', 'productionService', 'exceptionService', 'toasterService'];

	function GradedEggsCtrl($state, $filter, $timeout, appService, gradedEggsService, productionService, exceptionService, toasterService) {
		var vm = this;

		vm.loading = false;
		vm.loadingProductions = false;
		vm.editingGradedEggs = false;
		vm.editingPermission = false;

		vm.gradedEggsDate = new Date();

		vm.editingRoles = ['administrator', 'editGradedEggs'];
		vm.eggTypes = [
			{header: 'PWW', key: 'pww'}, 
			{header: 'PW', key: 'pw'}, 
			{header: 'Pullets', key: 'pullets'}, 
			{header: 'Small', key: 'small'}, 
			{header: 'Medium', key: 'medium'}, 
			{header: 'Large', key: 'large'}, 
			{header: 'Extra Large', key: 'extraLarge'}, 
			{header: 'Jumbo', key: 'jumbo'}, 
			{header: 'Crack', key: 'crack'}, 
			{header: 'Spoiled', key: 'spoiled'}];

		vm.gradedEggsProd = {};
		vm.gradedEggsProdCopy = {};
		vm.gradedEggsBeginning = {};
		vm.gradedEggsTotalOut = {};
		vm.gradedEggsUngraded = {};

		vm.$onInit = init();

		vm.getTotal = getTotal;
		vm.editGradedEggs = editGradedEggs;
		vm.verifyFields = verifyFields;
		vm.back = back;
		vm.selectDate = selectDate;

		function init() {
			getGradedEggsByDate();
			getProductionReportsByDate();
			vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
		}

		function selectDate() {
			$timeout(function() {
				if(vm.gradedEggsDate) {
					getGradedEggsByDate();
					getProductionReportsByDate();
				}
			});
		}

		function getGradedEggsByDate(toaster, added) {
			vm.loading = true;
			var requestDate = $filter('date')(vm.gradedEggsDate, 'yyyy-MM-dd');

			gradedEggsService.getGradedEggsyByDate(requestDate)
			.then(function(response) {
				vm.loading = false;
				vm.gradedEggsProd = response.gradedEggsProduction;
				vm.gradedEggsBeginning = computBeginningBalance(response.gradedEggsTotal, response.totalSales);
				vm.gradedEggsDailySales = computeTotalOut(response.totalDailySales);
				vm.gradedEggsUngraded = computeUngraded(response);

				vm.editingGradedEggs = false;
				if(toaster) {
					toasterService.success("Success", "Graded Eggs information updated successfully");
				}
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}

		function getProductionReportsByDate() {
			vm.loadingProductions = true;

			var reportDate = $filter('date')(vm.gradedEggsDate, "yyyy-MM-dd");

			productionService.getProductionReportsByDate(reportDate)
			.then(function(response) {
				processEggsProductionData(response);
				vm.loadingProductions = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loadingProductions = false;
			});
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
					eggProdData.cull = prodData.productionByDate.cull;
					eggProdData.mortality = prodData.productionByDate.mortality;
					eggProdData.eggProduction = prodData.productionByDate.eggProduction;
				}
				
				eggProdData.beginningBirdBalance = computeBalance(prodData.initialBirdBalance, prodData.totals.totalMortality, prodData.totals.totalCull);
				eggProdData.endingBirdBalance = computeBalance(eggProdData.beginningBirdBalance, eggProdData.cull, eggProdData.mortality);

				eggProdData.reportDate = vm.gradedEggsDate;

				vm.eggsProductionData.push(eggProdData);
			});

			vm.eggsProductionDataCopy = angular.copy(vm.eggsProductionData);

			var total = {};
			total.houseName = "Total";
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

		function computeUngraded(data) {
			var ungradedEggs = {};
			ungradedEggs.beginning = data.totalEggProductions - getTotal(data.gradedEggsTotal);
			ungradedEggs.production = data.eggProductions - getTotal(data.gradedEggsProduction);
			ungradedEggs.available = ungradedEggs.beginning + ungradedEggs.production;

			return ungradedEggs;
		}

		function computeTotalOut(totalSales) {
			var totalOut = {};

			vm.eggTypes.forEach(function(eggType) {
				var total = totalOutSumByEggType(totalSales, eggType.key);
				totalOut[eggType.key] = total ? total : 0;
			});

			return totalOut;
		}

		function totalOutSumByEggType(totalSales, eggType) {
			var filteredSales = totalSales.filter(function(sale) {
				return sale.item == eggType;
			});

			var total = 0;

			filteredSales.forEach(function(sale) {
				total = total + sale.quantity;
			});

			return total;
		}

		function computBeginningBalance(gradedEggsTotal, salesTotal) {
			var beginningBalance = {};

			vm.eggTypes.forEach(function(eggType) {
				var beginning = gradedEggsTotal[eggType.key] ? gradedEggsTotal[eggType.key] : 0;

				beginningBalance[eggType.key] = beginning - findTotalByEggType(salesTotal, eggType.key);
			});

			return beginningBalance;
		}

		function findTotalByEggType(salesTotal, eggType) {
			var total = salesTotal.find(function(sale) {
				return sale.item === eggType;
			});

			if(total) {
				return total.total;
			} else {
				return 0;
			}
		}

		function getTotal(gradedEggs) {
			var total = 0;
			if(gradedEggs) {
				vm.eggTypes.forEach(function(eggType) {
					total += gradedEggs[eggType.key] ? gradedEggs[eggType.key] : 0;
				});
				return total;
			} else {
				return null;
			}
		}

		function editGradedEggs(form) {
			vm.gradedEggsProdCopy = angular.copy(vm.gradedEggsProd);
			form.$submitted = false;
			form.$setUntouched();
			form.$setPristine();
			vm.editingGradedEggs = true;
		}

		function back() {
			vm.gradedEggsProd = angular.copy(vm.gradedEggsProdCopy);
			vm.editingGradedEggs = false;
		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(form.$pristine) {
				toasterService.warning("warning", "No changes were made to the fields!");
			} else {
				submitGradedEggs();
			}
		}

		function submitGradedEggs() {
			vm.loading = true;

			var request = angular.copy(vm.gradedEggsProd);
			request.inputDate = $filter('date')(vm.gradedEggsDate, 'yyyy-MM-dd');

			gradedEggsService.createUpdateGradedEggs(request)
			.then(function(response) {
				getGradedEggsByDate(true); 
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}
	}
})();