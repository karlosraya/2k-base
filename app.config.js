(function () {
	'use strict';
    angular
        .module('2kApp')
        .config(config)
        .run(transitions);
    
    transitions.$inject = ['$state', '$transitions', 'toasterService', 'exceptionService', 'appService', '$log'];

    function transitions($state, $transitions, toasterService, exceptionService, appService, $log) {
        let requiresAuthCriteria = {
            to: function (state) {
                return state.data && state.data.requiresAuth;
            }
        };

        $transitions.onStart(requiresAuthCriteria, function(transition) {
            if(!transition.from().name) {
                $log.info("Transition to " + transition.to().name);
            } else {
                $log.info("Transition from " + transition.from().name + " to " + transition.to().name);
            }

            return transition.injector().getAsync('authService')
            .then(function(authService) {
                $log.info("INFO: Checking Authorization");
                return authService.auth()
                .then(function(response) {
                    if(response) {
                        appService.setUserDetails(response);
                        if(checkRoles(transition.to().data.allowedRoles)) {
                            return true;
                        } else {
                            toasterService.error("Error", "You are not authorized to view this page. Please check user permissions.");
                            return false;
                        }
                    } else {
                        toasterService.error("Error", "You are not authorized to view this page. Please sign in to continue.");
                        return transition.router.stateService.target('login');
                    }
                    
                })
                .catch(function(error) {
                    $log.error("ERROR:", error);
                    toasterService.error("Error", "An error was encountered during authorization. Please try again in a few minutes.");
                    return transition.router.stateService.target('login');
                });
            })
            .catch(function(error) {
                $log.error("ERROR:", error);
                toasterService.error("Error", "An error was encountered during authorization. Please try again in a few minutes.");
                return transition.router.stateService.target('login');
            });
        });

        function checkRoles(stateAllowedRoles) {
            if(stateAllowedRoles) {
                stateAllowedRoles = stateAllowedRoles.split(',');
                for(var i=0; i<stateAllowedRoles.length; i++) {
                    if(appService.checkUserRoles(stateAllowedRoles[i])) {
                        return true;
                    }
                }
                return false;
            } else {
                return true;
            }
        }
    }

    function config($httpProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {

        $httpProvider.interceptors.push(function($q, $state) {
            let interceptor = {
                request: request
            };

            return interceptor;

            function request(config) {
                var deferred = $q.defer();

                var layersPortalToken = localStorage.getItem('layersPortalToken')

                if(layersPortalToken) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = "Bearer " + layersPortalToken;
                    deferred.resolve(config);
                } else {
                    deferred.resolve(config);
                }

                return deferred.promise;
            }
        });

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
        var dataLockCtrl = "controllers/data-lock.controller.js";
	    var salesCtrl = "controllers/sales.controller.js";
        var batchCtrl = "controllers/batch.controller.js";
        var pricesCtrl = "controllers/prices.controller.js";
        var feedsDeliveryCtrl = "controllers/feeds-delivery.controller.js";
        var feedsDeliveredCtrl = "controllers/feeds-delivered.controller.js";
        var ledgersCtrl = "controllers/ledgers.controller.js";
        var openInvoicesCtrl = "controllers/open-invoices.controller.js";
        var gradedEggsHistoryCtrl = "controllers/graded-eggs-history.controller.js";

		//directives
		var standardTable = "directives/standard-table/standard-table.directive.js";
		var standardText = "directives/standard-text/standard-text.directive.js";
		var standardNumber = "directives/standard-number/standard-number.directive.js";
		var standardDatepicker = "directives/standard-datepicker/standard-datepicker.directive.js";
        var standardDropdown = "directives/standard-dropdown/standard-dropdown.directive.js";
        var standardCurrency = "directives/standard-currency/standard-currency.directive.js";
        var standardPassword = "directives/standard-password/standard-password.directive.js";
        var loadingSpinner = "directives/loading-spinner/loading-spinner.directive.js";
        var restrictAccess = "directives/restrict-access/restrict-access.directive.js";

        //filters
        var dateFilter = "filters/date-format.filter.js";

		//services
		var houseService = "services/house.service.js";
        var batchService = "services/batch.service.js";
        var productionService = "services/production.service.js";
        var feedsDeliveryService = "services/feeds-delivery.service.js";
        var pricesService = "services/prices.service.js";
        var customerService = "services/customer.service.js";
        var gradedEggsService = "services/graded-eggs.service.js";
        var invoiceService = "services/invoice.service.js";
        var dataLockService = "services/data-lock.service.js";

		//templates
        var loginTemplate = "views/login.html";
        var dashboardTemplate ="views/dashboard.html";
        var eggProductionTemplate = "views/eggs-production.html";
        var gradedEggsTemplate = "views/graded-eggs.html";
        var housesTemplate = "views/houses.html";
        var customersTemplate = "views/customers.html";
        var historicalReportTemplate = "views/historical-reports.html";
        var manageUsersTemplate = "views/manage-users.html";
        var dataLockTemplate = "views/data-lock.html";
        var salesTemplate = "views/sales.html";
        var batchTemplate = "views/batch.html";
        var pricesTemplate = "views/prices.html";
        var feedsDeliveredTemplate = "views/feeds-delivered.html";
        var feedsDeliveryTemplate = "views/feeds-delivery.html";
        var ledgersTemplate = "views/ledgers.html";
        var openInvoicesTemplate = "views/open-invoices.html";
        var gradedEggsHistoryTemplate = "views/graded-eggs-history.html"
		
    	$urlRouterProvider.otherwise("/login");
        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: loginTemplate,
                data: {
                    title: "Login"
                },
                controller: "LoginCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [loadingSpinner, restrictAccess]
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
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [loadingSpinner, restrictAccess]
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
                data: {
                    requiresAuth: true
                },
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
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewFeedsDelivery,editFeedsDelivery,deleteFeedsDelivery,administrator"
                },
                controller: "FeedsDeliveryCtrl",
                controllerAs: "vm",
                resolve: {
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [feedsDeliveryService, productionService, dataLockService]
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
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewEggProduction,editEggProduction,administrator"
                },
                controller: "EggsProductionCtrl",
	            controllerAs: "vm",
				resolve: {
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardNumber, standardDatepicker, standardDropdown]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [productionService, houseService, dataLockService]
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
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewGradedEggs,editGradedEggs,administrator"
                },
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
                            files: [gradedEggsService, productionService, dataLockService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [gradedEggsCtrl]
                        }]);
                    }]
                },
                params: {
                	gradedEggsDate: null
                }
            })
            .state("main.sales", {
                url: "sales",
                templateUrl: salesTemplate,
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewInvoice,editInvoice,administrator"
                },
                controller: "SalesCtrl",
                controllerAs: "vm",
                resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardNumber, standardDatepicker, standardDropdown]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [customerService, pricesService, invoiceService, gradedEggsService, dataLockService]
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
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewHouse,editHouse,administrator"
                },
                controller: "HousesCtrl",
	            controllerAs: "vm",
				resolve: {
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardNumber, standardText]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [houseService]
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
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewBatch,editBatch,administrator"
                },
                controller: "BatchCtrl",
	            controllerAs: "vm",
				resolve: {
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardNumber, standardDatepicker, standardText, standardDropdown]
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
                    houseId: null
                }
            })
			.state("main.customers", {
                url: "customers",
                templateUrl: customersTemplate,
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewCustomer,editCustomer,administrator"
                },
                controller: "CustomersCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardNumber, standardText]
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
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewPrice,editPrice,administrator"
                },
                controller: "PricesCtrl",
                controllerAs: "vm",
                resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardCurrency, standardDropdown]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [pricesService, customerService]
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
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewEggProduction,editEggProduction,deleteEggProduction,administrator"
                },
                controller: "HistoricalReportsCtrl",
	            controllerAs: "vm",
				resolve: {
					loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardDropdown]
                        }]);
                    }],
					loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [houseService, productionService, dataLockService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [historicalReportsCtrl]
                        }]);
                    }]
                },
                params: {
                    batchId: null
                }
            })
            .state("main.feeds-delivered", {
                url: "feeds-delivered",
                templateUrl: feedsDeliveredTemplate,
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewFeedsDelivery,editFeedsDelivery,deleteFeedsDelivery,administrator"
                },
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
                            files: [standardDatepicker]
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
            .state("main.graded-eggs-history", {
                url: "graded-eggs-history",
                templateUrl: gradedEggsHistoryTemplate,
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewGradedEggs,editGradedEggs,administrator"
                },
                controller: "GradedEggsHistoryCtrl",
                controllerAs: "vm",
                resolve: {
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [gradedEggsService]
                        }]);
                    }],
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardDatepicker]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [gradedEggsHistoryCtrl]
                        }]);
                    }]
                }
            })
            .state("main.ledgers", {
                url: "ledgers",
                templateUrl: ledgersTemplate,
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewInvoice,editInvoice,deleteInvoice,administrator"
                },
                controller: "LedgersCtrl",
                controllerAs: "vm",
                resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardDropdown, standardDatepicker]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [invoiceService, customerService, pricesService, dataLockService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [ledgersCtrl]
                        }]);
                    }]
                }
            })
            .state("main.open-invoices", {
                url: "open-invoices",
                templateUrl: openInvoicesTemplate,
                data: {
                    requiresAuth: true,
                    allowedRoles: "viewInvoice,editInvoice,deleteInvoice,administrator"
                },
                controller: "OpenInvoicesCtrl",
                controllerAs: "vm",
                resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardDropdown, standardDatepicker]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [invoiceService, customerService, pricesService, dataLockService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [openInvoicesCtrl]
                        }]);
                    }]
                }
            })
			.state("main.manage-users", {
                url: "manage-users",
                templateUrl: manageUsersTemplate,
                data: {
                    requiresAuth: true,
                    allowedRoles: "manageUsers,administrator"
                },
                controller: "ManageUsersCtrl",
	            controllerAs: "vm",
				resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardText, standardPassword]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [houseService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [manageUsersCtrl]
                        }]);
                    }]
                }
            })
            .state("main.data-lock", {
                url: "data-lock",
                templateUrl: dataLockTemplate,
                data: {
                    requiresAuth: true,
                    allowedRoles: "lockData,administrator"
                },
                controller: "DataLockCtrl",
                controllerAs: "vm",
                resolve: {
                    loadDirectives: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [standardNumber, standardDatepicker, standardText, standardDropdown]
                        }]);
                    }],
                    loadServices: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [dataLockService]
                        }]);
                    }],
                    loadController: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: "2kApp",
                            files: [dataLockCtrl]
                        }]);
                    }]
                }
            })
			.state("main.contact-us", {
                url: "contact-us",
                templateUrl: "views/contact-us.html",
                data: {
                    requiresAuth: true
                }
            });
    }
})();