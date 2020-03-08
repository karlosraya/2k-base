(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('GradedEggsHistoryCtrl', GradedEggsHistoryCtrl);

	GradedEggsHistoryCtrl.$inject = ['$state', '$filter', '$timeout', 'gradedEggsService', 'exceptionService', 'toasterService'];

	function GradedEggsHistoryCtrl($state, $filter, $timeout, gradedEggsService, exceptionService, toasterService) {
		var vm = this;

		vm.loading = false;
		vm.startDate = null;
		vm.endDate = null;

		vm.gradedEggsReport = [];

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
		
		vm.selectDate = selectDate;
		vm.exportData = exportData;
		vm.getTotal = getTotal;
		
		function init() {
			var date = new Date();
			vm.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
			vm.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			getGradedEggsReportByDateRange();
		}
		
		function getGradedEggsReportByDateRange() {
			vm.loading = true;
			
			var dateFormat = "yyyy-MM-dd";

			var request = {
				startDate: $filter('date')(vm.startDate, dateFormat),
				endDate: $filter('date')(vm.endDate, dateFormat)
			};

			gradedEggsService.getGradedEggsReportByDateRange(request)
			.then(function(response) {
				vm.loading = false;
				vm.gradedEggsReport = response;
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}

		function selectDate() {
			$timeout(function() {
				if(vm.startDate && vm.endDate) {
					getGradedEggsReportByDateRange();
				}
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

		function exportData() {
			var csv = '';

			csv +=  "Graded Eggs " + "\r\n\n";
			csv += "Production Date, PWW, PW, Pullets, Small, Medium, Large, Extra Large, Jumbo, Crack, Spoiled, Total" + "\r\n";

		    var fileName = "GradedEggs_" + $filter('date')(vm.startDate, "MMMddyyyy") + "_" + $filter('date')(vm.endDate, "MMMddyyyy");
   
		   	vm.gradedEggsReport.forEach(function(row) {
		   		var string = $filter('date')(row.inputDate, "MM/dd/yyyy") + ","
		   			+ (row.pww ? row.pww : "") + "," 
		   			+ (row.pw ? row.pw : "") + "," 
		   			+ (row.pullets ? row.pullets : "") + "," 
		   			+ (row.small ? row.small : "") + "," 
		   			+ (row.medium ? row.medium : "") + "," 
		   			+ (row.large ? row.large : "") + "," 
		   			+ (row.extraLarge ? row.extraLarge : "") + "," 
		   			+ (row.jumbo ? row.jumbo : "") + "," 
		   			+ (row.crack ? row.crack : "") + "," 
		   			+ (row.spoiled ? row.spoiled : "") + "," 
		   			+ getTotal(row)+ "\r\n";

		   		csv += string;	
		   	});
		    
		    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);

		    var link = document.createElement("a");    
		    link.href = uri;
		    link.style = "visibility:hidden";
		    link.download = fileName + ".csv";
		    
		    document.body.appendChild(link);
		    link.click();
		    document.body.removeChild(link);

		    toasterService.success("Success", "Data exported successfully!");
		}


	}
})();