//BUDGET CONTROLLER 
var budgetController = (function () {

})();


//UI CONTROLLER
var UIController = (function () {

    return {
        getInput: function () {
            return {
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value
            }
        }
    }

})();


//GLOBAL APP CONTROLLER    
var controller = (function (budgetCtrl, UICtrl) {

    function addItem() {
        
        var getInput = UICtrl.getInput();
        console.log(getInput);
    }

    document.querySelector('.add__btn').addEventListener('click', addItem);

    document.addEventListener('keypress', function (e) {
        if (e.keyCode === 13 || e.which === 13) {
            addItem();
        }
    });

})(budgetController, UIController);