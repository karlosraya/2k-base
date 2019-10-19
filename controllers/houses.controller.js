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
		vm.verifyFields = verifyFields;

		function init() {
			vm.houseInfo = {};
			vm.report = {};
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
					buttonAction: editHouse
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
			vm.addingHouse = true;
		}
		
		function removeHouse(index) {
			
		}
		
		function editHouse(index) {
			vm.editingHouse = true;
			vm.houseInfo = vm.houses[index];
		}
		
		function verifyFields(form) {
			if(form.$invalid) {
				alert("Please complete form!");
			} else {
				updateHouse();
			}
		}
		
		function updateHouse() {
			vm.editingHouse = false;
			vm.addingHouse = false;

			layersService.addHouse(vm.houseInfo, vm.report);

			vm.houses = getHouses();
		}
	}
})();