'use strict';

/**
 *
 *
 * @author Mai
 * @date
 * @version
 */

const np = require('number-precision');
np.enableBoundaryChecking(false);
const accCalc = require('./acc_calc');
const baseCalc = require('./base_calc');
const Decimal = require('decimal.js');
Decimal.set({precision: 50, defaults: true});

// const aDigit = 6, bDigit = 4;
// const addDigit = 6, subDigit = 6, mulDigit = 4, divDigit = 4;
const aDigit = 8, bDigit = 6;
const addDigit = 8, subDigit = 8, mulDigit = 6, divDigit = 6;
const round = false;
const times = 100000;
const a = [], b = [], add = [], sub = [], mul = [], div = [];
const add1 = [], sub1 = [], mul1 = [], div1 = [];
const add2 = [], sub2 = [], mul2 = [], div2 = [];
const add3 = [], sub3 = [], mul3 = [], div3 = [];
const add4 = [], sub4 = [], mul4 = [], div4 = [];
const add5 = [], sub5 = [], mul5 = [], div5 = [];
const rst1 = [], rst2 = [], rst3 = [], rst4 = [], rst5 = [];
const time1 = [], time2 = [], time3 = [], time4 = [], time5 = [];

// 初始化
for (var i = 0; i < times; ++i) {
    a.push(Number((Math.random() * 1000000).toFixed(aDigit))); // 6位小数
    b.push(Number((Math.random() * 10000).toFixed(bDigit))); // 4位小数
    if (round) {
        add.push(Decimal.add(a[i], b[i]).toDecimalPlaces(addDigit).toNumber());
        sub.push(Decimal.sub(a[i], b[i]).toDecimalPlaces(subDigit).toNumber());
        mul.push(Decimal.mul(a[i], b[i]).toDecimalPlaces(mulDigit).toNumber());
        div.push(Decimal.div(a[i], b[i]).toDecimalPlaces(divDigit).toNumber());
    } else {
        add.push(Decimal.add(a[i], b[i]).toNumber());
        sub.push(Decimal.sub(a[i], b[i]).toNumber());
        mul.push(Decimal.mul(a[i], b[i]).toNumber());
        div.push(Decimal.div(a[i], b[i]).toNumber());
    }
    //assert(Number(Decimal.div(50.25, 30.123).toFixed(defaultDigit)) === 1.668161);
}

// 获取运行时间
const testTime = function (fun) {
    const time = new Date();
    fun();
    return new Date() - time;
};
// 统计答案不同的个数
const countDiff = function (base, compare) {
    var count = 0;
    for (var i = 0, iLen = base.length; i < iLen; ++i) {
        if (base[i] !== compare[i]) {
            count++;
        }
    }
    return count;
};

const testAdd = function () {
    time1.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                add1.push(Number((a[i] + b[i]).toFixed(addDigit)));
            } else {
                add1.push(a[i] + b[i]);
            }
        }
    }));
    rst1.push(countDiff(add, add1));
    time2.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                add2.push(np.round(np.plus(a[i], b[i]), addDigit));
            } else {
                add2.push(np.plus(a[i], b[i]));
            }
        }
    }));
    rst2.push(countDiff(add, add2));
    time3.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                add3.push(Number(accCalc.roundnum(accCalc.accAdd(a[i], b[i]), addDigit)));
            } else {
                add3.push(accCalc.accAdd(a[i], b[i]));
            }
        }
    }));
    rst3.push(countDiff(add, add3));
    time4.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                add4.push(baseCalc.round(baseCalc.add(a[i], b[i]), addDigit));
            } else {
                add4.push(baseCalc.add(a[i], b[i]));
            }
        }
    }));
    rst4.push(countDiff(add, add4));
    time5.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                add5.push(Decimal.add(a[i], b[i]).toDecimalPlaces(addDigit).toNumber());
            } else {
                add5.push(Decimal.add(a[i], b[i]).toNumber());
            }
        }
    }));
    rst5.push(countDiff(add, add5));
};
const testSub = function () {
    time1.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                sub1.push(Number((a[i] - b[i]).toFixed(subDigit)));
            } else {
                sub1.push(a[i] - b[i]);
            }
        }
    }));
    rst1.push(countDiff(sub, sub1));
    time2.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                sub2.push(np.round(np.minus(a[i], b[i]), subDigit));
            } else {
                sub2.push(np.minus(a[i], b[i]));
            }
        }
    }));
    rst2.push(countDiff(sub, sub2));
    time3.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                sub3.push(Number(accCalc.roundnum(accCalc.accSub(b[i], a[i]), subDigit)));
            } else {
                sub3.push(accCalc.accSub(b[i], a[i]));
            }
        }
    }));
    rst3.push(countDiff(sub, sub3));
    time4.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                sub4.push(baseCalc.round(baseCalc.sub(a[i], b[i]), subDigit));
            } else {
                sub4.push(baseCalc.sub(a[i], b[i]));
            }
        }
    }));
    rst4.push(countDiff(sub, sub4));
    time5.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                sub5.push(Decimal.sub(a[i], b[i]).toDecimalPlaces(subDigit).toNumber());
            } else {
                sub5.push(Decimal.sub(a[i], b[i]).toNumber());
            }
        }
    }));
    rst5.push(countDiff(sub, sub5));
};
const testMul = function () {
    time1.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                mul1.push(Number((a[i] * b[i]).toFixed(mulDigit)));
            } else {
                mul1.push(a[i] * b[i]);
            }
        }
    }));
    rst1.push(countDiff(mul, mul1));
    time2.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                mul2.push(np.round(np.times(a[i], b[i]), mulDigit));
            } else {
                mul2.push(np.times(a[i], b[i]));
            }
        }
    }));
    rst2.push(countDiff(mul, mul2));
    time3.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                mul3.push(Number(accCalc.roundnum(accCalc.accMul(a[i], b[i]), mulDigit)));
            } else {
                mul3.push(accCalc.accMul(a[i], b[i]));
            }
        }
    }));
    rst3.push(countDiff(mul, mul3));
    time4.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                mul4.push(baseCalc.round(baseCalc.mul(a[i], b[i]), mulDigit));
            } else {
                mul4.push(baseCalc.mul(a[i], b[i]));
            }
        }
    }));
    rst4.push(countDiff(mul, mul4));
    time5.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                mul5.push(Decimal.mul(a[i], b[i]).toDecimalPlaces(mulDigit).toNumber());
            } else {
                mul5.push(Decimal.mul(a[i], b[i]).toNumber());
            }
        }
    }));
    rst5.push(countDiff(mul, mul5));
};
const testDiv = function () {
    time1.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                div1.push(Number((a[i] / b[i]).toFixed(divDigit)));
            } else {
                div1.push(a[i] / b[i]);
            }
        }
    }));
    rst1.push(countDiff(div, div1));
    time2.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                div2.push(np.round(np.divide(a[i], b[i]), divDigit));
            } else {
                div2.push(np.divide(a[i], b[i]));
            }
        }
    }));
    rst2.push(countDiff(div, div2));
    time3.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                div3.push(Number(accCalc.roundnum(accCalc.accDiv(a[i], b[i]), divDigit)));
            } else {
                div3.push(accCalc.accDiv(a[i], b[i]));
            }
        }
    }));
    rst3.push(countDiff(div, div3));
    time4.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                div4.push(baseCalc.round(baseCalc.div(a[i], b[i]), divDigit));
            } else {
                div4.push(baseCalc.div(a[i], b[i]));
            }
        }
    }));
    rst4.push(countDiff(div, div4));
    time5.push(testTime(function () {
        for (var i = 0; i < times; ++i) {
            if (round) {
                div5.push(Decimal.div(a[i], b[i]).toDecimalPlaces(divDigit).toNumber());
            } else {
                div5.push(Decimal.div(a[i], b[i]).toNumber());
            }
        }
    }));
    rst5.push(countDiff(div, div5));
};

testAdd();
testSub();
testMul();
testDiv();

console.log('Error Count: ');
console.log('default: ' + rst1);
console.log('number-precision: ' + rst2);
console.log('accCalc: ' + rst3);
console.log('baseCalc: ' + rst4);
console.log('decimal.js: ' + rst5);

console.log('Run Time: ');
console.log('default: ' + time1);
console.log('number-precision: ' + time2);
console.log('accCalc: ' + time3);
console.log('baseCalc: ' + time4);
console.log('decimal.js: ' + time5);

