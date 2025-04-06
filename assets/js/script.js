'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // 添加到 DOMContentLoaded 事件开始处
    function setThemeBasedOnSystem() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    // 初始设置主题
    setThemeBasedOnSystem();

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemeBasedOnSystem);

    // 全局错误处理函数
    window.onerror = function (message, source, lineno, colno, error) {
        console.error('发生错误：', message, '源：', source, '行号：', lineno, '列号：', colno, '错误对象：', error);
        document.getElementById('display').textContent = '生成题目时发生错误，请重试';
        return true;
    };

    // 显示生成的数学题目
    function displayAddNumber() {
        // 获取用户输入的参数
        const threeNumberRatio = parseFloat(document.getElementById('threeNumberRatio').value);
        const threeNumberAdditionRatio = parseFloat(document.getElementById('threeNumberAdditionRatio').value);
        const threeNumberParenthesesRatio = parseFloat(document.getElementById('threeNumberParenthesesRatio').value);
        const additionRatio = parseFloat(document.getElementById('additionRatio').value);
        const input = document.getElementById('numberInput').value;
        const number = parseInt(input, 10);

        // 输入验证
        if (!/^\d+$/.test(input)) {
            document.getElementById('display').textContent = '请输入1 ~ 1000的正整数';
            return;
        }

        if (number > 1000) {
            document.getElementById('display').textContent = '为了保证性能，试题数目不能超过1000';
            return;
        }

        if (isNaN(number) || number <= 0) {
            document.getElementById('display').textContent = '输入的试题数目要大于0';
            return;
        }

        if (isNaN(additionRatio) || additionRatio < 0 || additionRatio > 1) {
            document.getElementById('display').textContent = '加法试题比例应该在0到1之间';
            return;
        }

        // 清空并准备显示区域
        const displayElement = document.getElementById('display');
        displayElement.textContent = '';
        const p = document.createElement('p');

        // 创建换行元素
        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        const br3 = document.createElement('br');
        const br4 = document.createElement('br');

        // 显示用户输入的参数
        p.textContent = `试题数目: ${number}`;
        p.appendChild(br1);
        p.appendChild(document.createTextNode(`3个数试题比例: ${threeNumberRatio}`));
        p.appendChild(br2);
        p.appendChild(document.createTextNode(`3个数试题中加法的比例: ${threeNumberAdditionRatio}`));
        p.appendChild(br3);
        p.appendChild(document.createTextNode(`3个数试题中加括号的比例: ${threeNumberParenthesesRatio}`));
        p.appendChild(br4);
        p.appendChild(document.createTextNode(`2个数试题中加法题比例: ${additionRatio}`));

        displayElement.appendChild(p);

        // 生成并显示数学题目
        let problems = generateAddProblems(number, threeNumberRatio, threeNumberAdditionRatio, threeNumberParenthesesRatio, additionRatio);
        const ul = document.createElement('ul');
        problems.forEach(problem => {
            const li = document.createElement('li');
            li.textContent = problem;
            ul.appendChild(li);
        });
        displayElement.appendChild(ul);
    }

    // 显示生成的数学题目
    function displayMultiplyNumber() {
        // 获取用户输入的参数
        const multiplyPlusAddRatio = parseFloat(document.getElementById('multiplyPlusAddRatio').value);
        const addRatio = parseFloat(document.getElementById('addRatio').value);
        const input = document.getElementById('numberInput').value;
        const number = parseInt(input, 10);

        // 输入验证
        if (!/^\d+$/.test(input)) {
            document.getElementById('display').textContent = '试题数目：请输入1 ~ 1000的正整数';
            return;
        }

        if (number > 1000) {
            document.getElementById('display').textContent = '试题数目：为了保证性能，试题数目不能超过1000';
            return;
        }

        if (isNaN(number) || number <= 0) {
            document.getElementById('display').textContent = '试题数目：输入的试题数目要大于0';
            return;
        }

        if (isNaN(multiplyPlusAddRatio) || multiplyPlusAddRatio < 0 || multiplyPlusAddRatio > 1) {
            document.getElementById('display').textContent = '乘法和加减法混合试题的比例应该在0到1之间';
            return;
        }

        if (isNaN(addRatio) || addRatio < 0 || addRatio > 1) {
            document.getElementById('display').textContent = '混合试题种加法的比例应该在0到1之间';
            return;
        }

        // 清空并准备显示区域
        const displayElement = document.getElementById('display');
        displayElement.textContent = '';
        const p = document.createElement('p');

        // 创建换行元素
        const br1 = document.createElement('br');
        const br2 = document.createElement('br');

        // 显示用户输入的参数
        p.textContent = `试题数目: ${number}`;
        p.appendChild(br1);
        p.appendChild(document.createTextNode(`乘法和加减法混合试题的比例: ${multiplyPlusAddRatio}`));
        p.appendChild(br2);
        p.appendChild(document.createTextNode(`混合试题种加法试题的比例: ${addRatio}`))

        displayElement.appendChild(p);

        // 生成并显示数学题目
        let problems = generateMultiplyProblems(number, multiplyPlusAddRatio, addRatio);
        const ul = document.createElement('ul');
        problems.forEach(problem => {
            const li = document.createElement('li');
            li.textContent = problem;
            ul.appendChild(li);
        });
        displayElement.appendChild(ul);
    }

    // 生成数学题目
    function generateAddProblems(count, threeNumberRatio, threeNumberAdditionRatio, threeNumberParenthesesRatio, twoNumberAdditionRatio) {
        // 计算三个数和两个数的题目数量
        const threeNumberCount = Math.floor(count * threeNumberRatio);
        const twoNumberCount = count - threeNumberCount;

        // 计算两个数题目中加法和减法的数量
        const additionCount = Math.floor(twoNumberCount * twoNumberAdditionRatio);
        const subtractionCount = twoNumberCount - additionCount;

        const twoNumProblems = [];
        // 生成两个数的加法题目
        for (let i = 0; i < additionCount; i++) {
            let num1, num2;
            do {
                num1 = Math.floor(Math.random() * 100);
                num2 = Math.floor(Math.random() * 100);
            } while (num1 + num2 >= 100 || (num1 % 10 + num2 % 10) < 10);
            twoNumProblems.push(`${num1} + ${num2} = `);
        }

        // 生成两个数的减法题目
        for (let i = 0; i < subtractionCount; i++) {
            let num1, num2;
            do {
                num1 = Math.floor(Math.random() * 100);
                num2 = Math.floor(Math.random() * 100);
            } while (num1 - num2 <= 0 || (num1 % 10 - num2 % 10) >= 0);
            twoNumProblems.push(`${num1} - ${num2} = `);
        }

        let problems = shuffleArray(twoNumProblems)

        const threeNumProblems = [];
        // 生成三个数的题目
        for (let i = 0; i < threeNumberCount; i++) {
            let num1, num2, num3;
            const firstIsAddition = Math.random() < threeNumberAdditionRatio;
            const secondIsAddition = Math.random() < threeNumberAdditionRatio;
            const hasParentheses = Math.random() < threeNumberParenthesesRatio;

            // 根据不同的运算符组合生成题目
            // 判断条件总结：
            // 1. 结果不能大于等于100或小于0
            // 2. 个位数相加不能小于10（确保进位）
            // 3. 个位数相减不能大于等于0（确保借位）
            // 4. 对于带括号的题目，还需考虑括号内计算的结果
            if (firstIsAddition && secondIsAddition) {
                if (hasParentheses) {
                    do {
                        num1 = Math.floor(Math.random() * 100);
                        num2 = Math.floor(Math.random() * 100);
                        num3 = Math.floor(Math.random() * 100);
                    } while ((num1 + num2 + num3 >= 100)
                    || (num2 % 10 + num3 % 10) < 10
                        || ((num2 + num3) % 10 + num1 % 10) < 10);
                    threeNumProblems.push(`${num1} + (${num2} + ${num3}) = `);
                }
                else {
                    do {
                        num1 = Math.floor(Math.random() * 100);
                        num2 = Math.floor(Math.random() * 100);
                        num3 = Math.floor(Math.random() * 100);
                    } while ((num1 + num2 + num3 >= 100)
                    || (num1 % 10 + num2 % 10) < 10
                        || ((num1 + num2) % 10 + num3 % 10) < 10);
                    threeNumProblems.push(`${num1} + ${num2} + ${num3} = `);
                }
            }
            else if (firstIsAddition && !secondIsAddition) {
                if (hasParentheses) {
                    do {
                        num1 = Math.floor(Math.random() * 100);
                        num2 = Math.floor(Math.random() * 100);
                        num3 = Math.floor(Math.random() * 100);
                    } while (((num1 + num2 - num3) >= 100)
                    || (num2 - num3 < 0)
                    || ((num2 % 10 - num3 % 10) >= 0)
                        || (((num2 - num3) % 10 + num1 % 10) < 10));
                    threeNumProblems.push(`${num1} + (${num2} - ${num3}) = `);
                }
                else {
                    do {
                        num1 = Math.floor(Math.random() * 100);
                        num2 = Math.floor(Math.random() * 100);
                        num3 = Math.floor(Math.random() * 100);
                    } while ((num1 + num2 >= 100)
                    || (num1 + num2 - num3 < 0)
                    || ((num1 % 10 + num2 % 10) < 10)
                        || ((num1 + num2) % 10 - num3 % 10) >= 0);
                    threeNumProblems.push(`${num1} + ${num2} - ${num3} = `);
                }
            }
            else if (!firstIsAddition && secondIsAddition) {
                if (hasParentheses) {
                    do {
                        num1 = Math.floor(Math.random() * 100);
                        num2 = Math.floor(Math.random() * 100);
                        num3 = Math.floor(Math.random() * 100);
                    } while ((num1 - num2 - num3 >= 100)
                    || (num2 + num3 >= 100)
                    || (num1 - num2 - num3 < 0)
                    || ((num2 % 10 + num3 % 10) < 10)
                        || (num1 % 10 - (num2 + num3) % 10 >= 0));
                    threeNumProblems.push(`${num1} - (${num2} + ${num3}) = `);
                }
                else {
                    do {
                        num1 = Math.floor(Math.random() * 100);
                        num2 = Math.floor(Math.random() * 100);
                        num3 = Math.floor(Math.random() * 100);
                    } while ((num1 - num2 + num3 >= 100)
                    || (num1 - num2 < 0)
                    || ((num1 % 10 - num2 % 10) >= 0)
                        || ((num1 - num2) % 10 + num3 % 10 < 10));
                    threeNumProblems.push(`${num1} - ${num2} + ${num3} = `);
                }
            }
            else {
                if (hasParentheses) {
                    do {
                        num1 = Math.floor(Math.random() * 100);
                        num2 = Math.floor(Math.random() * 100);
                        num3 = Math.floor(Math.random() * 100);
                    } while ((num1 - num2 + num3 >= 100)
                    || (num2 - num3 < 0)
                    || (num1 - num2 + num3 < 0)
                    || ((num2 % 10 - num3 % 10) >= 0)
                        || ((num1 % 10 - (num2 - num3) % 10) >= 0));
                    threeNumProblems.push(`${num1} - (${num2} - ${num3}) = `);
                }
                else {
                    do {
                        num1 = Math.floor(Math.random() * 100);
                        num2 = Math.floor(Math.random() * 100);
                        num3 = Math.floor(Math.random() * 100);
                    } while ((num1 - num2 - num3 >= 100)
                    || num1 - num2 - num3 < 0
                    || (num1 % 10 - num2 % 10) >= 0
                        || (num1 - num2) % 10 - num3 % 10 >= 0);
                    threeNumProblems.push(`${num1} - ${num2} - ${num3} = `);
                }
            }
        }
        let shuffledthreeNumProblems = shuffleArray(threeNumProblems);

        // 合并两个数和三个数的题目
        problems = problems.concat(shuffledthreeNumProblems);

        // 返回打乱顺序后的题目
        return shuffleArray(problems);
    }

    // 生成乘法数学题目
    function generateMultiplyProblems(count, multiplyPlusAddRatio, addRatio) {
        const MULTIPLY_SYMBOL = '×'; // 或 '·' 或 '&times;'

        // 计算乘法加减法混合试题的数量
        const multiplyPlusAddCount = Math.floor(count * multiplyPlusAddRatio);
        const multiplyCount = count - multiplyPlusAddCount;

        // 计算加减法的比例
        const additionCount = Math.floor(multiplyPlusAddCount * addRatio);
        const subtractionCount = multiplyPlusAddCount - additionCount;

        let multiplyProblems = [];
        // 生成两个数的乘法题目
        for (let i = 0; i < multiplyCount; i++) {
            let num1 = Math.floor(Math.random() * 8) + 2;
            let num2 = Math.floor(Math.random() * 8) + 2;
            multiplyProblems.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} = `);
        }

        // 生成乘法混合加法题目
        let hybridProblems = [];
        for (let i = 0; i < additionCount; i++) {
            let num1, num2, num3;
            do {
                num1 = Math.floor(Math.random() * 8) + 2;
                num2 = Math.floor(Math.random() * 8) + 2;
                num3 = Math.floor(Math.random() * 100);
            } while (num1 * num2 + num3 >= 100 || (num1 * num2) % 10 + num3 % 10 < 10);
            hybridProblems.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} + ${num3} = `);
        }

        for (let i = 0; i < subtractionCount; i++) {
            let num1, num2, num3;
            do {
                num1 = Math.floor(Math.random() * 8) + 2;
                num2 = Math.floor(Math.random() * 8) + 2;
                num3 = Math.floor(Math.random() * 100);
            } while (num1 * num2 - num3 < 0 || (num1 * num2) % 10 - num3 % 10 >= 0);
            hybridProblems.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} - ${num3} = `);
        }

        hybridProblems = shuffleArray(hybridProblems)

        // 合并两个数和三个数的题目
        multiplyProblems = multiplyProblems.concat(hybridProblems);

        // 返回打乱顺序后的题目
        return multiplyProblems;
    }

    // 打乱数组顺序的函数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 生成加减乘除混合数学题目
    function generateMixedProblems(NumProblems, maxValue, addOps, subOps, mulOps, divOps, braOps) {
        const MULTIPLY_SYMBOL = "\u00D7"; // 或 '·' 或 '&times;'
        const DIVIDE_SYMBOL = "\u00F7"; // 或 '/' 或 '&divide;'
        const ADD_SYMBOL = "\u002B"; // 或 '&plus;'
        const SUBTRACT_SYMBOL = "\u2212"; // 或 '&minus;'

        const MIN_MULTIPLIER = 2;
        const MAX_MULTIPLIER = 9;

        // 对选中的运算符随机生成执行顺序
        let Problems = [];
        let ProblemsWithAnswer = [];
        for (let i = 0; i < NumProblems; i++) {
            if (addOps && !subOps && !mulOps && !divOps) {
                // 仅加法题目
                let num1, num2;
                do {
                    num1 = Math.floor(Math.random() * maxValue);
                    num2 = Math.floor(Math.random() * maxValue);
                } while (num1 + num2 > maxValue || (num1 % 10 + num2 % 10) < 10);
                Problems.push(`${num1} ${ADD_SYMBOL} ${num2} = `);
                ProblemsWithAnswer.push(`${num1} ${ADD_SYMBOL} ${num2} = ${num1 + num2}`);
            } else if (!addOps && subOps && !mulOps && !divOps) {
                // 仅减法题目
                let num1, num2;
                do {
                    num1 = Math.floor(Math.random() * maxValue);
                    num2 = Math.floor(Math.random() * maxValue);
                } while (num1 - num2 <= 0 || (num1 % 10 - num2 % 10) >= 0);
                Problems.push(`${num1} ${SUBTRACT_SYMBOL} ${num2} = `);
                ProblemsWithAnswer.push(`${num1} ${SUBTRACT_SYMBOL} ${num2} = ${num1 - num2}`);
            } else if (!addOps && !subOps && mulOps && !divOps) {
                // 仅乘法题目
                let num1, num2;
                do {
                    num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                    num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                } while (num1 * num2 > maxValue);
                Problems.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} = `);
                ProblemsWithAnswer.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} = ${num1 * num2}`);
            } else if (!addOps && !subOps && !mulOps && divOps) {
                // 仅除法题目
                let num1, num2;
                do {
                    num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                    num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                } while (num1 * num2 > maxValue);
                Problems.push(`${num1 * num2} ${DIVIDE_SYMBOL} ${num2} = `);
                ProblemsWithAnswer.push(`${num1 * num2} ${DIVIDE_SYMBOL} ${num2} = ${num1}`);
            } else if (addOps && subOps && !mulOps && !divOps) {
                // 仅加减法题目
                let num1, num2, num3;
                if (Math.random() < 0.5) {
                    if (braOps) {
                        do {
                            num1 = Math.floor(Math.random() * maxValue);
                            num2 = Math.floor(Math.random() * maxValue);
                            num3 = Math.floor(Math.random() * maxValue);
                        } while (((num1 + num2 - num3) > maxValue)
                        || (num2 - num3 < 0)
                        || ((num2 % 10 - num3 % 10) >= 0)
                            || (((num2 - num3) % 10 + num1 % 10) < 10));
                        Problems.push(`${num1} ${ADD_SYMBOL} (${num2} ${SUBTRACT_SYMBOL} ${num3}) = `);
                        ProblemsWithAnswer.push(`${num1} ${ADD_SYMBOL} (${num2} ${SUBTRACT_SYMBOL} ${num3}) = ${num1 + (num2 - num3)}`);
                    } else {
                        do {
                            num1 = Math.floor(Math.random() * maxValue);
                            num2 = Math.floor(Math.random() * maxValue);
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num1 + num2 > maxValue)
                        || (num1 + num2 - num3 < 0)
                        || ((num1 % 10 + num2 % 10) < 10)
                            || ((num1 + num2) % 10 - num3 % 10) >= 0);
                        Problems.push(`${num1} ${ADD_SYMBOL} ${num2} ${SUBTRACT_SYMBOL} ${num3} = `);
                        ProblemsWithAnswer.push(`${num1} ${ADD_SYMBOL} ${num2} ${SUBTRACT_SYMBOL} ${num3} = ${num1 + num2 - num3}`);
                    }
                } else {
                    if (braOps) {
                        do {
                            num1 = Math.floor(Math.random() * maxValue);
                            num2 = Math.floor(Math.random() * maxValue);
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num2 + num3 > maxValue)
                        || (num1 - num2 - num3 < 0)
                        || ((num2 % 10 + num3 % 10) < 10)
                            || (num1 % 10 - (num2 + num3) % 10 >= 0));
                        Problems.push(`${num1} ${SUBTRACT_SYMBOL} (${num2} ${ADD_SYMBOL} ${num3}) = `);
                        ProblemsWithAnswer.push(`${num1} ${SUBTRACT_SYMBOL} (${num2} ${ADD_SYMBOL} ${num3}) = ${num1 - (num2 + num3)}`);
                    } else {
                        do {
                            num1 = Math.floor(Math.random() * maxValue);
                            num2 = Math.floor(Math.random() * maxValue);
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num1 - num2 + num3 > maxValue)
                        || (num1 - num2 < 0)
                        || ((num1 % 10 - num2 % 10) >= 0)
                            || ((num1 - num2) % 10 + num3 % 10 < 10));
                        Problems.push(`${num1} ${SUBTRACT_SYMBOL} ${num2} ${ADD_SYMBOL} ${num3} = `);
                        ProblemsWithAnswer.push(`${num1} ${SUBTRACT_SYMBOL} ${num2} ${ADD_SYMBOL} ${num3} = ${num1 - num2 + num3}`);
                    }
                }
            } else if (addOps && !subOps && mulOps && !divOps) {
                // 仅加乘法题目
                let num1, num2, num3;
                if (braOps) {
                    do {
                        num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num2 = Math.floor(Math.random() * 9) + 1;
                        num3 = Math.floor(Math.random() * 9) + 1;
                    } while ((num2 + num3 > 10)
                    || (num1 * (num2 + num3) > maxValue)
                        || (num1 * (num2 + num3) < 10));
                    if (Math.random() < 0.5) {
                        Problems.push(`${num1} ${MULTIPLY_SYMBOL} (${num2} ${ADD_SYMBOL} ${num3}) = `);
                        ProblemsWithAnswer.push(`${num1} ${MULTIPLY_SYMBOL} (${num2} ${ADD_SYMBOL} ${num3}) = ${num1 * (num2 + num3)}`);
                    } else {
                        Problems.push(`(${num2} ${ADD_SYMBOL} ${num3}) ${MULTIPLY_SYMBOL} ${num1} = `);
                        ProblemsWithAnswer.push(`(${num2} ${ADD_SYMBOL} ${num3}) ${MULTIPLY_SYMBOL} ${num1} = ${num1 * (num2 + num3)}`);
                    }
                } else {
                    do {
                        num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num3 = Math.floor(Math.random() * maxValue);
                    } while ((num1 * num2 + num3 > maxValue)
                    || ((num1 * num2) % 10 + num3 % 10 < 10)
                        || (num1 * num2 + num3 < 10));
                    if (Math.random() < 0.5) {
                        Problems.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} ${ADD_SYMBOL} ${num3} = `);
                        ProblemsWithAnswer.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} ${ADD_SYMBOL} ${num3} = ${num1 * num2 + num3}`);
                    } else {
                        Problems.push(`${num3} ${ADD_SYMBOL} ${num1} ${MULTIPLY_SYMBOL} ${num2} = `);
                        ProblemsWithAnswer.push(`${num3} ${ADD_SYMBOL} ${num1} ${MULTIPLY_SYMBOL} ${num2} = ${num1 * num2 + num3}`);
                    }
                }
            } else if (addOps && !subOps && !mulOps && divOps) {
                // 仅加除法题目
                let num1, num2, num3;
                if (braOps) {
                    if (Math.random() < 0.5) {
                        do {
                            num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num2 = Math.floor(Math.random() * 9) + 1;
                            num3 = Math.floor(Math.random() * 9) + 1;
                        } while ((num2 + num3 > 10)
                            || ((num2 + num3) % num1 !== 0));
                        Problems.push(`(${num2} ${ADD_SYMBOL} ${num3}) ${DIVIDE_SYMBOL} ${num1} = `);
                        ProblemsWithAnswer.push(`(${num2} ${ADD_SYMBOL} ${num3}) ${DIVIDE_SYMBOL} ${num1} = ${(num2 + num3) / num1}`);
                    } else {
                        do {
                            num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num2 = Math.floor(Math.random() * 9) + 1;
                            num3 = Math.floor(Math.random() * 9) + 1;
                        } while ((num2 + num3 > 10)
                            || (num1 * (num2 + num3) > maxValue));
                        Problems.push(`${num1 * (num2 + num3)} ${DIVIDE_SYMBOL} (${num2} ${ADD_SYMBOL} ${num3}) = `);
                        ProblemsWithAnswer.push(`${num1 * (num2 + num3)} ${DIVIDE_SYMBOL} (${num2} ${ADD_SYMBOL} ${num3}) = ${num1}`);
                    }
                } else {
                    do {
                        num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num3 = Math.floor(Math.random() * maxValue);
                    } while ((num1 * num2 + num3 > maxValue)
                        || (num1 % 10 + num3 % 10 <= 10));
                    if (Math.random() < 0.5) {
                        Problems.push(`${num1 * num2} ${DIVIDE_SYMBOL} ${num2} ${ADD_SYMBOL} ${num3} = `);
                        ProblemsWithAnswer.push(`${num1 * num2} ${DIVIDE_SYMBOL} ${num2} ${ADD_SYMBOL} ${num3} = ${num1 + num3}`);
                    } else {
                        Problems.push(`${num3} ${ADD_SYMBOL} ${num1 * num2} ${DIVIDE_SYMBOL} ${num2} = `);
                        ProblemsWithAnswer.push(`${num3} ${ADD_SYMBOL} ${num1 * num2} ${DIVIDE_SYMBOL} ${num2} = ${num1 + num3}`);
                    }
                }
            } else if (!addOps && subOps && mulOps && !divOps) {
                // 仅减乘法题目
                let num1, num2, num3;
                if (braOps) {
                    do {
                        num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num2 = Math.floor(Math.random() * 9) + 1;
                        num3 = Math.floor(Math.random() * 9) + 1;
                    } while ((num2 - num3 <= 0)
                        || (num1 * (num2 - num3) > maxValue));
                    if (Math.random() < 0.5) {
                        Problems.push(`${num1} ${MULTIPLY_SYMBOL} (${num2} ${SUBTRACT_SYMBOL} ${num3}) = `);
                        ProblemsWithAnswer.push(`${num1} ${MULTIPLY_SYMBOL} (${num2} ${SUBTRACT_SYMBOL} ${num3}) = ${num1 * (num2 - num3)}`);
                    } else {
                        Problems.push(`(${num2} ${SUBTRACT_SYMBOL} ${num3}) ${MULTIPLY_SYMBOL} ${num1} = `);
                        ProblemsWithAnswer.push(`(${num2} ${SUBTRACT_SYMBOL} ${num3}) ${MULTIPLY_SYMBOL} ${num1} = ${num1 * (num2 - num3)}`);
                    }
                } else {
                    if (Math.random() < 0.5) {
                        do {
                            num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num1 * num2 > maxValue)
                        || (num1 * num2 - num3 <= 0)
                            || ((num1 * num2) % 10 > num3 % 10));
                        Problems.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} ${SUBTRACT_SYMBOL} ${num3} = `);
                        ProblemsWithAnswer.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} ${SUBTRACT_SYMBOL} ${num3} = ${num1 * num2 - num3}`);
                    } else {
                        do {
                            num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num1 * num2 > maxValue)
                        || (num3 - num1 * num2 <= 0)
                            || ((num1 * num2) % 10 < num3 % 10));
                        Problems.push(`${num3} ${SUBTRACT_SYMBOL} ${num1} ${MULTIPLY_SYMBOL} ${num2} = `);
                        ProblemsWithAnswer.push(`${num3} ${SUBTRACT_SYMBOL} ${num1} ${MULTIPLY_SYMBOL} ${num2} = ${num3 - num1 * num2}`);
                    }
                }
            } else if (!addOps && subOps && !mulOps && divOps) {
                // 仅减除法题目
                let num1, num2, num3;
                if (braOps) {
                    if (Math.random() < 0.5) {
                        do {
                            num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num2 = Math.floor(Math.random() * maxValue);
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num2 - num3 > 10)
                        || (num2 - num3 <= 0)
                            || (num1 * (num2 - num3) > maxValue));
                        Problems.push(`${num1 * (num2 - num3)} ${DIVIDE_SYMBOL} (${num2} ${SUBTRACT_SYMBOL} ${num3}) = `);
                        ProblemsWithAnswer.push(`${num1 * (num2 - num3)} ${DIVIDE_SYMBOL} (${num2} ${SUBTRACT_SYMBOL} ${num3}) = ${num1}`);
                    } else {
                        do {
                            num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num2 = Math.floor(Math.random() * maxValue);
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num2 - num3 <= 0)
                        || ((num2 - num3) % num1 !== 0)
                        || ((num2 - num3) / num1 >= 10)
                            || (num2 - num3 === num1));
                        Problems.push(`(${num2} ${SUBTRACT_SYMBOL} ${num3}) ${DIVIDE_SYMBOL} ${num1} = `);
                        ProblemsWithAnswer.push(`(${num2} ${SUBTRACT_SYMBOL} ${num3}) ${DIVIDE_SYMBOL} ${num1} = ${(num2 - num3) / num1}`);
                    }
                } else {
                    if (Math.random() < 0.5) {
                        do {
                            num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num1 * num2 > maxValue)
                        || (num1 - num3 <= 0)
                            || (num3 === 0));
                        Problems.push(`${num1 * num2} ${DIVIDE_SYMBOL} ${num2} ${SUBTRACT_SYMBOL} ${num3} = `);
                        ProblemsWithAnswer.push(`${num1 * num2} ${DIVIDE_SYMBOL} ${num2} ${SUBTRACT_SYMBOL} ${num3} = ${num1 - num3}`);
                    }
                    else {
                        do {
                            num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                            num3 = Math.floor(Math.random() * maxValue);
                        } while ((num1 * num2 > maxValue)
                        || (num3 - num1 <= 0)
                            || (num3 % 10 - num1 % 10 >= 0));
                        Problems.push(`${num3} ${SUBTRACT_SYMBOL} ${num1 * num2} ${DIVIDE_SYMBOL} ${num2} = `);
                        ProblemsWithAnswer.push(`${num3} ${SUBTRACT_SYMBOL} ${num1 * num2} ${DIVIDE_SYMBOL} ${num2} = ${num3 - num1}`);
                    }
                }
            } else if (!addOps && !subOps && mulOps && divOps) {
                // 仅乘除法题目
                let num1, num2, num3;
                if (braOps) {
                    do {
                        num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num3 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                    } while ((num2 * num3 > maxValue)
                        || (num1 * num2 > maxValue));
                    if (Math.random() < 0.5) {
                        Problems.push(`${num1} ${MULTIPLY_SYMBOL} (${num2 * num3} ${DIVIDE_SYMBOL} ${num3}) = `);
                        ProblemsWithAnswer.push(`${num1} ${MULTIPLY_SYMBOL} (${num2 * num3} ${DIVIDE_SYMBOL} ${num3}) = ${num1 * num2}`);
                    } else {
                        Problems.push(`(${num2 * num3} ${DIVIDE_SYMBOL} ${num3}) ${MULTIPLY_SYMBOL} ${num1} = `);
                        ProblemsWithAnswer.push(`(${num2 * num3} ${DIVIDE_SYMBOL} ${num3}) ${MULTIPLY_SYMBOL} ${num1} = ${num1 * num2}`);
                    }
                } else {
                    do {
                        num1 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num2 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                        num3 = Math.floor(Math.random() * (MAX_MULTIPLIER - 1)) + MIN_MULTIPLIER;
                    } while ((num1 * num2 > maxValue)
                    || ((num1 * num2) % num3 !== 0)
                    || (num1 === num3)
                        || (num2 === num3));
                    if (Math.random() < 0.5) {
                        Problems.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} ${DIVIDE_SYMBOL} ${num3} = `);
                        ProblemsWithAnswer.push(`${num1} ${MULTIPLY_SYMBOL} ${num2} ${DIVIDE_SYMBOL} ${num3} = ${num1 * num2 / num3}`);
                    } else {
                        Problems.push(`${num2} ${DIVIDE_SYMBOL} ${num3} ${MULTIPLY_SYMBOL} ${num1} = `);
                        ProblemsWithAnswer.push(`${num2} ${DIVIDE_SYMBOL} ${num3} ${MULTIPLY_SYMBOL} ${num1} = ${num1 * num2 / num3}`);
                    }
                }
            }
        }

        return {
            problems: Problems,
            problemsWithAnswer: ProblemsWithAnswer
        };
    }

    // 显示生成的数学题目
    function displayMixedNumber() {
        // 获取用户输入的参数
        const addOps = document.getElementById('addOperation').checked;
        const subOps = document.getElementById('subtractOperation').checked;
        const mulOps = document.getElementById('multiplyOperation').checked;
        const divOps = document.getElementById('divideOperation').checked;
        const braOps = document.getElementById('bracketOperation').checked;
        const inputNumProblems = document.getElementById('NumProblems').value;
        const inputMaxValue = document.getElementById('maxValue').value;
        const NumProblems = parseInt(inputNumProblems, 10);
        const maxValue = parseInt(inputMaxValue, 10);

        // 输入验证
        if (!/^\d+$/.test(inputNumProblems)) {
            document.getElementById('display').textContent = '试题数目：请输入1 ~ 1000的正整数';
            return;
        }

        if (!/^\d+$/.test(inputMaxValue)) {
            document.getElementById('display').textContent = '试题数目：请输入大于等于20的正整数';
            return;
        }

        if (NumProblems > 1000) {
            document.getElementById('display').textContent = '试题数目：为了保证性能，试题数目不能超过1000';
            return;
        }

        if (isNaN(NumProblems) || NumProblems <= 0) {
            document.getElementById('display').textContent = '试题数目：输入的试题数目要大于0';
            return;
        }

        if (isNaN(maxValue) || maxValue < 20) {
            document.getElementById('display').textContent = '最大数值：计算的最大数值要大于等于20';
            return;
        }

        if (!addOps && !subOps && !mulOps && !divOps) {
            document.getElementById('display').textContent = '加减乘除运算至少要选择1个';
            return;
        }

        let opsCounter = 0;
        if (addOps) opsCounter++;
        if (subOps) opsCounter++;
        if (mulOps) opsCounter++;
        if (divOps) opsCounter++;
        if (opsCounter > 2) {
            document.getElementById('display').textContent = '加减乘除运算最多只能选择2个';
            return;
        }

        // 清空并准备显示区域
        const displayElement = document.getElementById('display');
        displayElement.textContent = '';
        const p = document.createElement('p');

        // 创建换行元素
        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        const br3 = document.createElement('br');
        const br4 = document.createElement('br');
        const br5 = document.createElement('br');
        const br6 = document.createElement('br');
        const br7 = document.createElement('br');
        const br8 = document.createElement('br');

        // 显示用户输入的参数
        p.textContent = `试题数目: ${NumProblems}`;
        p.appendChild(br1);
        p.appendChild(document.createTextNode(`最大数值: ${maxValue}`));
        p.appendChild(br2);
        p.appendChild(document.createTextNode(`加法试题: ${addOps ? '选中' : '未选中'}`));
        p.appendChild(br3);
        p.appendChild(document.createTextNode(`减法试题: ${subOps ? '选中' : '未选中'}`));
        p.appendChild(br4);
        p.appendChild(document.createTextNode(`乘法试题: ${mulOps ? '选中' : '未选中'}`));
        p.appendChild(br5);
        p.appendChild(document.createTextNode(`除法试题: ${divOps ? '选中' : '未选中'}`));
        p.appendChild(br6);
        p.appendChild(document.createTextNode(`试题带括号: ${braOps ? '选中' : '未选中'}`));
        p.appendChild(br7);
        p.appendChild(document.createTextNode(`试题：`));

        displayElement.appendChild(p);

        // 生成并显示数学题目
        const { problems, problemsWithAnswer } = generateMixedProblems(NumProblems, maxValue, addOps, subOps, mulOps, divOps, braOps);

        const ul = document.createElement('ul');
        problems.forEach(problem => {
            const li = document.createElement('li');
            li.textContent = problem;
            ul.appendChild(li);
        });
        displayElement.appendChild(ul);

        // 空一行
        displayElement.appendChild(document.createElement('br'));

        // 输出试题答案标题
        const answerTitle = document.createElement('p');
        answerTitle.textContent = '试题答案：';
        displayElement.appendChild(answerTitle);

        // 输出试题答案列表
        const ulAnswers = document.createElement('ul');
        problemsWithAnswer.forEach(answer => {
            const li = document.createElement('li');
            li.textContent = answer;
            ulAnswers.appendChild(li);
        });
        displayElement.appendChild(ulAnswers);
    }

    const addButton = document.getElementById('generateAddButton');
    const multiplyButton = document.getElementById('generateMultiplyButton');
    const mixedButton = document.getElementById('generateMixedButton');

    // 添加错误处理
    try {
        if (addButton) {
            addButton.addEventListener('click', displayAddNumber);
        }

        if (multiplyButton) {
            multiplyButton.addEventListener('click', displayMultiplyNumber);
        }

        if (mixedButton) {
            mixedButton.addEventListener('click', displayMixedNumber);
        }

    } catch (error) {
        console.error('添加事件监听器时发生错误:', error);
    }
});
