(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('SalesCtrl', SalesCtrl);

	SalesCtrl.$inject = [];

	function SalesCtrl() {
		var vm = this;
		
		vm.addingSale = false;

		vm.$onInit = init();

		vm.getTotal = getTotal;
		vm.getTotalOut = getTotalOut;
		vm.addSale = addSale;
		vm.submitSale = submitSale;

		function init() {
			vm.eggSizes = ["pww", "pw", "pullets", "small", "medium", "large", "extraLarge", "jumbo", "crack", "spoiled"];

			vm.customersList = {
				1: "Customer 1",
				2: "Customer 2",
				3: "Customer 3",
				4: "Customer 4"
			};

			vm.available = {
				pww: 17,
				pw: 35,
				pullets: 86,
				small: 86,
				medium: 159,
				large: 236,
				extraLarge: 354,
				jumbo: 160,
				crack: 231,
				spoiled: 227
			};

			vm.customers = [
				{
					customerId: 1,
					name: "Customer 1",
					pww: 0,
					pw: 0,
					pullets: 0,
					small: 0,
					medium: 80,
					large: 80,
					extraLarge: 120,
					jumbo: 120,
					crack: 0,
					spoiled: 0
				},
				{
					customerId: 2,
					name: "Customer 2",
					pww: 10,
					pw: 30,
					pullets: 80,
					small: 80,
					medium: 0,
					large: 0,
					extraLarge: 0,
					jumbo: 0,
					crack: 0,
					spoiled: 0
				},
				{
					customerId: 3,
					name: "Customer 3",
					pww: 0,
					pw: 0,
					pullets: 0,
					small: 0,
					medium: 0,
					large: 0,
					extraLarge: 100,
					jumbo: 0,
					crack: 0,
					spoiled: 0
				}
			]
		}

		function getTotal(eggs) {
			if(eggs) {
				var keys = Object.keys(eggs);
				var total = 0;

				keys.forEach(function(key) {
					if(vm.eggSizes.indexOf(key) > -1) {
						total += eggs[key];
					}
				});
				return total;
			} else {
				return 0;
			}
		}

		function getTotalOut(eggSize) {
			var total = 0;
			if(eggSize == "all") {
				vm.eggSizes.forEach(function(size) {
					total += sumByProperty(vm.customers, size);
				});
				return total;
			} else {
				return sumByProperty(vm.customers, eggSize);
			}
		}

		function sumByProperty(items, prop) {
			return items.reduce( function(a, b){
				return a + b[prop];
			}, 0);
		}

		function addSale() {
			vm.addingSale = true;
		}

		function submitSale() {

			vm.addingSale = false;
		}
	}
})();