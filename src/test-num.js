'use strict';

/**
 *
 *
 * @author Mai
 * @date
 * @version
 */
// 引入number-precision和decimal
const np = require('number-precision');
np.enableBoundaryChecking(false);
const accCalc = require('./acc_calc');
const baseCalc = require('./base_calc');
const decimal = require('decimal.js');
decimal.set({precision: 50, defaults: true});

const roundTestData = [
    {num: 0.3275, digit: 3, rst: '0.328'},
    {num: 34548.7459845, digit: 6, rst: '34548.745985'},
    {num: 25423543.74695, digit: 4, rst: '25423543.747'},
];
const addTestData = [
    {num1: 0.1, num2: 0.2, rst: '0.3', digit: 4, roundRst: '0.3'},
    {num1: 43223423.23423, num2: -423423, rst: '42800000.23423', digit: 2, roundRst: '42800000.23'},
];
const subTestData = [
    {num1: 1, num2: 0.1, rst: '0.9', digit: 4, roundRst: '0.9'},
    {num1: 43223423.23423, num2: 423423, rst: '42800000.23423', digit: 2, roundRst: '42800000.23'},
];
const mulTestData = [
    {num1: 45855.84187, num2: 590.21845, rst: '27064963.9119565015', digit: 6, roundRst: '27064963.911957'},
    {num1: 45855.84187, num2: 590.218453, rst: '27064964.04952402711', digit: 6, roundRst: '27064964.049524'},
    {num1: 61396.99409, num2: 649.26066, rst: '39862652.9048894994', digit: 6, roundRst: '39862652.904889'},
    {num1: 187.8875, num2: 183.87996, rst: '34548.7459845', digit: 6, roundRst: '34548.745985'},
];
const divTestData = [
    {num1: 1, num2: 0.2, rst: '5', digit: 2, roundRst: '5'},
]

const testRound = function (num, digit, rst) {
    const error = [];
    var result = np.round(num, digit);
    if (result != rst) {
        error.push('np(' + result + ')');
    }
    result = Number(accCalc.roundnum(num, digit));
    if (result != rst) {
        error.push('accCalc(' + result + ')');
    }
    result = baseCalc.round(num, digit);
    if (result != rst) {
        error.push('bascCalc(' + result + ')');
    }
    result = new decimal(num).toDecimalPlaces(digit).toNumber();
    if (result != rst) {
        error.push('decimal(' + result + ')');
    }
    if (error.length > 0) {
        console.log('Number: ' + num + '; Digit: ' + digit + '; Result: ' + rst);
        console.log('error: ' + error);
    }
};

const getErrorHint = function(hint, calcType, rst, roundRst, calcRst, calcRoundRst) {
    if (calcRst != rst) {
        if (calcRoundRst != roundRst) {
            hint.push(calcType + ': ' + calcRst + ' ' + calcType + '.round: ' + calcRoundRst);
        } else {
            hint.push(calcType + ': ' + calcRst);
        }
    } else if (calcRoundRst != roundRst) {
        hint.push(calcType + '.round: ' + calcRoundRst);
    }
};

/**
 * 测试加法
 * @param num1
 * @param num2
 * @param rst
 * @param digit
 * @param roundRst
 */
const testAdd = function (num1, num2, rst, digit, roundRst) {
    const error = [];
    var result = np.plus(num1, num2), roundResult = np.round(result, digit);
    getErrorHint(error, 'np', rst, roundRst, result, roundResult);

    result = accCalc.accAdd(num1, num2);
    roundResult = Number(accCalc.roundnum(result, digit));
    getErrorHint(error, 'accCalc', rst, roundRst, result, roundResult);

    result = baseCalc.add(num1, num2);
    roundResult = baseCalc.round(result, digit);
    getErrorHint(error, 'baseCalc', rst, roundRst, result, roundResult);

    var dRst = decimal.add(num1, num2);
    result = dRst.toNumber();
    roundResult = dRst.toDecimalPlaces(digit).toNumber();
    getErrorHint(error, 'decimal', rst, roundRst, result, roundResult);

    if (error.length > 0) {
        console.log('Number: ' + num1 + ' ' + num2 + '; Answer: ' + rst + '; Digit: ' + digit + '; RoundAnswer: ' + roundRst);
        console.log('error: ');
        console.log(error);
    }
};

/**
 * 测试减法
 * @param num1
 * @param num2
 * @param rst
 * @param digit
 * @param roundRst
 */
const testSub = function (num1, num2, rst, digit, roundRst) {
    const error = [];
    var result = np.minus(num1, num2), roundResult = np.round(result, digit);
    getErrorHint(error, 'np', rst, roundRst, result, roundResult);

    result = accCalc.accSub(num2, num1);
    roundResult = Number(accCalc.roundnum(result, digit));
    getErrorHint(error, 'accCalc', rst, roundRst, result, roundResult);

    result = baseCalc.sub(num1, num2);
    roundResult = baseCalc.round(result, digit);
    getErrorHint(error, 'baseCalc', rst, roundRst, result, roundResult);

    var dRst = decimal.sub(num1, num2);
    result = dRst.toNumber();
    roundResult = dRst.toDecimalPlaces(digit).toNumber();
    getErrorHint(error, 'decimal', rst, roundRst, result, roundResult);

    if (error.length > 0) {
        console.log('Number: ' + num1 + ' ' + num2 + '; Answer: ' + rst + '; Digit: ' + digit + '; RoundAnswer: ' + roundRst);
        console.log('error: ');
        console.log(error);
    }
};

/**
 * 测试乘法
 * @param {Number}num1
 * @param {Number}num2
 * @param {String}rst
 * @param {String}roundRst
 */
const testMul = function (num1, num2, rst, digit, roundRst) {
    const error = [];
    var result = np.times(num1, num2), roundResult = np.round(result, digit);
    getErrorHint(error, 'np', rst, roundRst, result, roundResult);

    result = accCalc.accMul(num1, num2);
    roundResult = Number(accCalc.roundnum(result, digit));
    getErrorHint(error, 'accCalc', rst, roundRst, result, roundResult);

    result = baseCalc.mul(num1, num2);
    roundResult = baseCalc.round(result, digit);
    getErrorHint(error, 'baseCalc', rst, roundRst, result, roundResult);

    var dRst = decimal.mul(num1, num2);
    result = dRst.toNumber();
    roundResult = dRst.toDecimalPlaces(digit).toNumber();
    getErrorHint(error, 'decimal', rst, roundRst, result, roundResult);

    if (error.length > 0) {
        console.log('Number: ' + num1 + ' ' + num2 + '; Answer: ' + rst + '; Digit: ' + digit + '; RoundAnswer: ' + roundRst);
        console.log('error: ');
        console.log(error);
    }
};

/**
 * 测试除法
 * @param num1
 * @param num2
 * @param rst
 * @param digit
 * @param roundRst
 */
const testDiv = function (num1, num2, rst, digit, roundRst) {
    const error = [];
    var result = np.divide(num1, num2), roundResult = np.round(result, digit);
    getErrorHint(error, 'np', rst, roundRst, result, roundResult);

    result = accCalc.accDiv(num1, num2);
    roundResult = Number(accCalc.roundnum(result, digit));
    getErrorHint(error, 'accCalc', rst, roundRst, result, roundResult);

    result = baseCalc.div(num1, num2);
    roundResult = baseCalc.round(result, digit);
    getErrorHint(error, 'baseCalc', rst, roundRst, result, roundResult);

    var dRst = decimal.div(num1, num2);
    result = dRst.toNumber();
    roundResult = dRst.toDecimalPlaces(digit).toNumber();
    getErrorHint(error, 'decimal', rst, roundRst, result, roundResult);

    if (error.length > 0) {
        console.log('Number: ' + num1 + ' ' + num2 + '; Answer: ' + rst + '; Digit: ' + digit + '; RoundAnswer: ' + roundRst);
        console.log('error: ');
        console.log(error);
    }
};

const beginTest = function (hint, fun) {
    console.log(hint);
    fun();
    console.log('');
};

beginTest('Test Round: ', function () {
    for (const d of roundTestData) {
        testRound(d.num, d.digit, d.rst);
    }
});

beginTest('Test Add: ', function () {
    for (const d of addTestData) {
        testAdd(d.num1, d.num2, d.rst, d.digit, d.roundRst);
    }
});

beginTest('Test Substract: ', function () {
    for (const d of subTestData) {
        testSub(d.num1, d.num2, d.rst, d.digit, d.roundRst);
    }
});

beginTest('Test Multiply: ', function () {
    for (const d of mulTestData) {
        testMul(d.num1, d.num2, d.rst, d.digit, d.roundRst);
    }
});

beginTest('Test Divide: ', function () {
    for (const d of divTestData) {
        testDiv(d.num1, d.num2, d.rst, d.digit, d.roundRst);
    }
});