(function() {
    'use strict';
    angular
        .module('2kApp')
        .controller('OpenInvoicesCtrl', OpenInvoicesCtrl);

    OpenInvoicesCtrl.$inject = ['$filter', '$timeout', 'appService', 'invoiceService', 'customerService', 'pricesService', 'dataLockService',
        'exceptionService', 'toasterService', 'alertService'
    ];

    function OpenInvoicesCtrl($filter, $timeout, appService, invoiceService, customerService, pricesService, dataLockService,
        exceptionService, toasterService, alertService) {
        var vm = this;

        vm.loading = false;
        vm.startDate = null;
        vm.endDate = null;
        vm.lockDate = null;

        vm.editingRoles = ['administrator', 'editInvoice'];
        vm.deleteRoles = ['administrator', 'deleteInvoice'];

        vm.rowsPerPage = 20;
        vm.rowsPerPageOptions = [
            { key: 20, value: 20 },
            { key: 50, value: 50 },
            { key: 100, value: 100 }
        ];

        vm.customers = [];
        vm.openInvoices = [];
        vm.openInvoicesCopy = [];

        vm.$onInit = init();

        vm.selectDate = selectDate;
        vm.getTotal = getTotal;

        function init() {
            getLatestLockedDate();
            getCustomers();

            var date = new Date();
            vm.startDate = new Date(date.getFullYear(), date.getMonth(), 1);;
            vm.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);;

            vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
            vm.deletePermission = appService.checkMultipleUserRoles(vm.deleteRoles);
        }

        function getCustomers() {
            customerService.getCustomers()
                .then(function(customers) {
                    vm.customers = customers;
                    if (customers && customers.length > 0) {
                        customers.forEach(function(customer, index) {
                            var firstName = customer.firstName;
                            var lastName = customer.lastName ? " " + customer.lastName : "";
                            customer.fullName = firstName + lastName;
                        });
                    }
                    getOpenInvoicesByDate();
                })
                .catch(function(error) {
                    exceptionService.catcher(error);
                });
        }

        function selectDate() {
            getOpenInvoicesByDate();
        }

        function getOpenInvoicesByDate() {
            $timeout(function() {
                var request = {};
                request.startDate = $filter('date')(vm.startDate, "yyyy-MM-dd");
                request.endDate = $filter('date')(vm.endDate, "yyyy-MM-dd");;

                vm.loading = true;
                invoiceService.getOpenInvoiceByDate(request)
                    .then(function(response) {
                        vm.openInvoices = transformOpenInvoices(response);
                        vm.loading = false;
                    })
                    .catch(function(error) {
                        exceptionService.catcher(error);
                        vm.loading = false;
                    });
            });
        }

        function transformOpenInvoices(openInvoices) {
            var transformedOpenInvoices = [];

            var customers = [...new Set(openInvoices.map(openInvoice => openInvoice.customerId))];;

            customers.forEach(function(customer) {
                var customerOpenInvoices = openInvoices.filter(invoice => invoice.customerId == customer);
                customerOpenInvoices.forEach(invoice => invoice.age = getInvoiceAge(invoice.invoiceDate));
                var openInvoice = {};
                openInvoice.customerId = customer;
                openInvoice.customerName = getCustomerName(customer);
                openInvoice.customerInvoices = customerOpenInvoices;
                openInvoice.totalOpenBalance = getTotal(customerOpenInvoices);
                openInvoice.maxAge = Math.max.apply(Math, customerOpenInvoices.map(function(o) { return o.age; }))
                transformedOpenInvoices.push(openInvoice);
            });

            return transformedOpenInvoices;
        }

        function getLatestLockedDate() {
            dataLockService.getLatestLockedDate()
                .then(function(response) {
                    appService.setLockDate(new Date(response.lockDate));
                    vm.lockDate = new Date(response.lockDate);
                })
                .catch(function(error) {
                    exceptionService.catcher(error);
                });
        }

        function getCustomerName(customerId) {
            return vm.customers.find(function(customer) {
                return customer.id == customerId;
            }).fullName;
        }

        function getInvoiceAge(date) {
            let date1 = new Date();
            let date2 = new Date(date);

            let diffTime = Math.abs(date2 - date1);
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }

        function getTotal(invoices) {
            return invoices.reduce((a, b) => a + (b['openBalance'] || 0), 0);
        }
    }
})();