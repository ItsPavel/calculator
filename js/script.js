const buttons = document.querySelectorAll(".calculator__col");

const actions = ["-", "+", "*", "/"];
let historyStorage = [];
let allHistory = [];
let tempNumber = "0";
let operationType = "";

let isPercent = false;
let isEqual = false;

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const target = e.target;
    const value = target.dataset.type;
    const total = document.querySelector(".calculator__total");
    const history = document.querySelector(".calculator__history");
    getOperationType(value);
    total.innerHTML = tempNumber;
    history.innerHTML = renderHistory(allHistory);
    historyPanelRender(historyStorage);
  });
});

function getOperationType(value) {
  if (value >= 0) {
    operationType = "number";
    tempNumber = tempNumber === "0" ? value : tempNumber + value;
  } else if (value === "dot") {
    operationType = "number";
    if (!/\./.test(tempNumber)) {
      if (tempNumber) {
        tempNumber += ".";
      } else {
        tempNumber = "0.";
      }
    }
  } else if (value === "delete" && operationType === "number") {
    tempNumber = tempNumber.substring(0, tempNumber.length - 1);
    tempNumber = tempNumber ? tempNumber : "0";
    isPercent = false;
  } else if (value === "clear") {
    allHistory = [];
    tempNumber = "0";
    isPercent = false;
    historyStorage = [];
  } else if (actions.includes(value) && tempNumber) {
    operationType = value;
    allHistory.push(tempNumber, operationType);
    tempNumber = "";
    isPercent = false;
  } else if (value === "%") {
    allHistory.push(tempNumber);
    isPercent = true;
    isEqual = false;
    tempNumber = mathfunc(allHistory, isPercent, isEqual);
  } else if (value === "=") {
    const historySegment = [];

    if (!isPercent) {
      allHistory.push(tempNumber);
    }
    historySegment.push(allHistory);
    isEqual = true;
    tempNumber = mathfunc(allHistory, isPercent, isEqual);
    historySegment.push(tempNumber);
    historyStorage.push(historySegment);
    allHistory = [];
    isPercent = false;
  } else if (value === "history") {
    openHistoryPanel();
  }
}

function renderHistory(allHistory) {
  let htmlEl = "";
  allHistory.forEach((el) => {
    if (el >= 0) {
      htmlEl += ` <span>${el}<span>`;
    } else if (actions.includes(el)) {
      htmlEl += ` <span>${el}<span>`;
    }
  });
  return htmlEl;
}

function historyPanelRender(historyStorage) {
  const historyContent = document.querySelector(".calculator__history-content");
  let historyPanelHtml = "";
  historyStorage.forEach((item) => {
    const html = `
    <div>
      <div class="calculator__history">
        ${renderHistory(item[0])}
      </div>
      <div class="calculator__total">${item[1]}</div>
    </div>
    `;
    historyPanelHtml += html;
    console.log("sdas");
  });
  historyContent.innerHTML = historyPanelHtml;
}

function mathfunc(allHistory, isPercent) {
  let total = 0;
  allHistory.forEach((item, i) => {
    if (i === 0) {
      total = parseFloat(item);
    } else if (i - 2 >= 0 && isPercent && i - 2 == allHistory.length - 3) {
      const sign = allHistory[i - 1];
      const lastNumber = item;
      if (!isEqual) {
        total = calcPercent(total, sign, lastNumber);
      } else {
        total = calcPercentWhenPushEqual(total, sign, lastNumber);
      }
    } else if (i - 2 >= 0) {
      const mathOperation = allHistory[i - 1];
      if (item >= 0) {
        if (mathOperation === "+") {
          total += parseFloat(item);
        } else if (mathOperation === "-") {
          total -= parseFloat(item);
        } else if (mathOperation === "*") {
          total *= parseFloat(item);
        } else if (mathOperation === "/") {
          total /= parseFloat(item);
        } else if (mathOperation === "%") {
          total = (total / 100) * item;
        }
      }
    }
  });
  return String(total);
}

function calcPercent(total, operation, lastNumber) {
  if (operation === "+" || operation === "-") {
    return total * (lastNumber / 100);
  } else if (operation === "*" || operation === "/") {
    return lastNumber / 100;
  }
}

function calcPercentWhenPushEqual(total, operation, lastNumber) {
  if (operation === "+") {
    return total + (lastNumber / 100) * total;
  } else if (operation === "+") {
    return total - (lastNumber / 100) * total;
  } else if (operation === "*") {
    return total * (lastNumber / 100);
  } else if (operation === "/") {
    return total / lastNumber;
  }
}

//------Переключение темы калькулятора (светлая/темная)-------
const calculator = document.querySelector(".calculator");
const theme = document.querySelector(".theme");
theme.onclick = () => {
  if (theme.classList.contains("theme_dark")) {
    theme.classList.remove("theme_dark");
    calculator.classList.add("calculator_dark");
  } else {
    theme.classList.add("theme_dark");
    calculator.classList.remove("calculator_dark");
  }
};

//-------Открытие/Cкрытие панели истории----------
const historyPanel = document.querySelector(".calculator__history-panel");
const closeHistoryBtn = historyPanel.querySelector(
  ".calculator__history-close"
);

closeHistoryBtn.onclick = () => {
  if (historyPanel.classList.contains("open")) {
    historyPanel.classList.remove("open");
  }
};

function openHistoryPanel() {
  historyPanel.classList.add("open");
}
