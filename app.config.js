(function () {
	'use strict';
    angular
        .module('2kApp')
        .config(config);
    
    function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {
		
		//controllers
		var loginCtrl = "controllers/login.controller.js";
		var dashboardCtrl = "controllers/dashboard.controller.js";
		var eggsProductionCtrl = "controllers/eggs-production.controller.js";
		var gradedEggsCtrl = "controllers/graded-eggs.controller.js";
		var housesCtrl = "controllers/houses.controller.js";
		var customersCtrl = "controllers/customers.controller.js";
		var dailySummaryCtrl = "controllers/daily-summary.controller.js";
		var historicalReportsCtrl = "controllers/historical-reports.controller.js";
		var managerUsersCtrl = "controllers/manage-users.controller.js";
	  
		//directives
		var standardTable = "directives/standard-table/standard-table.directive.js";
		var standardText = "directives/standard-text/standard-text.directive.js";
		var standardNumber = "directives/standard-number/standard-number.directive.js";
		var standardDatepicker = "directives/standard-datepicker/standard-datepicker.directive.js";
		var standardDropdown = "directives/standard-dropdown/standard-dropdown.directive.js";
		
		//services
		var layersService = "services/layers.service.js"
		
		//templates
		
		//dependencies
    	var footable = "plugins/footable/compiled/footable.min.js";
		
		//styles
		var footableStyle = "plugins/footable/compiled/footable.bootstrap.css";
		
		
    	$urlRouterProvider.otherwise("/login");
        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: "views/login.html",
                controller: "LoginCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [loginCtrl]
                        }]);
                    }]
                }
            })
			.state("main", {
				abstract: true,
                url: "/main",
                templateUrl: "views/content.html"
            })
			.state("main.dashboard", {
                url: "/dashboard",
                templateUrl: "views/dashboard.html",
                controller: "DashboardCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [dashboardCtrl]
                        }]);
                    }]
                }
            })
			.state("main.eggs-production", {
                url: "/eggs-production",
                templateUrl: "views/eggs-production.html",
                controller: "EggsProductionCtrl",
	            controllerAs: "vm",
				resolve: {
					loadFootable: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [footable, footableStyle]
                        }]);
                    }],
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable, standardNumber, standardDatepicker, standardDropdown]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [layersService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [eggsProductionCtrl]
                        }]);
                    }]
                }
            })
			.state("main.graded-eggs", {
                url: "/graded-eggs",
                templateUrl: "views/graded-eggs.html",
                controller: "GradedEggsCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [gradedEggsCtrl]
                        }]);
                    }]
                }
            })
			.state("main.houses", {
                url: "/houses",
                templateUrl: "views/houses.html",
                controller: "HousesCtrl",
	            controllerAs: "vm",
				resolve: {
					loadFootable: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [footable, footableStyle]
                        }]);
                    }],
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [layersService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [housesCtrl]
                        }]);
                    }]
                }
            })
			.state("main.customers", {
                url: "/customers",
                templateUrl: "views/customers.html",
                controller: "CustomersCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [customersCtrl]
                        }]);
                    }]
                }
            })
			.state("main.daily-summary", {
                url: "/daily-summary",
                templateUrl: "views/daily-summary.html",
                controller: "DailySummaryCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [dailySummaryCtrl]
                        }]);
                    }]
                }
            })
			.state("main.historical-reports", {
                url: "/historical-reports",
                templateUrl: "views/historical-reports.html",
                controller: "HistoricalReportsCtrl",
	            controllerAs: "vm",
				resolve: {
					loadFootable: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [footable, footableStyle]
                        }]);
                    }],
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable, standardDropdown]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [layersService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [historicalReportsCtrl]
                        }]);
                    }]
                }
            })
			.state("main.manage-users", {
                url: "/manage-users",
                templateUrl: "views/manage-users.html",
                controller: "ManagerUsersCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [managerUsersCtrl]
                        }]);
                    }]
                }
            })
			.state("main.contact-us", {
                url: "/contact-us",
                templateUrl: "views/contact-us.html"
            });
    }
})();