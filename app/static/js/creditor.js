
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
                var debtorsList = $('#debtorOrdersContainer');
                debtorsList.empty();
                if (data.length === 0) {
                    debtorsList.append(`
                        <div class="alert alert-light" role="alert">
                        You have no orders! 😁
                        </div>
                    `);
                } else {
                    data.forEach(function (order, index) {
                        var formattedAmount = formatCurrencyIDR(order.total_amount);
                        console.log(order)

                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-6">
                                    <label class="mb-1 fw-bold">${order.debtor} </label>
                                    <span class="badge ${order.status === 'submitted' ? 'text-bg-primary' : order.status === 'awaiting creditor approval' ? 'text-bg-success' : ''}">${order.status}</span>
                                    <p class="text-muted">${formattedAmount}</p>
                                </div>
                                <div class="col-6 text-end">
                                <button type="button" class="btn btn-success btn-sm openUploadreceiptofMoneyTransferModalButton mt-2"
                                    id="openUploadreceiptofMoneyTransferModalButton" 
                                    data-bs-toggle="modal"
                                    data-bs-target="#uploadReceiptOfMoneyTransferModal"
                                    data-totalAmount="${formattedAmount}"
                                    data-debtorId="${order.debtorId}"
                                    data-debtorName="${order.debtor}">💵 upload receipt 
                                </button>
                                </div>
                            </div>
                        </div>
                    `;
                        debtorsList.append(cardItem);
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