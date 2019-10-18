(function () {
	angular
		.module('2kApp')
		.factory('layersService', layersService);

	layersService.$inject = ['$http', '$log', '$q', '$filter'];

	function layersService($http, $log, $q, $filter) {

		var houses = [
			{houseId: 1, name: "HSE 1", head: "JOMAR CATAMORA", batch: "21TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"},
			{houseId: 2, name: "HSE 2", head: "NICOLAS ABELLA", batch: "20TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"},
			{houseId: 3, name: "HSE 3", head: "NICOLAS ABELLA", batch: "20TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"},
			{houseId: 4, name: "HSE 4", head: "REGIE ASI", batch: "20TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"},
			{houseId: 5, name: "HSE 5", head: "REGIE ASI", batch: "20TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"},
			{houseId: 6, name: "HSE 6", head: "RENATO BANO", batch: "20TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"},
			{houseId: 7, name: "HSE 7", head: "RENATO BANO", batch: "20TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"},
			{houseId: 8, name: "HSE 8", head: "JESSIE LIQUE", batch: "18TH-19TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"},
			{houseId: 9, name: "HSE 9", head: "JESSIE LIQUE", batch: "20TH BATCH", lastUpdateBy: "Antonio Raya", lastUpdateTS: "10/17/2019"}
		];
		
		var reports = {
				1: [
					{date: "7/13/2018", age: 17, feeds: 38, eggProduction: 150, cull: null, mortality: 2, birdBalance: 30244},
					{date: "7/14/2018", feeds: 39, eggProduction: 90, cull: null, mortality: null},
					{date: "7/15/2018", feeds: 39, eggProduction: 120, cull: null, mortality: null},
					{date: "7/16/2018", feeds: 40, eggProduction: 150, cull: null, mortality: 2},
					{date: "7/17/2018", feeds: 44, eggProduction: 210, cull: null, mortality: 3},
					{date: "7/18/2018", feeds: 44, eggProduction: 270, cull: null, mortality: 2},
					{date: "7/19/2018", feeds: 44, eggProduction: 390, cull: null, mortality: null},
					{date: "7/20/2018", feeds: 44, eggProduction: 510, cull: null, mortality: 2}
				],
				2: [
					
				],
				3: [
					
				],
				4: [
					
				],
				5: [
					
				],
				6: [
					
				],
				7: [
					
				],
				8: [
					
				],
				9: [
					
				]
		}
		
		var service = {
			getHouses: getHouses,
			getHouseInfo: getHouseInfo,
			setHouseInfo: setHouseInfo,
			getHouseOptions: getHouseOptions,
			getHouseReport: getHouseReport,
			getEggProd: getEggProd,
			addEggProd: addEggProd
		};

		return service;
		
		function getHouses() {
			return houses;
		}
		
		function getHouseInfo(houseId) {
			var house = $filter('filter')(houses, {houseId: parseInt(houseId)});
			return house[0];
		}
		
		function setHouseInfo(houseId, houseInfo) {
			console.log(true);
		}
		
		function getHouseOptions() {
			var houseOptions = {};
			
			houses.forEach(function(house) {
				houseOptions[house.houseId] = house.name;
			});
			
			return houseOptions;
		}
		
		function getHouseReport(houseId) {
			return reports[parseInt(houseId)];
		}
		
		function getEggProd() {
			
		}
		
		function addEggProd() {
			
		}
		/*function getHouses() {
			return $http.post(baseUrl)
			.then(successCallback, errorCallback);

	        function successCallback(appeals) {
	            $log.info('INFO: getHouses - Success: ', appeals);
	            return appeals.data;
	        }
	
	        function errorCallback(error) {
	            $log.error('ERROR: getHouses - Error: ', error);
	            return $q.reject(error);
	        }
		}*/
		
	}
})();