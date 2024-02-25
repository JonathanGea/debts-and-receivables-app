$('#uploadReceiptOfMoneyTransferModal').on('hidden.bs.modal', function (e) {
    $("#proofMoneyTransferFile").val('');
    $("#proofMoneyTransferFile").removeClass("is-invalid is-valid");

});

$("#submitMoneyTransferButton").click(function () {

    var transactionsId = $("#transactionsId").val();
    var proofMoneyTransferFile = $("#proofMoneyTransferFile")[0].files[0];


    $("#proofMoneyTransferFile").removeClass("is-invalid is-valid");
    $(".amount-error-message, .unique-code-error-message").remove();

    var isValid = true;

    // Validate amount
    if (!proofMoneyTransferFile) {
        $("#proofMoneyTransferFile").addClass("is-invalid");
        $("#proofMoneyTransferFile").after('<div class="invalid-feedback amount-error-message">Receipt of transfer money file is required.</div>');
        isValid = false;
    }
    if (isValid) {
        var formData = new FormData();
        formData.append('transactionsId', transactionsId);
        formData.append('file', proofMoneyTransferFile);
        console.log("transactionsId : ", transactionsId)
        createMoneyTransferToDebtor(formData)
        $('#uploadReceiptOfMoneyTransferModal').modal('hide')
        closeModal('uploadReceiptOfMoneyTransferModal')
        getCreditorOrders()
        hideLoading()
    }


})


function approvedPaymentFromDebtor(data) {
    showLoading()
    $.ajax({
        url: approvedPaymentFromDebtorUrl,
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {

        },
        error: function (error) {
            console.error('Error uploading file:', error);
        }
    });
}
function createMoneyTransferToDebtor(data) {
    showLoading()
    $.ajax({
        url: createMoneyTransferToDebtorUrl,
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Upload successful:', response);
            $('#uploadReceiptOfMoneyTransferModal').modal('hide')
            closeModal('uploadReceiptOfMoneyTransferModal')

        },
        error: function (error) {
            console.error('Error uploading file:', error);
        }
    });
}
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
                                    ${order.status === 'submitted' ? `
                                    <button type="button" class="btn btn-success btn-sm openUploadreceiptofMoneyTransferModalButton mt-2"
                                        id="openUploadreceiptofMoneyTransferModalButton" 
                                        data-bs-toggle="modal"
                                        data-bs-target="#uploadReceiptOfMoneyTransferModal"
                                        data-totalAmount="${formattedAmount}"
                                        data-debtorId="${order.debtorId}"
                                        data-transactionsId="${order.id}"
                                        data-debtorName="${order.debtor}">💵 Upload Receipt
                                    </button>` : order.status === 'awaiting creditor approval' ? `
                                    <button type="button" class="btn btn-primary btn-sm approveButton mt-2"
                                        id="approveButton"
                                        data-transactionsId="${order.id}">Approve
                                    </button>` : ''}
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

function getCreditorHistorys() {
    $.ajax({
        url: getCreditorHistorysUrl,
        type: "GET",
        dataType: "json",
        success: function (result) {
            var data = result.data;
            console.log(data);

            function appendCards() {
                var creditorsList = $('#creditorHistorysContainer');
                creditorsList.empty();
                if (data.length === 0) {
                    creditorsList.append(`
                        <div class="alert alert-light" role="alert">
                        You have no Historys! 😁
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

            appendCards();
            hideLoading();
        },
        error: function (xhr, status, error) {
            console.log("Error:", error);
            showAlert('Data is not displayed, the server is having problems.', 'error');
        }
    });
}