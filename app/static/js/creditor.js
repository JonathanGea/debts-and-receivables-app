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
                    data.forEach(function (transaksion, index) {
                        var formattedAmount = formatCurrencyIDR(transaksion.total_amount);

                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-6">
                                    <label class="mb-1 fw-bold">${transaksion.debtor}</label>
                                    <p class="text-muted">${formattedAmount}</p>
                                </div>
                                <div class="col-6 text-end">
                                <div>
                                    <a class="collapse-button" data-name="homeCollapse-${transaksion.id}"  style="text-decoration: none; cursor: pointer;">see details <i class="bi bi-chevron-double-down"></i></a>
                                </div>
                            </div>
                            <div class="collapse" id="homeCollapse-${transaksion.id}">
                                <div class="stepper d-flex flex-column ml-2">
                                    <div class="d-flex mb-1">
                                        <div class="d-flex flex-column align-items-center">
                                            <div>
                                                <i class="bi bi-check-circle-fill" style="color: green;"></i>
                                            </div>
                                            <div class="line h-100"></div>
                                        </div>
                                        <div>
                                            <span class="text-dark m-1 ">
                                                <strong>${transaksion.debtor} applies a loan to you .</strong>
                                            </span>
                                            <div>
                                                <p class="text-muted m-1">${ubahFormatTanggal(transaksion.submitted_at)} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="stepper d-flex flex-column ml-2">
                                    <div class="d-flex mb-1">
                                        <div class="d-flex flex-column align-items-center">
                                            <div>
                                                <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                            </div>
                                            <div class="line h-100"></div>
                                        </div>
                                        <div>
                                            <span class="text-dark m-1 ">
                                                <strong>you sends money to ${transaksion.debtor} </strong>
                                            </span>
                                            <p class="text-muted m-1">${ubahFormatTanggal(transaksion.creditor_send_money_at)}
                                                <a style="color:blue; text-decoration: none; cursor: pointer; margin: 5px;" data-bs-toggle="modal" data-bs-target="#receiptModal"
                                                data-payment_receipt_filename="${transaksion.payment_receipt_filename_creditor}" class="openReciptModalButton"> see receipt </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-arrow-right-circle-fill" style="color: orange;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>Waiting ${transaksion.debtor} pays money to you.</strong>
                                        </span>
                                    </div>
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
                    data.forEach(function (transaksion, index) {
                        var formattedAmount = formatCurrencyIDR(transaksion.total_amount);
                        console.log(transaksion)
            
                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-6">
                                    <label class="mb-1 fw-bold">${transaksion.debtor} </label>
                                    <span class="badge ${transaksion.status === 'submitted' ? 'text-bg-primary' : transaksion.status === 'awaiting creditor approval' ? 'text-bg-success' : ''}">${transaksion.status}</span>
                                    <p class="text-muted">${formattedAmount}</p>
                                </div>
                                <div class="col-6 text-end">
                                    ${transaksion.status === 'submitted' ? `
                                    <button type="button" class="btn btn-success btn-sm openUploadreceiptofMoneyTransferModalButton mt-2"
                                        id="openUploadreceiptofMoneyTransferModalButton" 
                                        data-bs-toggle="modal"
                                        data-bs-target="#uploadReceiptOfMoneyTransferModal"
                                        data-totalAmount="${formattedAmount}"
                                        data-debtorId="${transaksion.debtorId}"
                                        data-transactionsId="${transaksion.id}"
                                        data-debtorName="${transaksion.debtor}">💵 Upload Receipt
                                    </button>` : transaksion.status === 'awaiting creditor approval' ? `
                                    <button type="button" class="btn btn-primary btn-sm approveButton mt-2"
                                        id="approveButton"
                                        data-transactionsId="${transaksion.id}">Approve
                                    </button>` : ''}
                                    <div>
                                        <a class="collapse-button" data-name="orderCollapse-${transaksion.id}"  style="text-decoration: none; cursor: pointer;">see details <i class="bi bi-chevron-double-down"></i></a>
                                    </div>
                                </div>
                                <div class="collapse" id="orderCollapse-${transaksion.id}">
                                    <div class="stepper d-flex flex-column ml-2">
                        `;
            
                        if (transaksion.status === 'submitted') {
                            cardItem += `
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-check-circle-fill" style="color: green;"></i>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>${transaksion.debtor} applies a loan to you .</strong>
                                        </span>
                                        <div>
                                            <p class="text-muted m-1">${ubahFormatTanggal(transaksion.submitted_at)} </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-arrow-right-circle-fill" style="color: orange;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>Waiting you pays money to ${transaksion.debtor} .</strong>
                                        </span>
                                    </div>
                                </div>
                            `;
                        } else if (transaksion.status === 'awaiting creditor approval') {
                            cardItem += `
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-check-circle-fill" style="color: green;"></i>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>${transaksion.debtor} applies a loan to you .</strong>
                                        </span>
                                        <div>
                                            <p class="text-muted m-1">${ubahFormatTanggal(transaksion.submitted_at)} </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>you sends money to ${transaksion.debtor} </strong>
                                        </span>
                                        <p class="text-muted m-1">${ubahFormatTanggal(transaksion.creditor_send_money_at)}
                                            <a style="color:blue; text-decoration: none; cursor: pointer; margin: 5px;" data-bs-toggle="modal" data-bs-target="#receiptModal"
                                            data-payment_receipt_filename="${transaksion.payment_receipt_filename_creditor}" class="openReciptModalButton"> see receipt </a>
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>${transaksion.debtor} pays money to you.</strong>
                                        </span>
                                        <p class="text-muted m-1">${ubahFormatTanggal(transaksion.debtor_pay_at)}
                                            <a style="color:blue; text-decoration: none; cursor: pointer; margin: 5px;" data-bs-toggle="modal" data-bs-target="#receiptModal"
                                            data-payment_receipt_filename="${transaksion.payment_receipt_filename_debitor}" class="openReciptModalButton"> see receipt </a>
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>you approves the payment </strong>
                                        </span>
                                        <p class="text-muted m-1">${ubahFormatTanggal(transaksion.creditor_approved_payment_at)}</p>
                                    </div>
                                </div>
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-arrow-right-circle-fill" style="color: orange;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>Waiting your approve paymentfrom ${transaksion.debtor} .</strong>
                                        </span>
                                    </div>
                                </div>
                            `;
                        }
            
                        cardItem += `
                                    </div>
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
                    data.forEach(function (transaksion, index) {
                        var formattedAmount = formatCurrencyIDR(transaksion.total_amount);

                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-6">
                                    <label class="mb-1 fw-bold">${transaksion.debtor}</label>
                                    <p class="text-muted">${formattedAmount}</p>
                                </div>
                                <div class="col-6 text-end">
                                    <span class="badge text-bg-success">success</span>
                                    <div>
                                        <a class="collapse-button" data-name="historyCollapse-${transaksion.id}"
                                            style="text-decoration: none; cursor: pointer;">
                                            see details <i class="bi bi-chevron-double-down"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="collapse" id="historyCollapse-${transaksion.id}">
                                    <div class="stepper d-flex flex-column ml-2">
                                        <div class="d-flex mb-1">
                                            <div class="d-flex flex-column align-items-center">
                                                <div>
                                                    <i class="bi bi-check-circle-fill" style="color: green;"></i>
                                                </div>
                                                <div class="line h-100"></div>
                                            </div>
                                            <div>
                                                <span class="text-dark m-1 ">
                                                    <strong>${transaksion.debtor} applies a loan to you .</strong>
                                                </span>
                                                <div>
                                                    <p class="text-muted m-1">${ubahFormatTanggal(transaksion.submitted_at)} </p>
                                                </div>
                                            </div>
                                        </div>
                
                                        <div class="d-flex mb-1">
                                            <div class="d-flex flex-column align-items-center">
                                                <div>
                                                    <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                                </div>
                                                <div class="line h-100"></div>
                                            </div>
                                            <div>
                                                <span class="text-dark m-1 ">
                                                    <strong>you sends money to ${transaksion.debtor} </strong>
                                                </span>
                                                <p class="text-muted m-1">${ubahFormatTanggal(transaksion.creditor_send_money_at)}
                                                <a style="color:blue; text-decoration: none; cursor: pointer; margin: 5px;" data-bs-toggle="modal" data-bs-target="#receiptModal"
                                                data-payment_receipt_filename="${transaksion.payment_receipt_filename_creditor}" class="openReciptModalButton"> see receipt </a>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="d-flex mb-1">
                                            <div class="d-flex flex-column align-items-center">
                                                <div>
                                                    <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                                </div>
                                                <div class="line h-100"></div>
                                            </div>
                                            <div>
                                                <span class="text-dark m-1 ">
                                                    <strong>${transaksion.debtor} pays money to you.</strong>
                                                </span>
                                                <p class="text-muted m-1">${ubahFormatTanggal(transaksion.debtor_pay_at)}
                                                <a style="color:blue; text-decoration: none; cursor: pointer; margin: 5px;" data-bs-toggle="modal" data-bs-target="#receiptModal"
                                                data-payment_receipt_filename="${transaksion.payment_receipt_filename_debitor}" class="openReciptModalButton"> see receipt </a>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="d-flex mb-1">
                                            <div class="d-flex flex-column align-items-center">
                                                <div>
                                                    <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                                </div>
                                                <div class="line h-100"></div>
                                            </div>
                                            <div>
                                                <span class="text-dark m-1 ">
                                                    <strong>you approves the payment </strong>
                                                </span>
                                                <p class="text-muted m-1">${ubahFormatTanggal(transaksion.creditor_approved_payment_at)}</p>
                                            </div>
                                        </div>
                                    </div>
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