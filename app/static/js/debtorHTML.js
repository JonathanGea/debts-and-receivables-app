var debtorDebtHtml = `
<div>
    <h5 class="mx-2 mb-3">your debts</h5>
    <div id="creditors_list">
        <!-- Your card content goes here -->
    </div>
</div>
`


var debtorOrdersHtml = `   
<div>
    <h5 class="mx-2 mb-3">your orders</h5>
    <div id="debtorOrdersContainer">
        <!-- Your card content goes here -->
    </div>
</div>
<div class="accordion accordion-flush" id="accordionFlushExample">
    <div id="debtorOrdersAccordionContainer">
    <div>
</div>
`


var debtorProfileHtml = ` 

<div>
<h5 class="mx-2 mb-3">your profile</h5>
<div>
    <form>
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
