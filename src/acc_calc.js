'use strict';

/**
 *
 *
 * @author Mai
 * @date
 * @version
 */

const accCalc = {
    // 生成num位的0
    makezero: function (num) {
        const arr = new Array(num);
        for (let i = 0; i < num; i++) {
            arr[i] = 0;
        }
        return arr.join('');
    },
    // 生成num位的10倍数
    makemultiple: function (num) {
        return Math.pow(10, parseInt(num));
    },
    accAdd: function (arg1, arg2) {
        let r1;
        let r2;
        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        const c = Math.abs(r1 - r2);
        const m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            const cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace('.', ''));
                arg2 = Number(arg2.toString().replace('.', '')) * cm;
            } else {
                arg1 = Number(arg1.toString().replace('.', '')) * cm;
                arg2 = Number(arg2.toString().replace('.', ''));
            }
        } else {
            arg1 = Number(arg1.toString().replace('.', ''));
            arg2 = Number(arg2.toString().replace('.', ''));
        }
        return (arg1 + arg2) / m;
    },
    accSub: function (arg1,arg2){
        var r1,r2,m,n;
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2));
        //last modify by deeka
        //动态控制精度长度
        n=(r1>=r2)?r1:r2;
        return ((arg2*m-arg1*m)/m).toFixed(n);
    },
    accMul: function (arg1, arg2) {
        let m = 0;
        const s1 = arg1.toString();
        const s2 = arg2.toString();
        try {
            m += s1.split('.')[1] !== undefined ? s1.split('.')[1].length : 0;
        } catch (e) {
            throw e;
        }
        try {
            m += s2.split('.')[1] !== undefined ? s2.split('.')[1].length : 0;
        } catch (e) {
            throw e;
        }
        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
    },
    accDiv: function (arg1,arg2){
        var t1=0,t2=0,r1,r2;
        try{t1=arg1.toString().split(".")[1].length}catch(e){}
        try{t2=arg2.toString().split(".")[1].length}catch(e){}
        r1=Number(arg1.toString().replace(".",""));
        r2=Number(arg2.toString().replace(".",""));
        return (r1/r2)*Math.pow(10,t2-t1);
    },
    roundnum: function (val,decimals){
        if (val !== '') {
            val = parseFloat(val);
            if (decimals < 1) {
                val = (Math.round(val)).toString();
            } else {
                let num = val.toString();
                if (num.lastIndexOf('.') === -1) {
                    num += '.';
                    num += this.makezero(decimals);
                    val = num;
                } else {
                    const valdecimals = num.split('.')[1].length;
                    if (parseInt(valdecimals) < parseInt(decimals)) {
                        num += this.makezero(parseInt(decimals) - parseInt(valdecimals));
                        val = num;
                    } else if (parseInt(valdecimals) > parseInt(decimals)) {
                        val = parseFloat(val) !== 0 ? Math.round(this.accMul(val, this.makemultiple(decimals))) / this.makemultiple(decimals) : this.makedecimalzero(decimals);
                        let num = val.toString();
                        if (num.lastIndexOf('.') === -1) {
                            num += '.';
                            num += this.makezero(decimals);
                            val = num;
                        } else {
                            const valdecimals = num.split('.')[1].length;
                            if (parseInt(valdecimals) < parseInt(decimals)) {
                                num += this.makezero(parseInt(decimals) - parseInt(valdecimals));
                                val = num;
                            }
                        }
                    }
                }
            }
        }
        return val;
    }
};

module.exports = accCalc;