'use strict';

/**
 * js浮点小数运算结果不精确，原理、测试汇总
 *
 * @author Mai
 * @date
 * @version
 */

/**
 * references
 *
 * https://github.com/camsong/blog/issues/9
 * https://www.runoob.com/w3cnote/js-precision-problem-and-solution.html
 *
 * Api
 * decimal.js mikemcl.github.io/decimal.js
 *
 */

/**
 * theory
 *
 * js使用IEEE 745标准
 * 0.1 + 0.2
 * = 0.00011001100110011001100110011001100110011001100110011010 + 0.0011001100110011001100110011001100110011001100110011010
 * = 0.0100110011001100110011001100110011001100110011001100111
 * = 0.30000000000000004
 *
 * 实际上，0.1.toPrecision(21) = 0.100000000000000005551
 * 但是，因为mantissa固定长度为52位，最多可表示数2^53 = 9007199254740992，对应科学计数尾数为9.007199254740992
 * 这里的长度是16，即使用toPrecision(16)来进行精度运算，超过精度将会凑整处理。
 * 故，0.10000000000000000555.toPrecision(16) = 0.1000000000000000 = 0.1
 *
 * 在 [-(2^53-1), 2^53-1]，所有的整数都可以准确表示，以下只说正整数
 * [2^53, 2^54]之间，只能精确表示偶数
 * [2^54, 2^55]之间，只能精确表示4的倍数
 * ....以此类推
 *
 *
 */

/**
 * solutions
 *
 * 1. number-precision
 *    原理是，将浮点数放大成整数，使用整数运算完毕后，再缩小相应的位数。
 *    已知存在问题：
 *    1.1 number-precision中，对于数字的放大，使用了times而不是float2Fixed
 *        特别的，对于加减法，在计算后，也没有根据计算数的小数位数保留有效位数
 *        导致minus(43223423.23423, 423423) = 42800000.23423004
 *
 * 2. accCalc
 *    number-precision中有部分错误，是因为使用了times而不是float2Fixed，从而导致plus和minus方法出现误差
 *    参考网上大部分使用的改进计算
 *    已知存在问题：
 *    2.1 对于乘法而言，整数运算的安全边界在 [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] 之间。
 *        即[-9007199254740991, 9007199254740991] = [-(Math.pow(2, 53) -1), Math.pow(2. 53) - 1]之间。
 *        对于乘法而言，也使用这种放大方法，例如81232.4242和23424.1144，放大为整数运算，是超过安全边界的(详见theory部分)。
 *
 * 3. baseCalc
 *    直接使用js的浮点运算，对运算结果保留一定位数的小数位数
 *    加减法：根据计算的浮点数的小数位数保留，乘除法：直接保留12位小数
 *
 *
 * 4. 引入bignumber.js/decimal.js/big.js等包来解决
 *    实际原理，将数字转化为字符串，模拟实际运算过程，但是计算效率会下降。
 */

/**
 * target
 * 项目中，最多可以保留6位小数，并且大量使用乘法（数量(6)×单价(4)）
 *
 * test-plan
 * 1. 测试已知的计算结果的大数
 * 2. 测试十万条数据进行运算，所需时间
 *
 * test-result
 * 1. 只有decimal的结果一定正确
 *
 * 2 基于1的测试结果，认为decimal的计算结果准确性更高，且不受大数影响，2的测试误差以decimal的结果为基准
 * 2.1  对于6位(小于10万)和4位(小于千)，计算10万次
 * 2.1.1 不保留小数位数的结果
 * default      np              accCalc         baseCalc        decimal.js
 * 2(24801)     438(21275)      237(0)          170(0)          414
 * 3(26072)     443(21275)      200(100000)     189(0)          366
 * 3(34942)     325(25863)      236(25863)      174(37952)      494
 * 3(34631)     498(36738)      205(36738)      10(96000)       985
 *
 * 2.1.2 保留6/6/4/4(+/-/×/÷)位小数：
 * 对于结果舍入后的计算结果而言，加减法、除法不产生误差
 * 加减除法测试多次，均未出现误差，只有乘法固定出现误差（不超过10，其中一次误差个数为1、1、3、3）
 * default  np      accCalc     baseCalc    decimal.js
 * 40       926     292         184         439
 * 44       966     329         181         421
 * 43       755     552         167         432
 * 43       945     535         16          957
 * PS：由于每次产生的随机数不同，此处仅为某次计算时间。其中由于accCalc中的四舍五入存在大量问题，记录了两次测试时间，第二次使用baseCalc.round进行四舍五入
 * 计算时间分别是 1、20+、7-13、5、10-23
 *
 * 2.2 为了防止以后对于精度有更高的要求，扩大精度要求，对8位(小于百万)和6位(小于万)，计算10万次
 * 2.2.1 不保留小数位数的结果
 * default      np              accCalc         baseCalc        decimal.js
 * 2(24842)     492(9414)       237(0)          170(0)          385
 * 4(26580)     462(10417)      200(100000)     189(0)          455
 * 3(34728)     277(26241)      236(26241)      174(37812)      428
 * 8(34697)     291(36737)      205(28864)      6(95898)        1057
 *
 * 2.2.2 并保留8/8/6/6(+/-/×/÷)位小数:
 * 加减乘除都出现了误差
 * 测试多次后，加减除法无误差，乘法出现误差，误差率保持在15％-21％之间（其中一次为 15942/18508/17695/20457）
 * default  np      accCalc     baseCalc    decimal.js
 * 45       931     316         173         436
 * 43       940     319         197         437
 * 48       850     500         191         443
 * 43       1011    542         9           896
 * 计算时间跟之前差距不大。
 * 乘法出现误差的原因是，结果的精度超过16位，被取整处理
 *
 * result
 * 1. 所有计算，均应提供(num1, num2, digit)三个参数，其中digit默认参数为6位(当前项目允许的最大小数位数)
 * 2. 加减法：在不舍入的情况下，baseCalc计算均不出错，且耗时最低，先阶段采用baseCalc
 * 3. 乘除法：使用decimal.js
 *
 */

require('./src/test-num.js');
require('./src/test-time.js');