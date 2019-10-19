(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('HistoricalReportsCtrl', HistoricalReportsCtrl);

	HistoricalReportsCtrl.$inject = ['$timeout', 'layersService'];

	function HistoricalReportsCtrl($timeout, layersService) {
		var vm = this;
		
		vm.$onInit = init();
		
		vm.displayHouseReport = displayHouseReport;
		
		function init() {
			vm.displayReport = false;
			vm.selectedHouse = null;
			vm.houseInfo = {};
			vm.houseReport = null;
			
			vm.houseOptions = layersService.getHouseOptions();
			
			vm.historicalReportTableDefn = [
				{
					name: "date",
					attributes: {},
					label: "Date"
					
				},
				{
					name: "age",
					attributes: {},
					label: "Age"
					
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
					name: "birdBalance",
					attributes: {},
					label: "Actual Bird Balance"
					
				},
				{
					name: "targetBirdBalance",
					attributes: {},
					label: "Target Bird Balance"
					
				},
				{
					name: "eggProduction",
					attributes: {},
					label: "Actual Production"
					
				},
				{
					name: "actualPercentage",
					attributes: {},
					label: "Actual Percentage"
					
				},
				{
					name: "targetPercentage",
					attributes: {},
					label: "Target Percentage"
					
				},
				{
					name: "targetProduction",
					attributes: {},
					label: "Target Production"
					
				},
				{
					name: "feeds",
					attributes: {},
					label: "Feeds"
				},
				{
					name: "grams",
					attributes: {},
					label: "Grams"
				},
				{
					name: "target",
					attributes: {},
					label: "Target"
				},
				{
					name: "actual",
					attributes: {},
					label: "Actual"
				}
			];
		}
		
		function displayHouseReport() {
			$timeout(function() {
				vm.displayReport = true;
				vm.houseInfo = layersService.getHouseInfo(vm.selectedHouse);
				vm.houseReport = generateReport();
			});
		}
		
		function generateReport() {
			var report = layersService.getHouseReport(vm.selectedHouse);
			
			var previousRecord = null;
			var previousAge = null;
			var initialTargetBirdBalance = null;
			var ctr = 0; 
			var targetBirdBalanceCtr = 0;

			report.forEach(function(record, index) {
				if(!record.birdBalance) {
					record.birdBalance = caluclateActualBirdBalance(previousRecord.birdBalance, record.cull, record.mortality);
				} 
				
				record.actualPercentage = calculateActualPercentage(record.eggProduction, record.birdBalance);
				record.grams = calculateGrams(record.birdBalance, record.feeds);
				
				if(record.age) {
					previousAge = record.age;
				}
				
				if(index == 0) {
					record.targetBirdBalance = record.birdBalance + record.cull + record.mortality;
					initialTargetBirdBalance = record.targetBirdBalance; 
				}
				
				if(ctr == 7) {
					record.targetBirdBalance = calculateTargetBirdBalance(initialTargetBirdBalance, targetBirdBalanceCtr);
					targetBirdBalanceCtr+= 0.001;
					previousAge++;
					record.age = previousAge;
					ctr = 0;
				} else {
					ctr++; 
				}
				previousRecord = record;
			});
			
			return report;
		}
		
		function caluclateActualBirdBalance(previousBirdBalance, cull, mortality) {
			return previousBirdBalance - cull - mortality;
		}
		
		function calculateTargetBirdBalance(initialTargetBirdBalance, index) {
			var target = 0.999 - index;
			return Math.round(initialTargetBirdBalance * target);
		}
		
		function calculateActualPercentage(production, birdBalance) {
			var percentage = (production/birdBalance).toFixed(4);
			
			return (percentage * 100).toFixed(2) + "%";
		}
		
		function calculateGrams(birdBalance, feeds) {
			var weight = 50;
			if(birdBalance == 0) {
				return 0
			} else {
				return ((feeds * weight) / birdBalance).toFixed(3); 
			}
		}
	}
})();