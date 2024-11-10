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
        p.appendChild(document.createTextNode(`加法试题比例: ${additionRatio}`));

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

        // 显示用户输入的参数
        p.textContent = `试题数目: ${number}`;
        p.appendChild(br1);
        p.appendChild(document.createTextNode(`乘法和加减法混合试题的比例: ${multiplyPlusAddRatio}`));

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

    const addButton = document.getElementById('generateAddButton');
    const multiplyButton = document.getElementById('generateMultiplyButton');

    // 添加错误处理
    try {
        if (addButton) {
            addButton.addEventListener('click', displayAddNumber);
        }

        if (multiplyButton) {
            multiplyButton.addEventListener('click', displayMultiplyNumber);
        }

    } catch (error) {
        console.error('添加事件监听器时发生错误:', error);
    }
});
