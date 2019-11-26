(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('GradedEggsCtrl', GradedEggsCtrl);

	GradedEggsCtrl.$inject = ['$state', '$timeout'];

	function GradedEggsCtrl($state, $timeout) {
		var vm = this;

		vm.editingGradedEggs = false;

		vm.$onInit = init();

		vm.getTotal = getTotal;
		vm.editGradedEggs = editGradedEggs;
		vm.submitGradedEggs = submitGradedEggs;

		function init() {
			vm.gradedEggsProd = {
				pww: 2,
				pw: 10,
				pullets: 55,
				small: 47,
				medium: 93,
				large: 111,
				extraLarge: 135,
				jumbo: 68,
				crack: 33,
				spoiled: 12
			};

			vm.gradedEggsBeginning = {
				pww: 15,
				pw: 25,
				pullets: 31,
				small: 39,
				medium: 66,
				large: 125,
				extraLarge: 219,
				jumbo: 92,
				crack: 198,
				spoiled: 215
			};
		}

		function getTotal(gradedEggs) {
			var keys = Object.keys(gradedEggs);
			var total = 0;
			keys.forEach(function(key) {
				total += gradedEggs[key];
			});

			return total;
		}

		function editGradedEggs() {
			vm.editingGradedEggs = !vm.editingGradedEggs;
			$timeout(function() {
				var prod1 = $('#prod1');
				prod1.focus();
			})
		}

		function submitGradedEggs() {
			vm.editingGradedEggs = !vm.editingGradedEggs;

			$state.reload();
		}
	}
})();