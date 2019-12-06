(function () {
	'use strict';
    angular
        .module('2kApp')
        .config(config)
        .run(transitions);
    
    transitions.$inject = ['$transitions', 'toasterService'];

    function transitions($transitions, toasterService) {
        $transitions.onBefore({}, function() {
            toasterService.clear();
        });
    }

    function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {
		
		//controllers
        var loginCtrl = "controllers/login.controller.js";
        var navigationBarCtrl = "controllers/navbar.controller.js";
		var dashboardCtrl = "controllers/dashboard.controller.js";
		var eggsProductionCtrl = "controllers/eggs-production.controller.js";
		var gradedEggsCtrl = "controllers/graded-eggs.controller.js";
		var housesCtrl = "controllers/houses.controller.js";
		var customersCtrl = "controllers/customers.controller.js";
		var historicalReportsCtrl = "controllers/historical-reports.controller.js";
		var manageUsersCtrl = "controllers/manage-users.controller.js";
	    var salesCtrl = "controllers/sales.controller.js";
        var batchCtrl = "controllers/batch.controller.js";
        var pricesCtrl = "controllers/prices.controller.js";
        var feedsDeliveryCtrl = "controllers/feeds-delivery.controller.js";
        var feedsDeliveredCtrl = "controllers/feeds-delivered.controller.js";

		//directives
		var standardTable = "directives/standard-table/standard-table.directive.js";
		var standardText = "directives/standard-text/standard-text.directive.js";
		var standardNumber = "directives/standard-number/standard-number.directive.js";
		var standardDatepicker = "directives/standard-datepicker/standard-datepicker.directive.js";
        var standardDropdown = "directives/standard-dropdown/standard-dropdown.directive.js";
        var standardCurrency = "directives/standard-currency/standard-currency.directive.js";
		var contentEditable = "directives/content-editable/content-editable.directive.js";
        var loadingSpinner = "directives/loading-spinner/loading-spinner.directive.js";
        
        //filters
        var dateFilter = "filters/date-format.filter.js";

		//services
		var houseService = "services/house.service.js";
        var batchService = "services/batch.service.js";
        var productionService = "services/production.service.js";
        var feedsDeliveryService = "services/feeds-delivery.service.js";
        var alertService = "services/alert.service.js";
        var toasterService = "services/toaster.service.js";
        var exceptionService = "services/exception.service.js";
        var pricesService = "services/prices.service.js";
        var customerService = "services/customer.service.js";
        var gradedEggsService = "services/graded-eggs.service.js";
        var invoiceService = "services/invoice.service.js";

		//templates
        var loginTemplate = "views/login.html";
        var dashboardTemplate ="views/dashboard.html";
        var eggProductionTemplate = "views/eggs-production.html";
        var gradedEggsTemplate = "views/graded-eggs.html";
        var housesTemplate = "views/houses.html";
        var customersTemplate = "views/customers.html";
        var historicalReportTemplate = "views/historical-reports.html";
        var manageUsersTemplate = "views/manage-users.html";
        var salesTemplate = "views/sales.html";
        var batchTemplate = "views/batch.html";
        var pricesTemplate = "views/prices.html";
        var feedsDeliveredTemplate = "views/feeds-delivered.html";
        var feedsDeliveryTemplate = "views/feeds-delivery.html";
		
    	$urlRouterProvider.otherwise("/login");
        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: loginTemplate,
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
                url: "/",
                templateUrl: "views/content.html",
				resolve: {
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [alertService, toasterService, exceptionService]
                        }]);
                    }],
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [loadingSpinner]
                        }]);
                    }],
                    loadFilters: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [dateFilter]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [navigationBarCtrl]
                        }]);
                    }]
                }
            })
			.state("main.dashboard", {
                url: "dashboard",
                templateUrl: dashboardTemplate,
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
            .state("main.feeds-delivery", {
                url: "feeds-delivery",
                templateUrl: feedsDeliveryTemplate,
                controller: "FeedsDeliveryCtrl",
                controllerAs: "vm",
                resolve: {
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [feedsDeliveryService]
                        }]);
                    }],
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardNumber, standardDatepicker, standardText]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [feedsDeliveryCtrl]
                        }]);
                    }]
                }
            })
			.state("main.eggs-production", {
                url: "eggs-production",
                templateUrl: eggProductionTemplate,
                controller: "EggsProductionCtrl",
	            controllerAs: "vm",
				resolve: {
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable, standardNumber, standardDatepicker, standardDropdown]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [productionService, houseService]
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
                url: "graded-eggs",
                templateUrl: gradedEggsTemplate,
                controller: "GradedEggsCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardNumber, standardDatepicker]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [gradedEggsService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [gradedEggsCtrl]
                        }]);
                    }]
                }
            })
            .state("main.sales", {
                url: "sales",
                templateUrl: salesTemplate,
                controller: "SalesCtrl",
                controllerAs: "vm",
                resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [contentEditable, standardNumber, standardDatepicker, standardDropdown]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [customerService, pricesService, invoiceService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [salesCtrl]
                        }]);
                    }]
                }
            })
			.state("main.houses", {
                url: "houses",
                templateUrl: housesTemplate,
                controller: "HousesCtrl",
	            controllerAs: "vm",
				resolve: {
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable, standardNumber, standardText]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [houseService, batchService]
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
            .state("main.batch", {
                url: "batch",
                templateUrl: batchTemplate,
                controller: "BatchCtrl",
	            controllerAs: "vm",
				resolve: {
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable, standardNumber, standardDatepicker, standardText, standardDropdown]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [batchService, houseService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [batchCtrl]
                        }]);
                    }]
                },
                params: {
                    house: null
                }
            })
			.state("main.customers", {
                url: "customers",
                templateUrl: customersTemplate,
                controller: "CustomersCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable, standardNumber, standardText]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [customerService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [customersCtrl]
                        }]);
                    }]
                }
            })
            .state("main.prices", {
                url: "prices",
                templateUrl: pricesTemplate,
                controller: "PricesCtrl",
                controllerAs: "vm",
                resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardCurrency]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [pricesService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [pricesCtrl]
                        }]);
                    }]
                }
            })
			.state("main.historical-reports", {
                url: "historical-reports",
                templateUrl: historicalReportTemplate,
                controller: "HistoricalReportsCtrl",
	            controllerAs: "vm",
				resolve: {
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable, standardDropdown]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [houseService, productionService]
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
            .state("main.feeds-delivered", {
                url: "feeds-delivered",
                templateUrl: feedsDeliveredTemplate,
                controller: "FeedsDeliveredCtrl",
                controllerAs: "vm",
                resolve: {
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [feedsDeliveryService]
                        }]);
                    }],
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardTable]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [feedsDeliveredCtrl]
                        }]);
                    }]
                }
            })
			.state("main.manage-users", {
                url: "manage-users",
                templateUrl: manageUsersTemplate,
                controller: "ManageUsersCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [manageUsersCtrl]
                        }]);
                    }]
                }
            })
			.state("main.contact-us", {
                url: "contact-us",
                templateUrl: "views/contact-us.html"
            });
    }
})();