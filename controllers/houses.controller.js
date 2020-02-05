(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('HousesCtrl', HousesCtrl);

	HousesCtrl.$inject = ['$state', '$filter', 'appService', 'houseService', 'toasterService', 'exceptionService'];

	function HousesCtrl($state, $filter, appService, houseService, toasterService, exceptionService) {
		var vm = this;
		
		vm.loading = false;
		vm.editingHouse = false;
		vm.addingHouse = false;
		vm.editingPermission = false;

		vm.editingRoles = ['administrator', 'editHouse'];
		vm.houses = [];
		vm.housesCopy = [];
		vm.houseInfo = {};

		vm.$onInit = init();
		
		vm.editHouse = editHouse;
		vm.viewBatch = viewBatch;
		vm.addHouse = addHouse;
		vm.back = back;
		vm.verifyFields = verifyFields;

		function init() {
			getHouses();
			vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
		}
		
		function getHouses() {
			vm.loading = true;
			houseService.getHouses()
			.then(function(houses) {
				vm.houses = houses;
				vm.housesCopy = [].concat(houses);
				vm.loading = false;
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function addHouse() {
			vm.addingHouse = true;
			vm.houseInfo = {};
		}
		
		function back() {
			vm.editingHouse = false;
			vm.addingHouse = false;
		}
		
		function editHouse(house) {
			vm.editingHouse = true;
			vm.houseInfo = angular.copy(house);
		}
		
		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else {
				if(vm.addingHouse) {
					submitHouse(true);
				} else if(vm.editingHouse) {
					submitHouse(false);
				} else {
					toasterService.error("Error", "The application has encountered an unknown error!");
				}
			}
		}
		
		function submitHouse(newHouse) {
			vm.loading = true;
			
			houseService.createUpdateHouse(vm.houseInfo)
			.then(function(response) {
				vm.loading = false;
				vm.addingHouse = false;
				vm.editingHouse = false;
				if(newHouse) {
					toasterService.success("Success", "House information successfully added!");
				} else {
					toasterService.success("Success", "House information successfully updated!");
				}
				getHouses();
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function viewBatch(house) {
			$state.go("main.batch", {houseId: house.id});
		}
	}
})();