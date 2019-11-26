(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('BatchCtrl', BatchCtrl);

		BatchCtrl.$inject = ['$state', '$stateParams', '$filter', '$timeout', 'batchService', 'houseService', 'alertService', 'toasterService', 'exceptionService'];

	function BatchCtrl($state, $stateParams, $filter, $timeout, batchService, houseService, alertService, toasterService, exceptionService) {
		var vm = this;

		vm.loading = true;
		vm.hasActiveBatch = false;
		vm.house = null;
		vm.archivedBatches = [];
		vm.startBatchForm = {};
		vm.houseOptions = {};
		vm.batch = {};

		vm.$onInit = init();
		
		vm.selectHouse = selectHouse;
		vm.verifyFields = verifyFields;
		vm.completeBatch = completeBatch;

		function init() {
			vm.house = $stateParams.house;
			if(vm.house) {
				vm.house.id = vm.house.id + "";
				vm.batch = vm.house.batch;

				if(vm.batch) {
					vm.batch.startDate = new Date(vm.batch.lastInsertUpdateTS);
					vm.hasActiveBatch = true;
				} else {
					vm.hasActiveBatch = false;
				}
			}
			getHouses();

			vm.batchTableDefn = [
				{
					name: "batch",
					attributes: {},
					label: "Batch",
					isLink: true,
					linkAction: viewBatch
				},
				{
					name: "startAge",
					attributes: {},
					label: "Start Age"
				},
				{
					name: "initialBirdBalance",
					attributes: {},
					label: "Initial Bird Balance"
				},
				{
					name: "startDate",
					attributes: {},
					label: "Start Date",
					filter: "dateFormat"
				},
				{
					name: "endDate",
					attributes: {},
					label: "End Date",
					filter: "dateFormat"
				},
				{
					name: "lastInsertUpdateBy",
					attributes: {},
					label: "Last Updated By"
				},
				{
					name: "lastInsertUpdateTS",
					attributes: {},
					label: "Last Update Date",
					filter: "dateFormat"
				}
			];
		}

		function getHouses() {
			vm.loading = true;
			houseService.getHouses()
			.then(function(houses) {
				if(houses && houses.length > 0) {
					houses.forEach(function(house) {
						vm.houseOptions[house.id] = house.name;
					});
				}
				vm.loading = false;
			})
			.catch(function(error){
				vm.loading = false;
				exceptionService.catcher(catcher);
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
					if(angular.equals(response, {})) {
						if(!disableToaster) {
							toasterService.info("Info", "No active batch found!");
						}
						vm.hasActiveBatch = false;
						vm.batch = {};
					} else {
						vm.hasActiveBatch = true;
						vm.batch = response;
						vm.batch.startDate = new Date(response.startDate);
					}
				})
				.catch(function(error) {
					exceptionService.catcher(catcher);
					vm.loading = false;
				});

				getArchivedBatches();
			});
		}

		function getArchivedBatches() {
			batchService.getBatchesByHouseId(vm.house.id)
				.then(function(response) {
					vm.archivedBatches = response;
					vm.loading = false;
				})
				.catch(function(error) {
					exceptionService.catcher(catcher);
					vm.loading = false;
				});
		}

		function viewBatch() {

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
			request.lastInsertUpdateBy = "Antonio Raya";
			request.startDate = $filter('date')(vm.batch.startDate, 'yyyy-MM-dd');

			batchService.startBatch(request)
			.then(function(response) {
				toasterService.success("Success", "A new batch was started successfully!");
				selectHouse();
			})
			.catch(function(error) {
				exceptionService.catcher(catcher);
				vm.loading = false;
			});
		}

		function editCurrentBatch() {
			vm.loading = true;

			var request = angular.copy(vm.batch);

			request.lastInsertUpdateBy = "Antonio Raya";
			request.startDate = $filter('date')(vm.batch.startDate, 'yyyy-MM-dd');

			batchService.editBatch(vm.batch.id, request)
			.then(function(response) {
				toasterService.success("Success", "The batch was updated successfully!");
				getArchivedBatches();
			})
			.catch(function(error) {
				exceptionService.catcher(catcher);
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
					request.lastInsertUpdateBy = "Antonio Raya";

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