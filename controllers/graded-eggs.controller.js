(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('GradedEggsCtrl', GradedEggsCtrl);

	GradedEggsCtrl.$inject = ['$state', '$filter', '$timeout', 'gradedEggsService', 'exceptionService', 'toasterService'];

	function GradedEggsCtrl($state, $filter, $timeout, gradedEggsService, exceptionService, toasterService) {
		var vm = this;

		vm.loading = false;
		vm.editingGradedEggs = false;
		vm.gradedEggsDate = new Date();
		vm.eggTypes = [
			{header: 'PWW', key: 'pww'}, 
			{header: 'PW', key: 'pw'}, 
			{header: 'Pullets', key: 'pullets'}, 
			{header: 'Small', key: 'small'}, 
			{header: 'Medium', key: 'medium'}, 
			{header: 'Large', key: 'large'}, 
			{header: 'Extra Large', key: 'extraLarge'}, 
			{header: 'Jumbo', key: 'jumbo'}, 
			{header: 'Crack', key: 'crack'}, 
			{header: 'Spoiled', key: 'spoiled'}];

		vm.$onInit = init();

		vm.getTotal = getTotal;
		vm.editGradedEggs = editGradedEggs;
		vm.verifyFields = verifyFields;
		vm.back = back;
		vm.selectDate = selectDate;

		function init() {
			getGradedEggsByDate();
		}

		function selectDate() {
			$timeout(function() {
				getGradedEggsByDate();
			});
		}

		function getGradedEggsByDate(toaster, added) {
			vm.loading = true;
			var requestDate = $filter('date')(vm.gradedEggsDate, 'yyyy-MM-dd');

			gradedEggsService.getGradedEggsyByDate(requestDate)
			.then(function(response) {
				vm.loading = false;
				vm.gradedEggsProd = response.gradedEggsProduction;
				vm.gradedEggsBeginning = response.gradedEggsTotal;
				vm.editingGradedEggs = false;
				if(toaster) {
					toasterService.success("Success", "Graded Eggs information updated successfully");
				}
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}

		function getTotal(gradedEggs) {
			var total = 0;
			if(gradedEggs) {
				vm.eggTypes.forEach(function(eggType) {
					total += gradedEggs[eggType.key] ? gradedEggs[eggType.key] : 0;
				});
				return total;
			} else {
				return null;
			}

		}

		function editGradedEggs(form) {
			form.$submitted = false;
			form.$setUntouched();
			form.$setPristine();
			vm.editingGradedEggs = true;
		}

		function back() {
			vm.editingGradedEggs = false;
		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(form.$pristine) {
				toasterService.warning("warning", "No changes were made to the fields!");
			} else {
				submitGradedEggs();
			}
		}

		function submitGradedEggs() {
			vm.loading = true;
			var request = angular.copy(vm.gradedEggsProd);
			request.lastInsertUpdateBy = "Antonio Raya";
			request.inputDate = $filter('date')(vm.gradedEggsDate, 'yyyy-MM-dd');

			gradedEggsService.createUpdateGradedEggs(request)
			.then(function(response) {
				getGradedEggsByDate(true); 
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}
	}
})();