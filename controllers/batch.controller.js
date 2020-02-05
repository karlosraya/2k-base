(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('BatchCtrl', BatchCtrl);

		BatchCtrl.$inject = ['$state', '$stateParams', '$filter', '$timeout', 'appService', 'batchService', 'houseService', 'alertService', 'toasterService', 'exceptionService'];

	function BatchCtrl($state, $stateParams, $filter, $timeout, appService, batchService, houseService, alertService, toasterService, exceptionService) {
		var vm = this;

		vm.loading = true;
		vm.hasActiveBatch = false;
		vm.editingPermission = false;
		vm.house = null;

		vm.editingRoles = ['administrator', 'editBatch'];
		vm.archivedBatches = [];
		vm.archivedBatchesCopy = [];
		vm.startBatchForm = {};
		vm.houseOptions = {};
		vm.batch = {};

		vm.$onInit = init();
		
		vm.selectHouse = selectHouse;
		vm.verifyFields = verifyFields;
		vm.completeBatch = completeBatch;
		vm.viewBatch = viewBatch;

		function init() {
			vm.houseId = $stateParams.houseId;

			if(vm.houseId) {
				vm.house = {};
				vm.house.id = vm.houseId;

				selectHouse(true);
			}
			
			getHouses();
			
			vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
		}

		function getHouses() {
			vm.loading = true;
			houseService.getHouses()
			.then(function(houses) {
				vm.houseOptions = houses;
				vm.loading = false;
			})
			.catch(function(error){
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}

		function selectHouse(disableToaster) {
			$timeout(function() {
				vm.loading = true;
				vm.startBatchForm.$submitted = false;
				vm.startBatchForm.$setUntouched();
				vm.startBatchForm.$setPristine();

				batchService.getActiveBatchByHouseId(vm.house.id)
				.then(function(response) {
					if(response) {
						vm.hasActiveBatch = true;
						vm.batch = response;
						vm.batch.startDate = new Date(response.startDate);
					} else {
						if(!disableToaster) {
							toasterService.info("Info", "No active batch found!");
						}
						vm.hasActiveBatch = false;
						vm.batch = {};
					}
				})
				.catch(function(error) {
					exceptionService.catcher(error);
					vm.loading = false;
				});

				getArchivedBatches();
			});
		}

		function getArchivedBatches() {
			batchService.getBatchesByHouseId(vm.house.id)
				.then(function(response) {
					vm.archivedBatches = response;

					vm.archivedBatchesCopy = angular.copy(response);
					vm.loading = false;
				})
				.catch(function(error) {
					exceptionService.catcher(error);
					vm.loading = false;
				});
		}

		function viewBatch(batchId) {
			$state.go("main.historical-reports", {batchId: batchId})
		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else {
				if(vm.hasActiveBatch) {
					editCurrentBatch();
				} else {
					startNewBatch();
				}
			}
		}

		function startNewBatch() {
			vm.loading = true;

			var request = angular.copy(vm.batch);

			request.houseId = vm.house.id;
			request.startDate = $filter('date')(vm.batch.startDate, 'yyyy-MM-dd');

			batchService.startBatch(request)
			.then(function(response) {
				toasterService.success("Success", "A new batch was started successfully!");
				selectHouse();
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function editCurrentBatch() {
			vm.loading = true;

			var request = angular.copy(vm.batch);
			request.startDate = $filter('date')(vm.batch.startDate, 'yyyy-MM-dd');

			batchService.editBatch(vm.batch.id, request)
			.then(function(response) {
				toasterService.success("Success", "The batch was updated successfully!");
				getArchivedBatches();
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function completeBatch() {
			var completeBatchAlertObject = {
			  	type: "warning",
				title: 'Complete Batch',
  				text: "Once you complete batch you can no longer update batch records.",
  				showCancelButton: true,
  				confirmButtonText: 'Complete'
			};

			var completeBatchAlertAction = function (result) {
				if(result.value) {
					vm.loading = true;
					var request = {};
					request.endDate = $filter('date')(new Date(), 'yyyy-MM-dd');

					batchService.endBatch(vm.batch.id, request)
					.then(function(response) {
						toasterService.success("Success", "The batch was completed!");
						selectHouse(true);
					})
					.catch(function(error) {
						exceptionService.catcher(error);
						vm.loading = false;
					});
				}
			};

			alertService.custom(completeBatchAlertObject, completeBatchAlertAction);
		}
	}
})();