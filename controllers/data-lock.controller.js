(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('DataLockCtrl', DataLockCtrl);

	DataLockCtrl.$inject = ['$filter', 'dataLockService', 'exceptionService', 'alertService', 'toasterService'];

	function DataLockCtrl($filter, dataLockService, exceptionService, alertService, toasterService) {
		var vm = this;
		
		vm.loading = false;
		vm.displayDate = false;
		vm.lockDate = null;
		vm.latestDate = null;
		
		vm.$onInit = init();

		vm.verifyFields = verifyFields;
		
		function init() {
			getLatestLockedDate()
		}
		
		function getLatestLockedDate() {
			vm.loading = true;
			dataLockService.getLatestLockedDate()
			.then(function(response) {
				vm.lockDate = new Date(response.lockDate);
				vm.latestDate = new Date(response.lockDate);
				vm.minDate = new Date(response.lockDate).setDate(vm.lockDate.getDate() + 1);
				
				vm.loading = false;
				vm.displayDate = true;
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}
		
		function verifyFields(form) {
			if(vm.lockDate <= vm.latestDate) {
				toasterService.error("Error", "Data lock is already enforced up to " + $filter('dateFormat')(vm.latestDate) + "!");
			} else if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else {
				dataLockAlert();
			}
		}
		
		function dataLockAlert() {
			var dataLockAlertObject = {
				  	type: "warning",
					title: 'Confirm Data Lock',
	  				text: "Are you sure you no longer want to edit data up to " + $filter('dateFormat')(vm.lockDate) + 
	  					  "? This action is irreversible.",
	  				showCancelButton: true,
	  				confirmButtonText: 'Yes'
				};

				var dataLockAlertAction = function (result) {
					if(result.value) {
						dataLock();
					}
				};

				alertService.custom(dataLockAlertObject, dataLockAlertAction);
		}
		
		function dataLock() {
			var formattedLockDate = $filter('date')(new Date(vm.lockDate), 'yyyy-MM-dd');
			vm.loading = true;
			dataLockService.lockData(formattedLockDate)
			.then(function(response) {
				vm.lockDate = new Date(response.lockDate);
				vm.latestDate = new Date(response.lockDate);
				vm.minDate = new Date(response.lockDate).setDate(vm.lockDate.getDate() + 1);
				toasterService.success("Success", "Data successfully locked. You can no longer edit data up to " + $filter('dateFormat')(vm.lockDate)) + ".";
				vm.loading = false;
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}
	}
})();