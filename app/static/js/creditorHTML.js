var creditorReceivablesHtml = `
<div>
    <h5 class="mx-2 mb-3">your receivable</h5>
    <p class="mx-2 mb-3">the amount of money that an individual has not yet received from another party who has an obligation to pay.</p>
    <div id="creditorReceivablesContainer">
        <!-- Your card content goes here -->
    </div>
</div>
`


var creditorOrdersHtml = `   
<div>
    <h5 class="mx-2 mb-3">your orders</h5>
    <div id="creditorOrdersContainer">
        <!-- Your card content goes here -->
    </div>
</div>


`


var creditorProfileHtml = ` 
<div>
<h5 class="mx-2 mb-3">your profile</h5>
<div>
    <form>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">unique code</label>
            <div class="row">
                <div class="col-10">
                    <input type="text" class="form-control" id="uniqueCodeInput" value="${currentUser.uniqueCode}" readonly>
                </div>
                <div class="col-2 text-end">
                    <button type="button" class="btn btn-secondary" onclick="copyCode()">Copy</button>
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label for="inputPhone" class="form-label">name</label>
            <input type="text" class="form-control" id="inputPhone" value="${currentUser.name}" readonly>
        </div>
        <div class="mb-3">
            <label for="inputEmail" class="form-label">email address</label>
            <input type="email" class="form-control" id="inputEmail" value="${currentUser.email}" readonly>
        </div>
    </form>
</div>
</div>
    
`
