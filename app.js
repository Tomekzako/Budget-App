//BUDGET CONTROLLER 
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }


    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });

        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (x) {
                return x.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentage: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });

            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabeL: '.item__percentage'
    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split(".");

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {

                element = DOMstrings.incomeContainer;
                html = '<div class="item" id="inc-%id%"><p class="item__description">%description%</p><div class="item__right"><p class="item__value">%value%</p><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {

                element = DOMstrings.expensesContainer;
                html = '<div class="item" id="exp-%id%"><p class="item__description">%description%</p><div class="item__right"><p class="item__value">%value%</p><p class="item__percentage">21%</p><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            newHtml = newHtml.replace('%description%', obj.description);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (id) {
            var el = document.getElementById(id);

            el.parentNode.removeChild(el);

        },

        clearInputs: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fields[0].focus();
        },

        displayBudget: function (obj) {
            var type;

            obj.budget > 0 ? type = "inc" : type = "exp";

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },

        displayPercentages: function (percentege) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabeL);

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                };
            };

            nodeListForEach(fields, function (current, index) {
                if (percentege[index] > 0) {
                    current.textContent = percentege[index] + "%";
                } else {
                    current.textContent = "--";
                }
            });
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

        document.querySelector(DOM.container).addEventListener('click', deleteItem);

    };


    var updateBudget = function () {

        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
    };


    var updatePercentages = function () {

        budgetCtrl.calculatePercentage();

        var percentages = budgetCtrl.getPercentages();

        UICtrl.displayPercentages(percentages);

    };


    function addItem() {
        var getInput, newItem;

        getInput = UICtrl.getInput();

        if (getInput.description !== "" && !isNaN(getInput.value) && getInput.value > 0) {


            newItem = budgetCtrl.addItem(getInput.type, getInput.description, getInput.value);

            UICtrl.addListItem(newItem, getInput.type);

            UICtrl.clearInputs();

            updateBudget();

            updatePercentages();
        }
    };

    var deleteItem = function (e) {
        var itemID, splitID, type, ID;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type, ID);

            UICtrl.deleteListItem(itemID);

            updateBudget();

            updatePercentages();
        }

    };

    return {
        init: function () {
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();