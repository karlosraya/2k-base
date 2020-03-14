(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('GradedEggsCtrl', GradedEggsCtrl);

	GradedEggsCtrl.$inject = ['$stateParams', '$filter', '$timeout', 'appService', 'gradedEggsService', 'productionService', 'dataLockService', 'exceptionService', 'toasterService'];

	function GradedEggsCtrl($stateParams, $filter, $timeout, appService, gradedEggsService, productionService, dataLockService, exceptionService, toasterService) {
		var vm = this;

		vm.loading = false;
		vm.loadingProductions = false;
		vm.editingGradedEggs = false;
		vm.editingPermission = false;

		vm.gradedEggsDate = null;
		vm.lockDate = null;

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
		
		vm.compareDate = appService.compareDate;
		vm.getTotal = getTotal;
		vm.editGradedEggs = editGradedEggs;
		vm.verifyFields = verifyFields;
		vm.back = back;
		vm.selectDate = selectDate;
		vm.exportData = exportData;
		
		function init() {
			if($stateParams.gradedEggsDate) {
				vm.gradedEggsDate = new Date($stateParams.gradedEggsDate);
			} else {
				vm.gradedEggsDate = new Date();
			}
			getGradedEggsByDate();
			getProductionReportsByDate();
			getLatestLockedDate();
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
			if(appService.checkLockDate(vm.gradedEggsDate)) {
				vm.gradedEggsProdCopy = angular.copy(vm.gradedEggsProd);
				form.$submitted = false;
				form.$setUntouched();
				form.$setPristine();
				vm.editingGradedEggs = true;
			}
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
		
		function exportData() {
			var csv = '';

			var gradedEggsDateFiltered = $filter('dateFormat')(vm.gradedEggsDate);
			
			csv +=  "Graded Eggs - " + gradedEggsDateFiltered + "\r\n\n";
			csv += ",Ungraded, PWW, PW, Pullets, Small, Medium, Large, Extra Large, Jumbo, Crack, Spoiled, Totals" + "\r\n";

		    csv += "Beginning, " + vm.gradedEggsUngraded.beginning + ",";
		    vm.eggTypes.forEach(function(eggType) {
		    	csv+= vm.gradedEggsBeginning[eggType.key] + ",";
		    });
		    csv += vm.getTotal(vm.gradedEggsBeginning) + "\r\n";
		    
		    csv += "Production, " + vm.gradedEggsUngraded.production + ",";
		    console.log(vm.gradedEggsPro);
		    vm.eggTypes.forEach(function(eggType) {
		    	var production = vm.gradedEggsProd[eggType.key] ? vm.gradedEggsProd[eggType.key] : 0;
		    	csv+= production + ",";
		    });
		    csv += vm.getTotal(vm.gradedEggsProd) + "\r\n";
		    
		    csv += "Available, " + vm.gradedEggsUngraded.available + ",";
		    vm.eggTypes.forEach(function(eggType) {
		    	var beginning = vm.gradedEggsBeginning[eggType.key] ? vm.gradedEggsBeginning[eggType.key] : 0;
		    	var production = vm.gradedEggsProd[eggType.key] ? vm.gradedEggsProd[eggType.key] : 0;
		    	csv+= beginning + production + ",";
		    });
		    var totalBeginning = vm.getTotal(vm.gradedEggsBeginning) ? vm.getTotal(vm.gradedEggsBeginning) : 0
		    var totalProduction = vm.getTotal(vm.gradedEggsProd) ? vm.getTotal(vm.gradedEggsProd) : 0;
		    csv += (totalBeginning + totalProduction) + "\r\n";
		    
		    csv += "Total Out, " + ",";
		    vm.eggTypes.forEach(function(eggType) {
		    	var totalOut = vm.gradedEggsDailySales[eggType.key] ? vm.gradedEggsDailySales[eggType.key] : 0;
		    	csv+= totalOut + ",";
		    });
		    var totalSales = vm.getTotal(vm.gradedEggsDailySales) ? vm.getTotal(vm.gradedEggsDailySales) : 0; 
		    csv += totalSales + "\r\n";
		    
		    csv += "End, " + vm.gradedEggsUngraded.available + ",";
		    vm.eggTypes.forEach(function(eggType) {
		    	var beginning = vm.gradedEggsBeginning[eggType.key] ? vm.gradedEggsBeginning[eggType.key] : 0;
		    	var production = vm.gradedEggsProd[eggType.key] ? vm.gradedEggsProd[eggType.key] : 0;
		    	var totalOut = vm.gradedEggsDailySales[eggType.key] ? vm.gradedEggsDailySales[eggType.key] : 0;
		    	csv+= (beginning + production - totalOut) + ",";
		    });
		    csv += (totalBeginning + totalProduction - totalSales) + "\r\n";
		    
		    var fileName = "GradedEggs_" + gradedEggsDateFiltered;
		    
		    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);

		    var link = document.createElement("a");    
		    link.href = uri;
		    link.style = "visibility:hidden";
		    link.download = fileName + ".csv";
		    
		    document.body.appendChild(link);
		    link.click();
		    document.body.removeChild(link);

		    toasterService.success("Success", "Data exported successfully!");
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