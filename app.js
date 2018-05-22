/////     Budgety Project Section 2: Lectures 81-90   ///////////////////

/////////////////////////////////////////////////////////////////////////


var budgetController = (function(){
  
 var Expense = function(id, description, value){
   
   this.id = id;
   this.description = description;
   this.value = value;
   this.percentage = -1;
 };
  
  
  Expense.prototype.calcPercentage = function(totalIncome){
    
    if (totalIncome > 0 ){
    this.percentage = Math.round( (this.value / totalIncome) * 100 );
    } else {
      this.percentage = -1;
    }
  };
  
  
  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };
  
   var Income = function(id, description, value){
   
   this.id = id;
   this.description = description;
   this.value = value;
   
 };
 
 
 
  var calculateTotal = function(type){
    
    var sum = 0;
    
    data.allItems[type].forEach(function(cur){
      sum += cur.value;
    });
    
    data.totals[type] = sum;
    
  };
  
  
  var data = {
    allItems: {
      exp : [],
      inc : []
    },
    totals : {
      exp: 0,
      inc: 0
    },
    budget : 0,
    percentage : -1
  } ;
  
  
  return {
      addItem : function(type, des, val){
        
        var newItem, ID;
        
        //Create new ID
        if(data.allItems[type].length > 0){
          
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
        } else {
          ID = 0;
        }
        
        
        //Create new Item
        if (type === `exp`){
          newItem = new Expense(ID, des, val);
        }
          else if (type ===`inc`){
            newItem = new Income(ID, des, val);
          }
        
        //Push it into our array
        data.allItems[type].push(newItem);
        
        //And return it to access in other modules
        return newItem;
        
      },
        
       
      deleteItem : function(type, id){
        var ids, index;
        
        //  id = 3
        //If we could know that all the id's were sequential numbers it would be simple
        //but once we have deleted one this doesn't work any more
        //So instead we need to know the indexOf id we are deleting
      ids =  data.allItems[type].map(function(current){
          return current.id;
        });
        
      index = ids.indexOf(id);
        
        if (index !== -1){
          data.allItems[type].splice(index, 1);
        }
        
        
      },
        
        
      calculateBudget : function(){
        
        //calculate total income and expenses
        
        calculateTotal("exp");
        calculateTotal("inc");
        
        //Calculate the budget: income - expenses
        
        data.budget = data.totals.inc - data.totals.exp;
        
        //calculate the percentage of income that we spent
        
        if (data.totals.inc > 0){
        data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
        } else {
          data.percentage = -1;
        }
        
        
      },
      
      calculatePercentages : function(){
        
        data.allItems.exp.forEach(function(cur){
          cur.calcPercentage(data.totals.inc);
        });
        
      },
      
      
      getPercentages : function(){
        
        var allPerc = data.allItems.exp.map(function(cur){
          return cur.getPercentage();
        });
        return allPerc;
      },
      
      
      getBudget : function(){
        return {
          budget : data.budget,
          totalInc : data.totals.inc,
          totalExp : data.totals.exp,
          percentage : data.percentage
        };
      },
      
      
    testing: function(){
      console.log(data.allItems);
    }
  };
  
})();



/// UI CONTROLLER

var UIController = (function(){
  
  
  var DOMStrings = {
    inputType : ".add__type",
    inputDescription : ".add__description",
    inputValue : ".add__value",
    inputBtn : ".add__btn",
    incomeContainer : ".income__list",
    expensesContainer : ".expenses__list",
    budgetLabel : ".budget__value",
    incomeLabel : ".budget__income--value",
    expensesLabel : ".budget__expenses--value",
    percentageLabel : ".budget__expenses--percentage",
    container : ".container",
    expensesPercLabel : ".item__percentage",
    dateLabel : ".budget__title--month"
  };
  
    var formatNumbers = function(num, type){
    
    var numSplit, int, dec, type;
      // + or - before number
      
      // decimal point + 2 zeros (or cents) after integers
      
      //Numbers in thousands have comma after hundreds place
    
    num = Math.abs(num);
    num = num.toFixed(2); //This is a method in the prototype of number object to always have fixed 2 decimal points
    numSplit = num.split(".");
    
    int = numSplit[0];
    
    if(int.length > 3){
      int = int.substr(0, int.length -3) + "," + int.substr(int.length-3, 3);
    }
    dec = numSplit[1];
    
    return (type ==="exp" ? "-" : "+") + " " + int + "." + dec;
      
    };
    
  var nodeListForEach = function(list, callback){
    
    for(var i = 0; i < list.length; i++){
      callback(list[i], i);
    }
  };
  
  return {
    
    getInput: function() {
      
      return {
          type : document.querySelector(DOMStrings.inputType).value, //Will either be inc (income +) or exp (expens -)
          description : document.querySelector(DOMStrings.inputDescription).value,
          value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    
    addListItem: function (obj, type){
        
        var html, newHTML, element;
        
        //create HTML string with placeholder text
      
      if(type === "inc"){
        
        element = DOMStrings.incomeContainer;
        
        html = "<div class='item clearfix' id='inc-%id%'><div class='item__description'>%description%</div><div class='right clearfix'><div class='item__value'>%value%</div><div class='item__delete'><button class='item__delete--btn'><i class='ion-ios-close-outline'></i></button></div></div></div>";
      }
        else if (type === "exp") {
          
          element = DOMStrings.expensesContainer;
          
          html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
        }
        
        //Replace placeholder with actual data
        
        newHTML = html.replace("%id%", obj.id);
        newHTML = newHTML.replace("%description%", obj.description);
        newHTML = newHTML.replace("%value%", formatNumbers(obj.value, type));
        
        //Insert HTML into the DOM
        
        document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
        
    },
    
    deleteListItem : function(selectorID){
      
      var el = document.getElementById(selectorID);
      
      el.parentNode.removeChild(el);
      
      
    },
    
    clearFields : function(){
      
      var fields, fieldsArr;
      
      fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);
      
      fieldsArr = Array.prototype.slice.call(fields);
      
      
      fieldsArr.forEach(function(current, index, array){
        current.value = "";
        
      fieldsArr[0].focus();
      
      });
    },
    
    
    displayBudget : function(obj){
      var type;
      
      obj.budget > 0 ? type = "inc" : type = "exp";
      
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumbers(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumbers(obj.totalInc, "inc");
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumbers(obj.totalExp, "exp");
      
      
      if (obj.percentage > 0){
      document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
        
      } else {
      document.querySelector(DOMStrings.percentageLabel).textContent = "---";
        
      }
    },
    
    displayMonth : function(){
      
      var now, year, month, months;
      
      now = new Date();
      month = now.getMonth();
      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + " " + year;
      
      
    },
    
    
    displayPercentages : function(percentages){
      
      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
      
      
      nodeListForEach(fields, function(current, index){
       
       if(percentages[index] > 0){
      current.textContent = percentages[index] + "%";
       }
       else {
         current.textContent = "---";
       }
      });
      
      
    },
    
    changedType : function(){
      
      var fields = document.querySelectorAll(
        DOMStrings.inputType + "," +
        DOMStrings.inputDescription + "," +
        DOMStrings.inputValue);
      
      
      nodeListForEach(fields, function(cur){
        cur.classList.toggle("red-focus");
      });
      
      document.querySelector(DOMStrings.inputBtn).classList.toggle("red");
    },
    
    
    getDOMStrings : function(){
      return DOMStrings;
    }
  };
  
})();





/// GLOBAL APP CONTROLLER

let controller = (function(budgetCtrl, UICtrl){
  
  
    let setupEventListeners = function(){
      
          let DOM = UICtrl.getDOMStrings();
         document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
          
          
          
          document.addEventListener("keypress", function(event){
            
              if (event.keyCode === 13 || event.which === 13){
              
                  ctrlAddItem();
            }
            
      });
      
      document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
      
      document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changedType);
      
    };
    
    var updateBudget = function (){
      
         // 1.0 calculate the budget
         
         budgetCtrl.calculateBudget();
         
         //2.0 Return the budget
         
         var budget = budgetCtrl.getBudget();
         
         // 3.0 Display the budget on ui
        
        UICtrl.displayBudget(budget);
         
    };
      
      
    var updatePercentages = function() {
      
      //1- calculate percentages
      
      budgetCtrl.calculatePercentages();
      //2- read prercentages from the budget controller
      
      var percentages = budgetCtrl.getPercentages();
      //3- update the UI with new percentages
      UICtrl.displayPercentages(percentages);
      
    };
      
      
    var ctrlAddItem = function(){
      
        var input, newItem;
          
        // 1.0 get the field inpu data
        input = UICtrl.getInput();
           
            
          if (input.description !== "" && ! isNaN(input.value) && input.value > 0){
        
          
            // 2.0 add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
             
             // 3.0 add the new item to the user interface
             
             UICtrl.addListItem(newItem, input.type);
             
             //4.0 Clear The Fields
             
             UICtrl.clearFields();
             
             //5.0 Calculate and Update Budget
             
             updateBudget();
             
             //6.0 Calculate and Update Percentages
             
             updatePercentages();
          }
         
    };
        
        
    var ctrlDeleteItem = function(event){
      var itemID, splitID, type, ID;
      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
      
      if (itemID){
        
        splitID = itemID.split("-");
        type = splitID[0];
        ID = parseInt(splitID[1]);
        
        
        //1 - delete item from data structure
        
        budgetController.deleteItem(type, ID);
        
        //2 - delete item from User Interface
        
        UICtrl.deleteListItem(itemID);
        
        //3 - update and show the new budget
        updateBudget();
        
       //4.0 Calculate and Update Percentages
         
         updatePercentages();
      }
      
    };
        
         
        return {
           init : function(){
             console.log("Application has started");
             UICtrl.displayBudget({ budget : 0, totalInc : 0, totalExp : 0, percentage : -1 });
             UICtrl.displayMonth();
             setupEventListeners();
           }
        }

  
})(budgetController, UIController);

controller.init();