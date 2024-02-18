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
    }else if (estimatedReturnDate < today) {
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
                    data.forEach(function (debt, index) {
                        var formattedAmount = formatCurrencyIDR(debt.total_amount);

                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-6">
                                    <label class="mb-1 fw-bold">${debt.creditor}</label>
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
                    data.forEach(function (debt, index) {
                        var formattedAmount = formatCurrencyIDR(debt.total_amount);

                        var cardItem = `
                        <div class="card m-2">
                            <div class="row m-1">
                                <div class="col-6">
                                    <label class="mb-1 fw-bold">${debt.creditor}</label>
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


$("#submitpayDebtFormButton").click(function () {
    var proofPaymentFile = $("#proofPaymentFile")[0].files[0];
    var creditorId = $("#payDebtCreditorId").val();
    var amount = $("#payDebtAmount").val();
    var payment_receipt_filename = proofPaymentFile ? proofPaymentFile.name : '';

    var formData = new FormData();
    formData.append('file', proofPaymentFile);
    formData.append('creditorId', creditorId);
    formData.append('amount', amount);
    formData.append('payment_receipt_filename', payment_receipt_filename);
    createPayment(formData)
    getLoansAndDisplayInCard()
    hideLoading()

});

function createPayment(formData) {
    showLoading()
    $.ajax({
        url: createPaymentUrl,
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
