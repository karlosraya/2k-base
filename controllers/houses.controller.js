(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('HousesCtrl', HousesCtrl);

	HousesCtrl.$inject = ['layersService'];

	function HousesCtrl(layersService) {
		var vm = this;
		
		vm.$onInit = init();
		
		vm.addHouse = addHouse;
		
		function init() {
			vm.houses = getHouses();
			
			vm.houseTableDefn = [
				{
					name: "name",
					attributes: {},
					label: "House"
					
				},
				{
					name: "head",
					attributes: {},
					label: "Farm Head"
					
				},
				{
					name: "batch",
					attributes: {},
					label: "Batch"
					
				},
				{
					name: "birdBalance",
					attributes: {},
					label: "Bird Balance"
					
				},
				{
					name: "lastUpdateBy",
					attributes: {},
					label: "Last Updated By"
					
				},
				{
					name: "lastUpdateTS",
					attributes: {},
					label: "Last Update Date"
					
				},
				{
					attributes: {},
					isButton: true,
					buttonLabel: "Edit",
					buttonAction: editHouseInfo
				},
				{
					attributes: {},
					isButton: true,
					buttonLabel: "Remove",
					buttonAction: removeHouse
				}
			];
		}
		
		function getHouses() {
			return layersService.getHouses();
		}
		
		function addHouse() {
			
		}
		
		function removeHouse() {
			
		}
		
		function editHouseInfo() {
			
		}
		
		
	}
})();