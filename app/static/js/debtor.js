$('#payDebtModal').on('hidden.bs.modal', function (e) {
    $("#proofPaymentFile").val('');
    $("#proofPaymentFile").removeClass("is-invalid is-valid");

});

$(document).on("click", ".openPayDebtModalButton", function () {
    var totalAmount = $(this).data('totalamount');
    var creditorId = $(this).data('creditorid');
    var creditorName = $(this).data('creditorname');
    var transactionsId = $(this).data('transactionsid');
    $("#payDebtAmount").val(totalAmount);
    $("#payDebtCreditorId").val(creditorId);
    $("#payDebtCreditorName").val(creditorName);
    $("#payDebtTransactionsId").val(transactionsId);

});

$("#submitpayDebtFormButton").click(function () {
    var proofPaymentFile = $("#proofPaymentFile")[0].files[0];
    var transactionsId = $("#payDebtTransactionsId").val();

    $("#proofPaymentFile, #payDebtTransactionsId").removeClass("is-invalid is-valid");
    $(".proofPaymentFile-error-message, .payDebtTransactionsId-code-error-message").remove();

    var isValid = true;
    console.log(proofPaymentFile)
    console.log(transactionsId)
    if (transactionsId.length < 1) {
        alert("transaksion")
    }
    if (proofPaymentFile == undefined) {
        $("#proofPaymentFile").addClass("is-invalid");
        $("#proofPaymentFile").after('<div class="invalid-feedback proofPaymentFile-error-message">proofPaymentFile id required.</div>');
        isValid = false;
    }

    if (isValid) {
        var formData = new FormData();
        formData.append('file', proofPaymentFile);
        formData.append('transactionsId', transactionsId);
        debtorPayDebt(formData)
        getLoansAndDisplayInCard()
        hideLoading()
    }


});

$('#applyLoanModal').on('hidden.bs.modal', function (e) {
    $('#amount').val('');
    $('#searchUniqueCodeInput').val('');
    $('#creditorName').val('');
    $('#description').val('');
    $('#estimatedReturnDate').val('');
    $("#amount, #searchUniqueCodeInput, #description, #creditorName, #estimatedReturnDate ").removeClass("is-invalid is-valid");

});


$('#amount').on('input', function () {
    let inputValue = $(this).val().replace(/[^\d]/g, '');
    let formattedValue = Number(inputValue).toLocaleString('id-ID');

    $(this).val(formattedValue);
});

$("#submitApplyFormLoanButton").click(function () {

    var creditorId = $("#creditorId").val();
    var amount = $("#amount").val().replace(/\./g, '');
    var description = $("#description").val();
    var estimatedReturnDate = $("#estimatedReturnDate").val();
    console.log(estimatedReturnDate)
    $("#amount, #searchUniqueCodeInput, #description, #creditorName, #estimatedReturnDate ").removeClass("is-invalid is-valid");
    $(".amount-error-message, .unique-code-error-message").remove();

    var isValid = true;

    // Validate amount
    if (amount.length < 1) {
        $("#amount").addClass("is-invalid");
        $("#amount").after('<div class="invalid-feedback amount-error-message">amount id required.</div>');
        isValid = false;
    }
    if (creditorId.length < 1) {
        $("#creditorName").addClass("is-invalid");
        $("#creditorName").after('<div class="invalid-feedback amount-error-message">Do a search for the correct creditor name first.</div>');
        isValid = false;
    }
    if (description.length < 1) {
        $("#description").addClass("is-invalid");
        $("#description").after('<div class="invalid-feedback amount-error-message">description id required..</div>');
        isValid = false;
    }
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    if (estimatedReturnDate === '') {
        $("#estimatedReturnDate").addClass("is-invalid");
        $("#estimatedReturnDate").after('<div class="invalid-feedback amount-error-message">The date required.</div>');
        isValid = false;
    } else if (estimatedReturnDate < today) {
        $("#estimatedReturnDate").addClass("is-invalid");
        $("#estimatedReturnDate").after('<div class="invalid-feedback amount-error-message">The date must be greater than today.</div>');
        isValid = false;
    }

    if (isValid) {
        showLoading()

        console.log("creditorId", creditorId, "amount", amount, "description", description, estimatedReturnDate)
        createTransaction(creditorId, amount, description, estimatedReturnDate)
        $('#applyLoanModal').modal('hide')
        closeModal('applyLoanModal')
        getLoansAndDisplayInCard()
    }


})

function getLoansAndDisplayInCard() {
    $.ajax({
        url: getDebtsByCreditorUrl,
        type: "GET",
        dataType: "json",
        success: function (result) {
            var data = result.data;
            console.log(data);

            function appendCards() {
                var creditorsList = $('#creditors_list');
                creditorsList.empty();
                if (data.length === 0) {
                    creditorsList.append(`
                        <div class="alert alert-light" role="alert">
                        You have no debts! 😁
                        </div>
                    `);
                } else {
                    data.forEach(function (debt, index) {
                        var formattedAmount = formatCurrencyIDR(debt.total_amount);

                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-7">
                                    <label class="mb-1 fw-bold">${debt.creditor}</label>
                                    <p class="text-muted">${formattedAmount}</p>
                                </div>
                                <div class="col-5 text-end">
                                    <button type="button" class="btn btn-success btn-lg openPayDebtModalButton mt-2"
                                        id="openPayDebtModalButton" 
                                        data-bs-toggle="modal"
                                        data-bs-target="#payDebtModal"
                                        data-totalAmount="${formattedAmount}"
                                        data-creditorId="${debt.creditorId}"
                                        data-transactionsid="${debt.id}"
                                        data-creditorName="${debt.creditor}">💵 Pay
                                    </button>
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

function getDebtorOrders() {
    $.ajax({
        url: getDebtorOrdersUrl,
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
                    data.forEach(function (transaksion, index) {
                        var formattedAmount = formatCurrencyIDR(transaksion.total_amount);

                        var cardItem = `
                            <div class="card m-2">
                                <div class="row m-1">
                                    <div class="col-6">
                                        <label class="mb-1 fw-bold">${transaksion.creditor}</label>
                                        <p class="text-muted">${formattedAmount}</p>
                                    </div>
                                    <div class="col-6 text-end">
                                        <span class="badge ${transaksion.status === 'submitted' ? 'text-bg-primary' : transaksion.status === 'awaiting creditor approval' ? 'text-bg-success' : ''}">${transaksion.status}</span>
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
                                            <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>you applies a loan to ${transaksion.creditor}.</strong>
                                        </span>
                                        <div>
                                            <p class="text-muted m-1">${ubahFormatTanggal(transaksion.submitted_at)}</p>
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
                                            <strong>Waiting for money transfer from  ${transaksion.creditor}.</strong>
                                        </span>
                                    </div>
                                </div>
                            `;
                        } else if (transaksion.status === 'awaiting creditor approval') {
                            cardItem += `
                                <div class="d-flex mb-1">
                                    <div class="d-flex flex-column align-items-center">
                                        <div>
                                            <i class="bi bi-check-circle-fill" style="color: green;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>you applies a loan to ${transaksion.creditor}.</strong>
                                        </span>
                                        <div>
                                            <p class="text-muted m-1">${ubahFormatTanggal(transaksion.submitted_at)}</p>
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
                                            <strong>${transaksion.creditor} sends money to you</strong>
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
                                            <strong>you pays money to ${transaksion.creditor} </strong>
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
                                            <i class="bi bi-arrow-right-circle-fill" style="color: orange;"></i></h6>
                                        </div>
                                        <div class="line h-100"></div>
                                    </div>
                                    <div>
                                        <span class="text-dark m-1 ">
                                            <strong>Waiting approval from  ${transaksion.creditor}.</strong>
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

function getDebtorHistorys() {
    $.ajax({
        url: getDebtorHistorysUrl,
        type: "GET",
        dataType: "json",
        success: function (result) {
            var data = result.data;
            console.log(data);

            function appendCards() {
                var creditorsList = $('#debtorHistorysContainer');
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
                                    <label class="mb-1 fw-bold">${transaksion.creditor}</label>
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
                                                    <strong>you applies a loan to ${transaksion.creditor}.</strong>
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
                                                    <strong>${transaksion.creditor} sends money to you </strong>
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
                                                    <strong>you pays money to ${transaksion.creditor} </strong>
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
                                                    <strong>${transaksion.creditor} approves the payment </strong>
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

function getCreditors() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: getCreditorsUrl,
            type: "GET",
            dataType: "json",
            success: function (result) {
                var data = result.data;
                resolve(data);
            },
            error: function (error) {
                console.log(error.message);
                reject(error);
            }
        });
    });
}

function getCreditorByUniqueCode(uniquecode) {
    $.ajax({
        url: getCreditorByUniqueCodeUrl,
        type: "POST",
        dataType: "json",
        data: {
            uniquecode: uniquecode
        },
        success: function (result) {
            var user = result.data;
            if (user) {
                const truncatedName = maskName(user.name);
                $("#creditorName").val(truncatedName);
                $("#creditorId").val(user.id);
            } else {
                alert("User dengan unique code tersebut tidak ditemukan.");
            }
            hideLoading()
        },
        error: function (xhr, status, error) {
            console.log("Error:", xhr.responseText);
            alert("User dengan unique code tersebut tidak ditemukan.");
            hideLoading()

        }
    });
}



function maskName(name) {
    // Split the name into individual words
    const words = name.split(' ');

    // Map over each word and mask the characters after the first letter
    const maskedWords = words.map(word => maskWord(word));

    // Join the masked words back together with a space
    const maskedName = maskedWords.join(' ');

    return maskedName;
}

function maskWord(word) {
    // Check if the word has more than one character
    if (word.length > 1) {
        // Mask characters after the first letter
        const maskedPart = '*'.repeat(word.length - 1);
        return word[0] + maskedPart;
    } else {
        // Return the word as is if it's a single character
        return word;
    }
}

function createTransaction(creditorId, amount, description, estimatedReturnDate) {
    $.ajax({
        url: createTransactionUrl,
        type: "POST",
        dataType: "json",
        data: {
            creditorId: creditorId,
            amount: amount,
            description: description,
            estimatedReturnDate: estimatedReturnDate
        },
        success: function (response) {
            console.log("Data sent successfully:", response.message);
            showAlert('debt successfully applied.', 'success');


        },
        error: function (xhr, status, error) {
            console.log("Error:", error)
            showAlert('debt application failed. Please try again.', 'error');


        }
    });
}




function debtorPayDebt(formData) {
    showLoading()
    $.ajax({
        url: debtorPayDebtUrl,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Upload successful:', response);
            $('#payDebtModal').modal('hide')
            closeModal('payDebtModal')
        },
        error: function (error) {
            console.error('Error uploading file:', error);
        }
    });
}


function copyCode() {
    var uniqueCodeInput = $("#uniqueCodeInput");
    uniqueCodeInput.select();
    document.execCommand("copy");
    alert("Kode berhasil disalin!");
}
