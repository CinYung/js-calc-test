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

/**
 * 测试乘法
 * @param {Number}num1
 * @param {Number}num2
 * @param {String}rst
 * @param {String}roundRst
 */
const testMul = function (num1, num2, rst, roundRst) {
    const error = [];
    var result = np.times(num1, num2), roundResult = np.round(result, 6);
    if (result != rst) {
        if (roundResult != roundRst) {
            error.push('np: ' + result + ' np.round(6): ' + roundResult);
        } else {
            error.push('np: ' + result);
        }
    } else if (roundResult != roundRst) {
        error.push('np.round(6): ' + roundResult);
    }
    result = accCalc.accMul(num1, num2);
    roundResult = Number(accCalc.roundnum(result, 6));
    if (result != rst) {
        if (roundResult != roundRst) {
            error.push('accCalc: ' + result + ' accCalc.round(6): ' + roundResult);
        } else {
            error.push('accCalc: ' + result);
        }
    } else if (roundResult != roundRst) {
        error.push('accCalc.round(6): ' + roundResult);
    }
    result = baseCalc.mul(num1, num2);
    roundResult = baseCalc.round(result, 6);
    if (result != rst) {
        if (roundResult != roundRst) {
            error.push('baseCalc: ' + result + ' baseCalc.round(6): ' + roundResult);
        } else {
            error.push('baseCalc: ' + result);
        }
    } else if (roundResult != roundRst) {
        error.push('baseCalc.round(6): ' + roundResult);
    }
    var dRst = decimal.mul(num1, num2)
    result = dRst.toNumber();
    roundResult = dRst.toDecimalPlaces(6).toNumber();
    if (result != rst) {
        if (roundResult != roundRst) {
            error.push('decimal: ' + result + ' decimal.round(6): ' + roundResult);
        } else {
            error.push('decimal: ' + result);
        }
    } else if (roundResult != roundRst) {
        error.push('decimal.round(6): ' + roundResult);
    }
    if (error.length > 0) {
        console.log('Number: ' + num1 + ' ' + num2 + ' Answer: ' + rst + '; RoundTo(6): ' + roundRst);
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
    testRound(0.3275, 3, '0.328');
    testRound(34548.7459845, 6, '34548.745985');
    testRound(25423543.74695, 4, '25423543.747');
});

beginTest('Test Multiply: ', function () {
    testMul(45855.84187, 590.21845, '27064963.9119565015', '27064963.911957');
    testMul(45855.84187, 590.218453, '27064964.04952402711', '27064964.049524');
    testMul(61396.99409, 649.26066, '39862652.9048894994', '39862652.904889');
    testMul(187.8875, 183.87996, '34548.7459845', '34548.745985');
});