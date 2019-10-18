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
			vm.editing = true;
			vm.eggProd = {beginningBirdBalance:12623};
			
			getHouseOptions();
			
			vm.eggsProdData = [
				{house:1, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:2, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:3, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:4, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:5, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:6, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:7, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:8, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:9, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:10, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:11, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}, 
				{house:12, mortality: 0, cull: 0, feeds: null, eggsProduced: null, endingBirdBalance: null, beginningBirdBalance: null}
			];
			
			vm.eggsProdTableDefn = [
				{
					name: "house",
					attributes: {},
					label: "House"
					
				},
				{
					name: "eggsProduced",
					attributes: {},
					label: "Eggs Produced"
					
				},
				{
					name: "birdBalBeg",
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
					name: "birdBalEnd",
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
			vm.houseOptions = layersService.getHouseOptions();
		}
		
		function editEggsProd(index) {
			vm.editing = true;
			vm.eggProd = {};
			vm.eggProd = vm.eggsProdData[index];
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
			//TODO 
			vm.editing = false;
		}
		
		function back() {
			vm.editing = false;
		}
	}
})();