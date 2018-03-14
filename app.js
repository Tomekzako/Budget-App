//BUDGET CONTROLLER 
var budgetController = (function () {

})();


//UI CONTROLLER
var UIController = (function () {

})();


//GLOBAL APP CONTROLLER    
var controller = (function (budgetCtrl, UICtrl) {

    document.querySelector('.add__btn').addEventListener('click', function () {

    });

    document.addEventListener('keypress', function (e) {
        if (e.keyCode === 13 || e.which === 13) {

        }
    });

})(budgetController, UIController);