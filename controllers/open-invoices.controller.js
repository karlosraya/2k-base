(function() {
    'use strict';
    angular
        .module('2kApp')
        .controller('OpenInvoicesCtrl', OpenInvoicesCtrl);

    OpenInvoicesCtrl.$inject = ['$filter', '$timeout', 'appService', 'invoiceService', 'customerService', 'exceptionService', 'toasterService'];

    function OpenInvoicesCtrl($filter, $timeout, appService, invoiceService, customerService, exceptionService, toasterService) {
        var vm = this;

        vm.loading = false;
        vm.startDate = null;
        vm.endDate = null;
        vm.invoice = null;
        vm.customer = null;
        vm.viewingInvoice = false;

        vm.rowsPerPage = 20;
        vm.rowsPerPageOptions = [
            { key: 20, value: 20 },
            { key: 50, value: 50 },
            { key: 100, value: 100 }
        ];

        vm.eggTypes = [
            { header: 'PWW', key: 'pww' },
            { header: 'PW', key: 'pw' },
            { header: 'Pullets', key: 'pullets' },
            { header: 'Small', key: 'small' },
            { header: 'Medium', key: 'medium' },
            { header: 'Large', key: 'large' },
            { header: 'Extra Large', key: 'extraLarge' },
            { header: 'Jumbo', key: 'jumbo' },
            { header: 'Crack', key: 'crack' },
            { header: 'Spoiled', key: 'spoiled' }
        ];

        vm.customers = [];
        vm.openInvoices = [];
        vm.openInvoicesCopy = [];

        vm.$onInit = init();

        vm.selectDate = selectDate;
        vm.getTotal = getTotal;
        vm.exportOpenInvoices = exportOpenInvoices;
        vm.viewInvoice = viewInvoice;
        vm.getEggTypeHeader = getEggTypeHeader;
        vm.back = back;

        function init() {
            getCustomers();

            var date = new Date();
            vm.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            vm.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

        function exportOpenInvoices() {
            var csv = '';

            csv += '"Open Invoices - ' + $filter('date')(vm.startDate, "MMM dd, yyyy") + " to " + $filter('date')(vm.endDate, "MMM dd, yyyy") + '"' + "\r\n\n";

            csv += "Customer/Invoice #,Delivery Date,Age(days),Open Balance" + "\r\n";

            var fileName = "OpenInvoices_" + "_" + $filter('date')(vm.startDate, "MMMddyyyy") + "_" + $filter('date')(vm.endDate, "MMMddyyyy");

            vm.openInvoicesCopy.forEach(function(openInvoice) {
                csv += openInvoice.customerName + "\r\n";
                openInvoice.customerInvoices.forEach(function(invoice) {
                    csv += invoice.invoiceNumber + ',"' + $filter('date')(invoice.invoiceDate, "MMM dd, yyyy") + '",' + invoice.age + "," + '"' + $filter('currency')(invoice.openBalance, "") + '"' + "\r\n";
                });
                csv += "Total " + openInvoice.customerName + ',,,"' + $filter('currency')(openInvoice.totalOpenBalance, "") + '"' + "\r\n";
                csv += "\r\n";
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

        function viewInvoice(invoiceId) {
            vm.loading = true;
            invoiceService.getInvoiceById(invoiceId)
                .then(function(response) {
                    vm.invoice = response;
                    vm.customer = vm.customers.find(function(customer) {
                        return customer.id == response.customerId;
                    });
                    vm.loading = false;
                    vm.viewingInvoice = true;
                })
                .catch(function(error) {
                    exceptionService.catcher(error);
                    vm.loading = false;
                });
        }

        function getEggTypeHeader(key) {
            var eggType = vm.eggTypes.find(function(element) {
                return element.key == key;
            });
            return eggType.header;
        }

        function back() {
            vm.viewingInvoice = false;
        }
    }
})();