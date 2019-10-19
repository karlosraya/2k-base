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
					{date: "07/13/2018", age: 17, feeds: 38, eggProduction: 150, cull: null, mortality: 2, birdBalance: 30244},
					{date: "07/14/2018", feeds: 39, eggProduction: 90, cull: null, mortality: null},
					{date: "07/15/2018", feeds: 39, eggProduction: 120, cull: null, mortality: null},
					{date: "07/16/2018", feeds: 40, eggProduction: 150, cull: null, mortality: 2},
					{date: "07/17/2018", feeds: 44, eggProduction: 210, cull: null, mortality: 3},
					{date: "07/18/2018", feeds: 44, eggProduction: 270, cull: null, mortality: 2},
					{date: "07/19/2018", feeds: 44, eggProduction: 390, cull: null, mortality: null},
					{date: "07/20/2018", feeds: 44, eggProduction: 510, cull: null, mortality: 2}
				],
				2: [
					{date: "10/03/2019", age: 18, feeds: 38, eggProduction: 112, cull: null, mortality: 2, birdBalance: 32154},
					{date: "10/04/2019", feeds: 38, eggProduction: 126, cull: 5, mortality: null},
					{date: "10/05/2019", feeds: 39, eggProduction: 141, cull: null, mortality: null},
					{date: "10/06/2019", feeds: 39, eggProduction: 166, cull: null, mortality: null},
					{date: "10/07/2019", feeds: 40, eggProduction: 153, cull: null, mortality: 2},
					{date: "10/08/2019", feeds: 44, eggProduction: 215, cull: null, mortality: 6},
					{date: "10/09/2019", feeds: 44, eggProduction: 278, cull: null, mortality: 2},
					{date: "10/10/2019", feeds: 44, eggProduction: 391, cull: null, mortality: null},
					{date: "10/11/2019", feeds: 44, eggProduction: 502, cull: null, mortality: 2},
					{date: "10/12/2019", feeds: 45, eggProduction: 524, cull: null, mortality: null},
					{date: "10/13/2019", feeds: 45, eggProduction: 560, cull: null, mortality: null},
					{date: "10/14/2019", feeds: 46, eggProduction: 591, cull: 20, mortality: 2},
					{date: "10/15/2019", feeds: 46, eggProduction: 622, cull: 30, mortality: 3},
					{date: "10/16/2019", feeds: 47, eggProduction: 662, cull: null, mortality: 5},
					{date: "10/17/2019", feeds: 47, eggProduction: 713, cull: 20, mortality: null},
					{date: "10/18/2019", feeds: 48, eggProduction: 751, cull: null, mortality: 2},
					{date: "10/19/2019", feeds: 49, eggProduction: 800, cull: 2, mortality: 5}
				],
				3: [
					{date: "10/03/2019", age: 14, feeds: 25, eggProduction: 51, cull: null, mortality: 2, birdBalance: 15955},
					{date: "10/04/2019", feeds: 25, eggProduction: 50, cull: null, mortality: 3},
					{date: "10/05/2019", feeds: 25, eggProduction: 66, cull: null, mortality: null},
					{date: "10/06/2019", feeds: 25, eggProduction: 79, cull: null, mortality: null},
					{date: "10/07/2019", feeds: 26, eggProduction: 101, cull: null, mortality: 2},
					{date: "10/08/2019", feeds: 26, eggProduction: 95, cull: null, mortality: 6},
					{date: "10/09/2019", feeds: 26, eggProduction: 142, cull: null, mortality: 2},
					{date: "10/10/2019", feeds: 27, eggProduction: 181, cull: null, mortality: null},
					{date: "10/11/2019", feeds: 27, eggProduction: 214, cull: null, mortality: 2},
					{date: "10/12/2019", feeds: 27, eggProduction: 190, cull: null, mortality: null},
					{date: "10/13/2019", feeds: 27, eggProduction: 216, cull: null, mortality: null},
					{date: "10/14/2019", feeds: 27, eggProduction: 240, cull: null, mortality: 2},
					{date: "10/15/2019", feeds: 28, eggProduction: 264, cull: null, mortality: 10},
					{date: "10/16/2019", feeds: 28, eggProduction: 301, cull: null, mortality: 12},
					{date: "10/17/2019", feeds: 28, eggProduction: 359, cull: 10, mortality: null},
					{date: "10/18/2019", feeds: 28, eggProduction: 391, cull: null, mortality: 4}
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
			getEggProdData: getEggProdData,
			getEggProdDataByDate: getEggProdDataByDate,
			insertEggProdData: insertEggProdData,
			compareDate: compareDate
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
			return angular.copy(reports[parseInt(houseId)]);
		}
		
		function getEggProdData() {
			var eggProdData = [];;

			var currentDate = new Date().setHours(0,0,0,0);

			houses.forEach(function(house) {
				var data = {};
				data.houseId = house.houseId + "";
				data.houseName = house.name;
				var houseReport = reports[house.houseId];

				var birdBalance = null
				var previousRecord = null;

				houseReport.forEach(function(report, index) {
					var reportDate = new Date(report.date).setHours(0,0,0,0);

					if(compareDate(reportDate, currentDate) < 0) {
						if(!report.birdBalance) {
							birdBalance = previousRecord.birdBalance - report.cull - report.mortality;
						} else {
							birdBalance = report.birdBalance;
						}
						data.beginningBirdBalance = birdBalance;
					} else if(compareDate(reportDate, currentDate) == 0) {
						data.beginningBirdBalance = birdBalance;
						data.endingBirdBalance = previousRecord.birdBalance - report.cull - report.mortality;
						data.cull =  report.cull;
						data.mortality = report.mortality;
						data.feeds = report.feeds;
						data.eggsProduced = report.eggProduction;
					}
					var reportCopy = angular.copy(report);
					reportCopy.birdBalance = birdBalance;
					previousRecord = reportCopy;
				});
				eggProdData.push(data);
			});

			return angular.copy(eggProdData);
		}
		
		function getEggProdDataByDate(houseId, date) {
			var inputDate = date.setHours(0,0,0,0);
			var houseReport = reports[houseId];

			var rep = null;
			houseReport.forEach(function(report) {
				var reportDate = new Date(report.date).setHours(0,0,0,0);
				if(compareDate(reportDate, inputDate) == 0) {
					rep = report;
				}
			});

			return rep;
		}

		function insertEggProdData(data) {
			console.log(data);
			var checkExisting = false;
			reports[data.houseId].forEach(function(report) {
				var reportDate = new Date(report.date).setHours(0,0,0,0);
				var dataDate = new Date(data.date).setHours(0,0,0,0);

				if(compareDate(reportDate, dataDate) == 0) {
					checkExisting = true;
					report.eggProduction = data.eggsProduced;
					report.feeds = data.feeds;
					report.cull = data.cull;
					report.mortality = data.mortality;
				}
			});

			if(!checkExisting) {
				var newData = {};
				newData.date = stringifyDate(data.date);
				newData.eggProduction = data.eggsProduced;
				newData.feeds = data.feeds ? data.feeds : null;
				newData.cull = data.cull ? data.cull : null;
				newData.mortality = data.mortality;
				reports[data.houseId].push(newData);
			}
		}

		function stringifyDate(date) {
			return $filter('date')(date, "MM/dd/yyyy");
		}

		function compareDate(dateA, dateB) {
			return (
	            isFinite(dateA=convert(dateA).valueOf()) &&
	            isFinite(dateB=convert(dateB).valueOf()) ?
	            (dateA>dateB)-(dateA<dateB) :
	            NaN
	        );
		}

		function convert(d) {
			return (
	            d.constructor === Date ? d :
	            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
	            d.constructor === Number ? new Date(d) :
	            d.constructor === String ? new Date(d) :
	            typeof d === "object" ? new Date(d.year,d.month,d.date) :
	            NaN
	        );
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