(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('HistoricalReportsCtrl', HistoricalReportsCtrl);

	HistoricalReportsCtrl.$inject = ['$stateParams', '$filter', '$timeout', 'appService', 'houseService', 'productionService', 
		'dataLockService', 'toasterService', 'exceptionService', 'alertService', 'Constants'];

	function HistoricalReportsCtrl($stateParams, $filter, $timeout, appService, houseService, productionService, 
			dataLockService, toasterService, exceptionService, alertService, Constants) {
		var vm = this;
		
		vm.standardTargetPercentage = Constants.StandardTargetPercentage;
		vm.standardTargetBirdBalancePercentage = Constants.StandardTargetBirdBalancePercentage;
		vm.standardWeeklyPercentage = Constants.StandardWeeklyPercentage;
		vm.birdsPerDayGrams = Constants.BirdsPerDayGrams;
		vm.hundredBirdsPerDayPounds = Constants.HundredBirdsPerDayPounds;
		vm.displayChart = 0;
		vm.rowsPerPage = "20";
		vm.loading = false;
		vm.displayStats = false;
		vm.displayReport = false;
		vm.deletePermission = false;

		vm.lockDate = null;
		vm.selectedHouse = null;

		vm.deleteRoles = ['administrator', 'deleteEggProduction'];
		vm.rowsPerPageOptions = [
			{key: 20, value: 20},
			{key: 50, value: 50},
			{key: 100, value: 100},
			{key: 10000, value: "All"}
		];
		vm.houseOptions = {};
		vm.houseInfo = {};

		vm.percentageStandardDataset = [];
		vm.percentageActualDataset = [];
		vm.productionStandardDataset = [];
		vm.productionActualDataset = [];
		vm.remainingStandardDataset = [];
		vm.remainingActualDataset = [];

		vm.productionReports = [];
		vm.productionReportsCopy = [];
		vm.maxTarget = 0;
		vm.maxActual = 0;

		vm.$onInit = init();
	
		vm.getProductionReports = getProductionReports;
		vm.toggleChart = toggleChart;
		vm.exportData = exportData;
		vm.confirmDeleteReportAlert = confirmDeleteReportAlert;

		function init() {
			vm.displayReport = false;
			
			getHouses();
			getLatestLockedDate();
			
			if($stateParams.batchId) {
				getProductionReportsByBatch();
			}

			vm.deletePermission = appService.checkMultipleUserRoles(vm.deleteRoles);
		}
		
		function getHouses() {
			vm.loading = true;
			houseService.getHouses()
			.then(function(houses) {
				vm.houseOptions = houses;
				vm.loading = false;
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function getProductionReports() {
			vm.loading = true;
			$timeout(function() {
				productionService.getProductionReportsByHouse(vm.selectedHouse)
				.then(function(response) {
					vm.displayReport = true;
					vm.loading = false;
					vm.houseInfo.name = response.name;
					vm.houseInfo.batch = response.batch;
					vm.houseInfo.stockman = response.stockman;
					vm.houseInfo.initialBirdBalance = response.initialBirdBalance;
					vm.productionReports = generateReport(response.productions, response.initialBirdBalance, response.startAge);
					vm.productionReportsCopy = angular.copy(vm.productionReports );

					if(vm.productionReports.length == 0) {
						toasterService.info("Info", "No reports found for House: " + vm.houseInfo.name);
						vm.displayReport = false;
						vm.displayStats = false;
					} else {
						initStat(); 
					}
					
				})
				.catch(function(error) {
					vm.displayReport = false;
					vm.loading = false;
					vm.displayStats = false;
					exceptionService.catcher(error);
				});
			});
		}

		function getProductionReportsByBatch() {
			vm.loading = true;
			productionService.getProductionReportsByBatch($stateParams.batchId)
			.then(function(response) {
				vm.displayReport = true;
				vm.loading = false;
				vm.houseInfo.name = response.name;
				vm.houseInfo.batch = response.batch;
				vm.houseInfo.stockman = response.stockman;
				vm.houseInfo.initialBirdBalance = response.initialBirdBalance;
				vm.productionReports = generateReport(response.productions, response.initialBirdBalance, response.startAge);
				vm.productionReportsCopy = angular.copy(vm.productionReports );


				vm.selectedHouse = response.houseId;

				if(vm.productionReports.length == 0) {
					toasterService.info("Info", "No reports found for House: " + vm.houseInfo.name);
					vm.displayReport = false;
					vm.displayStats = false;
				} else {
					initStat(); 
				}
				
			})
			.catch(function(error) { 
				vm.displayReport = false;
				vm.loading = false;
				vm.displayStats = false;
				exceptionService.catcher(error);
			});
		}

		function generateReport(productionReports, initialBirdBalance, startAge) {
			if(productionReports && productionReports.length > 0) {
				vm.maxTarget = 0;
				vm.maxActual = 0;

				var previousReport = null;
				var previousTarget = 0;
				var previousActual = 0;
				var weeklyTotalProd = 0;
				
				productionReports.forEach(function(report, index) {
					if(previousReport) {
						report.birdBalance = calculateActualBirdBalance(previousReport.birdBalance, report.cull, report.mortality);
					} else {
						report.birdBalance = calculateActualBirdBalance(initialBirdBalance, report.cull, report.mortality);
					}

					report.actualPercentage = calculateActualPercentage(report.eggProduction, report.birdBalance);
					report.grams = calculateGrams(report.birdBalance, report.feeds);

					if(index % 7 === 0) {
						report.birdPerDayGrams = getBirdsPerDayGramsByWeek(startAge);
						report.hundredbirdsPerDayPounds = getHundredBirdsPerDayPoundsByWeek(startAge);
						
						report.age = startAge;
						startAge++;

						//report.targetPercentage = getTargetPercentage(index/7);
						//report.targetBirdBalance = calculateTargetBirdBalance(initialBirdBalance, index/7);
						report.targetPercentage = getTargetPercentage(report.age);
						report.targetBirdBalance = calculateTargetBirdBalance(initialBirdBalance, report.age);
						report.targetProduction = calculateTargetProd(report.targetPercentage, report.targetBirdBalance);
						report.target = calculateTarget(report.eggProduction, report.targetProduction, initialBirdBalance, previousTarget);
						report.actual = calculateActual(weeklyTotalProd, report.eggProduction, initialBirdBalance, previousActual);
						previousTarget = report.target;
						previousActual = report.actual;
						weeklyTotalProd = 0;
					}

					weeklyTotalProd += report.eggProduction;

					if(report.target > vm.maxTarget) {
						vm.maxTarget = report.target;
					}

					if(report.actual > vm.maxActual) {
						vm.maxActual = report.actual;
					}

					previousReport = report;
				});
			}
			return productionReports;
		}

		function calculateActualBirdBalance(previousBirdBalance, cull, mortality) {
			return previousBirdBalance - cull - mortality;
		}

		function calculateGrams(birdBalance, feeds) {
			var weight = 50;
			if(birdBalance == 0) {
				return 0;
			} else {
				return (feeds * weight) / birdBalance; 
			}
		}

		function calculateTargetBirdBalance(initialTargetBirdBalance, weekNo) {
			if(vm.standardTargetBirdBalancePercentage[weekNo]) {
				return initialTargetBirdBalance * vm.standardTargetBirdBalancePercentage[weekNo];
			} else {
				return null;
			}
			/*var target = 1 - weekNo * 0.001;
			return Math.round(initialTargetBirdBalance * target);*/
		}

		function calculateActualPercentage(production, birdBalance) {
			var percentage = (production/birdBalance);
			return (percentage * 100);
		}

		function getTargetPercentage(weekNo) {
			/*var targetPercentage = [0, 6, 43, 66, 82, 88, 91.4, 93, 94.5, 95.3, 96, 96, 96, 95.8, 95.6, 95.4, 95.2, 94.9, 94.6, 94.3, 94, 
			93.7, 93.4, 93.1, 92.8, 92.5, 92.2, 91.9, 91.5, 91.1, 90.7, 90.3, 89.9, 89.5, 89.1, 88.7, 88.3, 87.9, 87.5, 87.1, 86.7, 86.3, 
			85.9, 85.5, 85.1, 84.7, 84.3, 83.9, 83.5, 83.1, 82.7, 82.3, 81.9, 81.5, 81.1, 80.7, 80.3, 79.9, 79.5, 79.1, 78.7, 78.3, 77.9];
			
			return targetPercentage[weekNo];*/

			if(vm.standardTargetPercentage[weekNo] || vm.standardTargetPercentage[weekNo] == 0) {
				return vm.standardTargetPercentage[weekNo];
			} else {
				return null;
			}
		}

		function calculateTargetProd(targetPercentage, targetBirdBalance) {
			if(targetPercentage == null) {
				return null;
			} else if(targetPercentage >= 0) {
				return Math.round(((targetPercentage/100) * targetBirdBalance));
			}
			//return Math.round(((targetPercentage/100) * targetBirdBalance));
		}

		function calculateTarget(actualProd, targetProd, initialBirdBalance, previousTarget) {
			if(targetProd == null) {
				return null
			}else if(!actualProd || actualProd == 0 || (targetProd * 7) == 0) {
				return 0;
			} else {
				return ((targetProd * 7) / initialBirdBalance) + previousTarget;
			}
			/*if(!actualProd || actualProd == 0 || (targetProd * 7) == 0) {
				return 0;
			} else {
				return ((targetProd * 7) / initialBirdBalance) + previousTarget;
			}*/
		}

		function calculateActual(weeklyTotalProd, actualProd, initialBirdBalance, previousActual) {
			if(!actualProd || actualProd == 0 || weeklyTotalProd == 0) {
				return 0;
			} else {
				return (weeklyTotalProd / initialBirdBalance) + previousActual;
			}
			/*if(!actualProd || actualProd == 0 || weeklyTotalProd == 0) {
				return 0;
			} else {
				return (weeklyTotalProd / initialBirdBalance) + previousActual;
			}*/
		}
		
		function getBirdsPerDayGramsByWeek(week) {
			if(week > 18 && week < 81){
				return vm.birdsPerDayGrams[week];
			} else {
				return null;
			}
		}

		function getHundredBirdsPerDayPoundsByWeek(week) {
			if(week > 18 && week < 81){
				return vm.hundredBirdsPerDayPounds[week];
			} else {
				return null;
			}
		}

		function initStat() {
			var standardWeeklyPercentage = [4, 14, 36, 63, 85, 92, 94.8, 94.6, 94.4, 94.2, 94, 93.8, 93.6, 93.4, 93.2, 93, 92.8, 92.6, 92.4, 92.1, 
			91.8, 91.5, 91.2, 90.9, 90.6, 90.3, 90, 89.6, 89.2, 88.8, 88.4, 88, 87.6, 87.2, 86.8, 86.4, 86, 85.5, 85, 84.5, 84, 83.5, 82.9, 82.3, 
			81.7, 81.1, 80.5, 79.9, 79.2, 78.5, 77.7, 77.1, 76.4, 75.7, 74.9, 74.1, 73.3, 72.5, 71.7, 70.9, 70, 69, 69];

			vm.percentageStandardDataset = [];
			vm.percentageActualDataset = [];
			vm.productionStandardDataset = [];
			vm.productionActualDataset = [];
			vm.remainingStandardDataset = [];
			vm.remainingActualDataset = [];

			for(var i=0, j=vm.productionReports.length; i<j; i+= 7) {
				var weeklyProdReports = vm.productionReports.slice(i, i+7);

				if(weeklyProdReports.length == 7) {
					var age = weeklyProdReports[0].age;
					var targetProduction = Math.round(weeklyProdReports[0].targetProduction);
					var weeklyTotalPercentage = sum(weeklyProdReports, 'actualPercentage');
					var weeklyTotalProd = sum(weeklyProdReports, 'eggProduction');
					var targetBirdBalance = weeklyProdReports[0].targetBirdBalance;
					var actualBirdBalance = weeklyProdReports[0].birdBalance;

					vm.percentageStandardDataset.push(createDatasetObject(age, standardWeeklyPercentage[age - 18]));
					vm.percentageActualDataset.push(createDatasetObject(age, parseFloat((weeklyTotalPercentage/7).toFixed(2))));
					vm.productionStandardDataset.push(createDatasetObject(age, targetProduction));
					vm.productionActualDataset.push(createDatasetObject(age, parseFloat((weeklyTotalProd/7).toFixed(2))));
					vm.remainingStandardDataset.push(createDatasetObject(age, targetBirdBalance));
					vm.remainingActualDataset.push(createDatasetObject(age, actualBirdBalance));
				}
			}

			vm.displayStats = true;
			toggleChart(0);
		}

		function sum(array, property) {
			return array.reduce(function(a, b) {
				return a + (b[property] || 0);
			}, 0);
		}

		function createDatasetObject(age, value) {
			var object = {};
			object.markerType = "triangle";
			object.x = age;
			object.y = value;

			return object;
		}

		function toggleChart(index) {
			vm.displayChart = index;

			$timeout(function() {
				if(vm.displayChart == 0) {
					drawChart("percentageChart", vm.percentageActualDataset, vm.percentageStandardDataset);
				} else if(vm.displayChart == 1) {
					drawChart("productionChart", vm.productionActualDataset, vm.productionStandardDataset);
				} else {
					drawChart("remainingChart", vm.remainingActualDataset, vm.remainingStandardDataset);
				}
			});
		}

		function drawChart(id, actualDataset, standardDataset) {
			var chart = new CanvasJS.Chart(id, {
				animationEnabled: true,
				theme: "light2",
				axisX:{
					 interval: 1,
				},
				axisY:{
					includeZero: false
				},
				data: [{        
					type: "line",
					name: "Actual",   
					showInLegend: true,    
					dataPoints: actualDataset
				},
				{        
					type: "line",
					name: "Standard",   
					showInLegend: true,    
					dataPoints: standardDataset
				}]
			});
			chart.render();
		}

		function exportData() {
			var csv = '';

			csv +=  "HSE " + vm.houseInfo.name + "\r\n\n";

			csv += vm.houseInfo.stockman + ", , , , , , , , , , , ,Eggs per HH" + "\r\n";
			csv += "Batch: " + vm.houseInfo.batch + ", , , ,Actual, Target, Actual, Actual, Target, Target, , ," + vm.maxTarget + "," + vm.maxActual + "\r\n";
			csv += "Date, Age, Mort, Cull, Brd Bal, Brd Bal, Prod, %, %, Prod, Fds., Grms., Target, Actual" + "\r\n";

		    var fileName = "HSE_" + vm.houseInfo.name + "_BATCH_" + vm.houseInfo.batch + "_" + $filter('date')(new Date(), "MMMddyyyy");
   
		   	vm.productionReports.forEach(function(row) {
		   		var string = row.reportDate + ","
		   			+ (row.age ? row.age : "") + "," 
		   			+ (row.cull ? row.cull : "")  + "," 
		   			+ (row.mortality ? row.mortality : "") + "," 
		   			+ row.birdBalance + ","
		   			+ (row.targetBirdBalance ? row.targetBirdBalance : "") + "," 
		   			+ row.eggProduction + ","  
		   			+ row.actualPercentage + "," 
		   			+ (row.targetPercentage ? row.targetPercentage : "") + "," 
		   			+ (row.targetProduction ? row.targetProduction : "") + "," 
		   			+ row.feeds + "," 
		   			+ row.grams + "," 
		   			+ (row.target ? row.target : "") + "," 
		   			+ (row.actual ? row.actual : "")  + "\r\n";

		   		csv += string;	
		   	});
		    
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

		function confirmDeleteReportAlert(reportId, reportDate) {
			if(appService.checkLockDate(new Date(reportDate))) {

				var deleteReportAlertObject = {
				  	type: "warning",
					title: 'Delete Record',
	  				text: "Are you sure you want to delete the record? Once deleted it can never be recovered.",
	  				showCancelButton: true,
	  				confirmButtonText: 'Yes'
				};

				var deleteReportAlertAction = function (result) {
					if(result.value) {
						deleteReport(reportId);
					}
				};

				alertService.custom(deleteReportAlertObject, deleteReportAlertAction);
			}
		}

		function deleteReport(reportId) {
			vm.loading = true;
			productionService.deleteProductionReport(reportId)
			.then(function(response) {
				vm.loading = false;
				toasterService.success("Info", "Record deleted successfully!");
				getProductionReports();
			})
			.catch(function(error) { 
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}
		
		function getLatestLockedDate() {
			dataLockService.getLatestLockedDate()
			.then(function(response) {
				appService.setLockDate(new Date(response.lockDate));
				vm.lockDate = new Date(response.lockDate);
			})
			.catch(function(error){
				exceptionService.catcher(error);
			});
		}
	}
})();