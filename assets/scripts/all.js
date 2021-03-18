"use strict";

var getElemt = function getElemt(elemt) {
  return document.querySelector(elemt);
};

var height = getElemt('#height');
var weight = getElemt('#weight');
var calcBtn = getElemt('#btn-calculator');
var result = getElemt('#result');
var BMI = getElemt('.res-num');
var resMsg = getElemt('.res-msg');
var renew = getElemt('#btn-result');
var records = getElemt('.listBox');
var deleteBtn = getElemt('#deletBtn');
var inputs = document.querySelectorAll('.inputBox input');
var save = JSON.parse(localStorage.getItem('record')) || [];
var tag = '';
var entKey = 0; 

function update(data) {
  var cont = '';
  var newData = JSON.parse(JSON.stringify(data));
  newData.reverse();

  for (var i = 0; i < newData.length; i++) {
    cont += "<li data-list=".concat(i, ">\n      <div class=\"list-msg\">\n        <span class=\"tag ").concat(newData[i].tag, "\"></span>\n        <span class=\"txt\">").concat(newData[i].txt, "</span>\n      </div>\n      <div class=\"list-bmi\">").concat(newData[i].bmi, "</div>\n      <div class=\"list-weight\">").concat(newData[i].weight, "kg</div>\n      <div class=\"list-height\">").concat(newData[i].height, "cm</div>\n      <div class=\"list-date\">").concat(newData[i].date, "</div>\n      <i class=\"material-icons delete\"  data-clear=\"").concat(i, "\">delete</i>\n    </li>");
  }

  if (save.length >= 1) {
    records.innerHTML = cont;
    deleteBtn.style.display = 'block';
  } else {
    records.innerHTML = '還沒有BMI紀錄，快來面對現實吧！';
    deleteBtn.style.display = 'none';
  }
} 


function handleStatus(data) {
  var status = {
    thin: {
      color: '#31BAF9',
      tag: 'thin',
      msg: '過輕'
    },
    normal: {
      color: '#86D73F',
      tag: 'normal',
      msg: '理想'
    },
    overweight: {
      color: '#FF982D',
      tag: 'overweight',
      msg: '過重'
    },
    heavy: {
      color: '#FF6C03',
      tag: 'heavy',
      msg: '輕度肥胖'
    },
    fat: {
      color: '#FF6C03',
      tag: 'fat',
      msg: '中度肥胖'
    },
    overfat: {
      color: '#FF1200',
      tag: 'overfat',
      msg: '重度肥胖'
    }
  };

  var filterStatus = function filterStatus(value) {
    var color = changeColor(status[value].color);
    resMsg.textContent = status[value].msg;
    tag = status[value].tag;
    return {
      color: color,
      tag: tag
    };
  };

  if (data <= 18.5) {
    filterStatus('thin');
  } else if (data <= 25) {
    filterStatus('normal');
  } else if (data <= 30) {
    filterStatus('overweight');
  } else if (data <= 35) {
    filterStatus('heavy');
  } else if (data <= 40) {
    filterStatus('fat');
  } else {
    filterStatus('overfat');
  }
}

function changeColor(color) {
  result.style.background = color;
  result.style.color = color;
  renew.style.background = color;
  return color;
} 


function calculate() {
  var w = weight.value;
  var h = height.value / 100;
  var bmi = Math.round(w / Math.pow(h, 2) * 100) / 100;
  handleStatus(bmi);
  BMI.textContent = bmi;
  result.style.display = 'block';
  calcBtn.style.display = 'none';
  var newData = {
    tag: tag,
    txt: resMsg.textContent,
    bmi: bmi,
    weight: weight.value,
    height: height.value,
    date: nowDate().date,
    time: nowDate().time
  };
  save.push(newData); 

  var toString = JSON.stringify(save);
  localStorage.setItem('record', toString);
  update(save);
} 


function nowDate(value) {
  var today = new Date();
  var year = today.getFullYear();
  var month = (today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1);
  var date = (today.getDate() < 10 ? '0' : '') + today.getDate();
  var time = today.getTime();
  value = month + '-' + date + '-' + year;
  return {
    date: value,
    time: time
  };
} 


function blurCheck(data) {
  var txt = [' 身高', ' 體重'];
  var str = '';
  var chk = true;
  var regex = /^(0|[1-9][0-9]*)$/;

  for (var i = 0; i < data.length; i++) {
    var intValue = data[i].value.trim();

    if (!regex.exec(intValue) || intValue <= 0) {
      data[i].classList.add('focus');
      str += txt[i];
      chk = false;
    } else {
      data[i].classList.remove('focus');
    }
  }

  return {
    msg: str,
    chk: chk
  };
}

function checkFun() {
  if (blurCheck(inputs).chk) {
    calculate();
  } else {
    alert('請輸入您的' + blurCheck(inputs).msg);
    inputs.forEach(function (item) {
      item.addEventListener('blur', function () {
        blurCheck(inputs);
      });
    });
  }
} 


function renewFun() {
  height.value = '';
  weight.value = '';
  resMsg.textContent = '';
  result.style.display = 'none';
  calcBtn.style.display = 'block';
  inputs[0].focus();
} 


function clearData(e) {
  var clear = e.target.dataset.clear;
  if (!clear) return;
  save.splice(clear, 1);
  localStorage.setItem('record', JSON.stringify(save));
  update(save);
}

function clearAll() {
  save.splice(0);
  localStorage.setItem('record', JSON.stringify(save));
  update(save);
} 


function keyCtrl(e) {
  if (e.keyCode === 13) {
    var isCalced = calcBtn.style.display === 'block';
    var isChecked = blurCheck(inputs).chk;

    if (entKey === 1 && !isCalced) {
      renewFun();
      entKey = 0;
    } else if (entKey === 0 && !isChecked) {
      checkFun();
    } else {
      checkFun();
      entKey = 1;
    }
  } else return;
} 


function init() {
  calcBtn.addEventListener('click', checkFun);
  renew.addEventListener('click', renewFun);
  records.addEventListener('click', clearData);
  deleteBtn.addEventListener('click', clearAll);
  window.addEventListener('keydown', keyCtrl);
  update(save);
}

init();