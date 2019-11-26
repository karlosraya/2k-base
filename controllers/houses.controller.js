(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('HousesCtrl', HousesCtrl);

	HousesCtrl.$inject = ['$state', '$filter', 'houseService', 'batchService', 'toasterService'];

	function HousesCtrl($state, $filter, houseService, batchService, toasterService) {
		var vm = this;
		
		vm.loading = false;
		vm.editingHouse = false;
		vm.addingHouse = false;

		vm.houses = [];
		vm.houseInfo = {};

		vm.$onInit = init();
		
		vm.addHouse = addHouse;
		vm.back = back;
		vm.verifyFields = verifyFields;

		function init() {
			getHouses();
			
			vm.houseTableDefn = [
				{
					name: "name",
					label: "House"
				},
				{
					name: "stockman",
					label: "Stockman"
				},
				{
					name: "currentBatch",
					label: "Current Batch",
					isLink: true,
					default: "Start New Batch",
					linkAction: viewBatch
				},
				{
					name: "lastInsertUpdateBy",
					label: "Last Updated By"
				},
				{
					name: "lastInsertUpdateTS",
					label: "Last Update Date",
					filter: "dateFormat"
				},
				{
					isButton: true,
					buttonLabel: "Edit",
					buttonAction: editHouse
				}
			];
		}
		
		function getHouses() {
			vm.loading = true;
			houseService.getHouses()
			.then(function(houses) {
				getActiveBatches(houses); 
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function getActiveBatches(houses) {
			batchService.getActiveBatches()
			.then(function(batches) {
				setHouseBatch(houses, batches);
				vm.loading = false;
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function setHouseBatch(houses, batches) {
			if(houses && houses.length > 0) {
				houses.forEach(function(house) {
					if(batches && batches.length > 0) {
						batches.forEach(function (batch) {
							if(house.id == batch.houseId) {
								house.currentBatch = batch.batch;
								house.batch = batch;
							}
						});
					}
				});
			}
			vm.houses = houses;
		}
		
		function addHouse() {
			vm.addingHouse = true;
			vm.houseInfo = {};
		}
		
		function back() {
			vm.editingHouse = false;
			vm.addingHouse = false;
		}
		
		function editHouse(index) {
			vm.editingHouse = true;
			vm.houseInfo = angular.copy(vm.houses[index]);
		}
		
		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else {
				if(vm.addingHouse) {
					submitNewHouse();
				} else if(vm.editingHouse) {
					submitEditedHouse();
				} else {
					toasterService.error("Error", "The application has encountered an unknown error!");
				}
			}
		}
		
		function submitNewHouse() {
			vm.loading = true;
			vm.houseInfo.lastInsertUpdateBy = "Antonio Raya";
			vm.houseInfo.lastInsertUpdateTS =  $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss');
			
			houseService.addHouse(vm.houseInfo)
			.then(function(response) {
				vm.loading = false;
				vm.addingHouse = false;
				getHouses();
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function submitEditedHouse() {
			vm.loading = true;
			vm.houseInfo.lastInsertUpdateBy = "Antonio Raya";
			vm.houseInfo.lastInsertUpdateTS = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss');

			houseService.updateHouse(vm.houseInfo.id, vm.houseInfo)
			.then(function(response) {
				vm.loading = false;
				vm.editingHouse = false;
				getHouses();
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function viewBatch(index) {
			$state.go("main.batch", {house: vm.houses[index]});
		}
	}
})();