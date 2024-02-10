
function getCreditorReceivables() {
    $.ajax({
        url: getCreditorReceivablesUrl,
        type: "GET",
        dataType: "json",
        success: function (result) {
            var data = result.data;
            console.log(data);

            function appendCards() {
                var creditorsList = $('#creditorReceivablesContainer');
                creditorsList.empty();
                if (data.length === 0) {
                    creditorsList.append(`
                        <div class="alert alert-light" role="alert">
                        You have no orders! 😁
                        </div>
                    `);
                } else {
                    data.forEach(function (debt, index) {
                        var formattedAmount = formatCurrencyIDR(debt.total_amount);

                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-6">
                                    <label class="mb-1 fw-bold">${debt.debtor}</label>
                                    <p class="text-muted">${formattedAmount}</p>
                                </div>
                                <div class="col-6 text-end">
                                </div>
                            </div>
                        </div>
                    `;
                        creditorsList.append(cardItem);
                    });
                }
            }

            appendCards();
            hideLoading();
        },
        error: function (xhr, status, error) {
            console.log("Error:", error);
            showAlert('Data is not displayed, the server is having problems.', 'error');
        }
    });
}

function getCreditorOrders() {
    $.ajax({
        url: getCreditorOrdersUrl,
        type: "GET",
        dataType: "json",
        success: function (result) {
            var data = result.data;
            console.log(data);

            function appendCards() {
                var creditorsList = $('#debtorOrdersContainer');
                creditorsList.empty();
                if (data.length === 0) {
                    creditorsList.append(`
                        <div class="alert alert-light" role="alert">
                        You have no orders! 😁
                        </div>
                    `);
                } else {
                    data.forEach(function (debt, index) {
                        var formattedAmount = formatCurrencyIDR(debt.total_amount);

                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-6">
                                    <label class="mb-1 fw-bold">${debt.debtor}</label>
                                    <p class="text-muted">${formattedAmount}</p>
                                </div>
                                <div class="col-6 text-end">
                                <span class="badge ${debt.status === 'submitted' ? 'text-bg-primary' : debt.status === 'awaiting creditor approval' ? 'text-bg-success' : ''}">${debt.status}</span>
                                </div>
                            </div>
                        </div>
                    `;
                        creditorsList.append(cardItem);
                    });
                }
            }

            function appendAccordianItem() {
                var creditorsList = $('#debtorOrdersAccordionContainer');
                creditorsList.empty();
                if (data.length === 0) {
                    creditorsList.append(`
                        <div class="alert alert-light" role="alert">
                        You have no orders! 😁
                        </div>
                    `);
                } else {
                    data.forEach(function (debt, index) {
                        var formattedAmount = formatCurrencyIDR(debt.total_amount);

                        var cardItem = `
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${debt.debtorId}" aria-expanded="false" aria-controls="${debt.debtorId}">
                                    <div class="row m-1">
                                        <div class="col-6">
                                            <label class="mb-1 fw-bold">${debt.debtor}</label>
                                            <p class="text-muted">${formattedAmount}</p>
                                        </div>
                                        <div class="col-6 text-end">
                                            <span class="badge ${debt.status === 'submitted' ? 'text-bg-primary' : debt.status === 'awaiting creditor approval' ? 'text-bg-success' : ''}">${debt.status}</span>
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            <div id="${debt.debtorId}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body">
                            <div class="container">
                                <div class="card p-2">
                                    <div class="">
                                        <div class="row d-flex justify-content-center">
                                            <div class="row justify-content-center align-items-center">
                                                <div class="col-2 text-center d-flex justify-content-center align-items-center">
                                                    <i class="bi bi-check-circle-fill"></i>
                                                </div>
                                                <div class="col-10 pt-3">
                                                    <div>
                                                        <label class="d-flex align-items-center" for="submitted">Payment Received</label>
                                                    </div>
                                                    <div>
                                                        <p id="date">29 Jan 2023 17:17</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="">
                                        <div class="row d-flex justify-content-center">
                                            <div class="row justify-content-center align-items-center">
                                                <div class="col-2 text-center d-flex justify-content-center align-items-center">
                                                    <i class="bi bi-check-circle-fill"></i>
                                                </div>
                                                <div class="col-10 pt-3">
                                                    <div>
                                                        <label class="d-flex align-items-center" for="submitted">Payment Received</label>
                                                    </div>
                                                    <div>
                                                        <p id="date">29 Jan 2023 17:17</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="">
                                        <div class="row d-flex justify-content-center">
                                            <div class="row justify-content-center align-items-center">
                                                <div class="col-2 text-center d-flex justify-content-center align-items-center">
                                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                                </div>
                                                <div class="col-10 pt-3">
                                                    <div>
                                                        <label for="submitted">Unpaid Debt</label>
                                                    </div>
                                                    <div>
                                                        <p id="date">29 Jan 2023 17:17</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="">
                                        <div class="row d-flex justify-content-center">
                                            <div class="row justify-content-center align-items-center">
                                                <div class="col-2 text-center d-flex justify-content-center align-items-center">
                                                    <i class="bi bi-circle"></i>
                                                </div>
                                                <div class="col-10 pt-3">
                                                    <div>
                                                        <label for="submitted">Awaiting Creditor Approval</label>
                                                    </div>
                                                    <div>
                                                        <p id="date">29 Jan 2023 17:17</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="">
                                        <div class="row d-flex justify-content-center">
                                            <div class="row justify-content-center align-items-center">
                                                <div class="col-2 text-center d-flex justify-content-center align-items-center">
                                                    <i class="bi bi-circle"></i>
                                                </div>
                                                <div class="col-10 pt-3">
                                                    <div>
                                                        <label for="submitted">Awaiting Creditor Approval</label>
                                                    </div>
                                                    <div>
                                                        <p id="date">29 Jan 2023 17:17</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.Vertical Steppers -->
                        </div>
                            </div>
                        </div>
                    `;
                        creditorsList.append(cardItem);
                    });
                }
            }

            
            appendAccordianItem()
            appendCards();
            hideLoading();
        },
        error: function (xhr, status, error) {
            console.log("Error:", error);
            showAlert('Data is not displayed, the server is having problems.', 'error');
        }
    });
}