//BUDGET CONTROLLER 
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        testing: function () {
            console.log(data);
        }
    };

})();


//UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {

                element = DOMstrings.incomeContainer;
                html = '<div class="item" id="income-%id%"><p class="item__description">%description%</p><div class="item__right"><p class="item__value">%value%</p><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {

                element = DOMstrings.expensesContainer;
                html = '<div class="item" id="income-%id%"><p class="item__description">%description%</p><div class="item__right"><p class="item__value">%value%</p><p class="item__percentage">21%</p><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id', obj.id);
            newHtml = newHtml.replace('%value%', obj.value);
            newHtml = newHtml.replace('%description%', obj.description);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();


//GLOBAL APP CONTROLLER    
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', addItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                addItem();
            }
        });

    };

    function addItem() {
        var getInput, newItem;

        getInput = UICtrl.getInput();

        newItem = budgetCtrl.addItem(getInput.type, getInput.description, getInput.value);

        UICtrl.addListItem(newItem, getInput.type);
    };

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();