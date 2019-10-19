(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('EggsProductionCtrl', EggsProductionCtrl);

	EggsProductionCtrl.$inject = ['$timeout', 'appService', 'layersService'];

	function EggsProductionCtrl($timeout, appService, layersService) {
		var vm = this;
		
		vm.$onInit = init();
		
		vm.verifyFields = verifyFields;
		vm.submitEggsProd = submitEggsProd;
		vm.computeEndingBirdBalance = computeEndingBirdBalance;
		vm.back = back;
		
		function init() {
			vm.editing = false;
			vm.houseOptions = getHouseOptions();
			vm.eggsProdData = getEggProductionData(); 


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
					name: "eggsProduced",
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
		
		function getHouseOptions() {
			return layersService.getHouseOptions();
		}
		
		function getEggProductionData() {
			return layersService.getEggProdData();
		}

		function getCurrentEggProductionByDate(index) {
			return layersService.getEggProdDataByDate(index, new Date());
		}

		function editEggsProd(index) {
			vm.editing = true;

			vm.eggProd = angular.copy(vm.eggsProdData[index]);
			vm.eggProd.date = new Date();

			var currentData = getCurrentEggProductionByDate(vm.eggsProdData[index].houseId);
			if(currentData) {
				vm.eggProd.eggsProduced = currentData.eggProduction;
				vm.eggProd.feeds = currentData.feeds;
				vm.eggProd.mortality = currentData.mortality;
				vm.eggProd.cull = currentData.cull;
				vm.eggProd.endingBirdBalance = vm.eggProd.beginningBirdBalance - vm.eggProd.cull - vm.eggProd.mortality;
			} 
		}
		
		function computeEndingBirdBalance() {
			$timeout(function() {
				var cull = vm.eggProd.cull ? vm.eggProd.cull : 0;
				var mortality = vm.eggProd.mortality ? vm.eggProd.mortality : 0;
				vm.eggProd.endingBirdBalance = vm.eggProd.beginningBirdBalance - cull - mortality;
			});
		}
		
		function verifyFields(form) {
			if(form.$invalid) {
				alert("Please complete form!");
			} else {
				submitEggsProd();
			}
		}
		
		function submitEggsProd() {
			layersService.insertEggProdData(vm.eggProd);
			vm.eggsProdData = getEggProductionData(); 
			vm.editing = false;
		}
		
		function back() {
			vm.editing = false;
		}
	}
})();