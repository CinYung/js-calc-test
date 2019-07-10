'use strict';

/**
 *
 *
 * @author Mai
 * @date
 * @version
 */

const baseCalc = {
    digitLength: function (num) {
        // 兼容科学计数
        var eSplit = num.toString().split(/[eE]/);
        var len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
        return len > 0 ? len : 0;
    },
    powLength: function (num) {
        var rs = num.toString();
        if (rs.indexOf('+') > 0) {
            return rs.match(/0*$/g).length();
        } else {
            const eSplit = rs.split(/[eE]/);
            const len = Number(eSplit[1]) - this.digitLength(eSplit[0]);
            return len > 0 ? len : 0;
        }
    },
    round: function (num, digit) {
        return Math.round(num * Math.pow(10, digit)) / Math.pow(10, digit);
    },
    add: function (num1, num2) {
        var d1 = this.digitLength(num1), d2 = this.digitLength(num2);
        return this.round(num1 + num2, Math.max(d1, d2));
    },
    sub: function (num1, num2) {
        var d1 = this.digitLength(num1), d2 = this.digitLength(num2);
        return this.round(num1 - num2, Math.max(d1, d2));
    },
    mul: function (num1, num2) {
        var d1 = this.digitLength(num1), d2 = this.digitLength(num2);
        return this.round(num1 * num2, 10);
    },
    div: function (num1, num2) {
        return this.round(num1 / num2, 12);
    }
};

module.exports = baseCalc;