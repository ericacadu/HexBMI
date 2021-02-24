'use strict'

const getElemt = (elemt) => document.querySelector(elemt)

const height = getElemt('#height')
const weight = getElemt('#weight')
const calcBtn = getElemt('#btn-calculator')
const result = getElemt('#result')
const BMI = getElemt('.res-num')
const resMsg = getElemt('.res-msg')
const renew = getElemt('#btn-result')
const records = getElemt('.listBox')
const deleteBtn = getElemt('#deletBtn')
const inputs = document.querySelectorAll('.inputBox input')
const save = JSON.parse(localStorage.getItem('record')) || []
let tag = ''
let entKey = 0

function update(data) {
	let cont = ''
	let newData = JSON.parse(JSON.stringify(data))
	newData.reverse()

	for (let i = 0; i < newData.length; i++) {
		cont += '<li data-list='
			.concat(i, '>\n\t\t\t<div class="list-msg">\n\t\t\t\t<span class="tag ')
			.concat(newData[i].tag, '"></span>\n\t\t\t\t<span class="txt">')
			.concat(
				newData[i].txt,
				'</span>\n\t\t\t</div>\n\t\t\t<div class="list-bmi">',
			)
			.concat(newData[i].bmi, '</div>\n\t\t\t<div class="list-weight">')
			.concat(newData[i].weight, 'kg</div>\n\t\t\t<div class="list-height">')
			.concat(newData[i].height, 'cm</div>\n\t\t\t<div class="list-date">')
			.concat(
				newData[i].date,
				'</div>\n\t\t\t<i class="material-icons delete"  data-clear="',
			)
			.concat(i, '">delete</i>\n\t\t</li>')
	}

	if (save.length >= 1) {
		records.innerHTML = cont
		deleteBtn.style.display = 'block'
	} else {
		records.innerHTML = '還沒有BMI紀錄，快來面對現實吧！'
		deleteBtn.style.display = 'none'
	}
}

function handleStatus(data) {
	const status = {
		thin: {
			color: '#31BAF9',
			tag: 'thin',
			msg: '過輕',
		},
		normal: {
			color: '#86D73F',
			tag: 'normal',
			msg: '理想',
		},
		overweight: {
			color: '#FF982D',
			tag: 'overweight',
			msg: '過重',
		},
		heavy: {
			color: '#FF6C03',
			tag: 'heavy',
			msg: '輕度肥胖',
		},
		fat: {
			color: '#FF6C03',
			tag: 'fat',
			msg: '中度肥胖',
		},
		overfat: {
			color: '#FF1200',
			tag: 'overfat',
			msg: '重度肥胖',
		},
	}

	const filterStatus = (value) => {
		return [
			changeColor(status[value].color),
			(tag = status[value].tag),
			(resMsg.textContent = status[value].msg),
		]
	}

	if (data <= 18.5) {
		filterStatus('thin')
	} else if (data <= 25) {
		filterStatus('normal')
	} else if (data <= 30) {
		filterStatus('overweight')
	} else if (data <= 35) {
		filterStatus('heavy')
	} else if (data <= 40) {
		filterStatus('fat')
	} else {
		filterStatus('overfat')
	}
}

function changeColor(color) {
	result.style.background = color
	result.style.color = color
	renew.style.background = color
	return color
}

function calculate() {
	let w = weight.value
	let h = height.value / 100
	let bmi = Math.round((w / Math.pow(h, 2)) * 100) / 100
	handleStatus(bmi)
	BMI.textContent = bmi
	result.style.display = 'block'
	calcBtn.style.display = 'none'
	let newData = {
		tag: tag,
		txt: resMsg.textContent,
		bmi: bmi,
		weight: weight.value,
		height: height.value,
		date: nowDate().date,
		time: nowDate().time,
	}
	save.push(newData)

	let toString = JSON.stringify(save)
	localStorage.setItem('record', toString)
	update(save)
}

function nowDate(value) {
	let today = new Date()
	let year = today.getFullYear()
	let month = (today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1)
	let date = (today.getDate() < 10 ? '0' : '') + today.getDate()
	let time = today.getTime()
	value = month + '-' + date + '-' + year
	return {
		date: value,
		time: time,
	}
}

function blurCheck(data) {
	const txt = [' 身高', ' 體重']
	let str = ''
	let chk = true
	let regex = /^(0|[1-9][0-9]*)$/

	for (let i = 0; i < data.length; i++) {
		let intValue = data[i].value.trim()

		if (!regex.exec(intValue) || intValue <= 0) {
			data[i].classList.add('focus')
			str += txt[i]
			chk = false
		} else {
			data[i].classList.remove('focus')
		}
	}

	return {
		msg: str,
		chk: chk,
	}
}

function checkFun() {
	if (blurCheck(inputs).chk) {
		calculate()
	} else {
		alert('請輸入您的' + blurCheck(inputs).msg)
		inputs.forEach(function (item) {
			item.addEventListener('blur', function () {
				blurCheck(inputs)
			})
		})
		return
	}
}

function renewFun() {
	height.value = ''
	weight.value = ''
	resMsg.textContent = ''
	result.style.display = 'none'
	calcBtn.style.display = 'block'
	inputs[0].focus()
}

function clearData(e) {
	let clear = e.target.dataset.clear
	if (!clear) return
	save.splice(clear, 1)
	localStorage.setItem('record', JSON.stringify(save))
	update(save)
}

function clearAll() {
	save.splice(0)
	localStorage.setItem('record', JSON.stringify(save))
	update(save)
}

function keyCtrl(e) {
	if (e.keyCode === 13) {
		let isCalced = calcBtn.style.display === 'block'
		let isChecked = blurCheck(inputs).chk

		if (entKey === 1 && !isCalced) {
			renewFun()
			entKey = 0
		} else if (entKey === 0 && !isChecked) {
			checkFun()
		} else {
			checkFun()
			entKey = 1
		}
	} else return
}

function init() {
	calcBtn.addEventListener('click', checkFun)
	renew.addEventListener('click', renewFun)
	records.addEventListener('click', clearData)
	deleteBtn.addEventListener('click', clearAll)
	window.addEventListener('keydown', keyCtrl)
	update(save)
}

init()
