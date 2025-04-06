// assets/js/script.test.js
import { describe, it, test, expect, vi, beforeEach } from 'vitest';

// 导入脚本
import './script.js';

// 导入符号常量，与产品代码保持一致
const MULTIPLY_SYMBOL = "\u00D7";
const DIVIDE_SYMBOL = "\u00F7";
const ADD_SYMBOL = "\u002B";
const SUBTRACT_SYMBOL = "\u2212";

describe('script.js', () => {
    beforeEach(() => {
        // 重置 DOM
        document.documentElement.removeAttribute('data-theme');
        document.body.innerHTML = '<div id="display"></div>';

        // 模拟 matchMedia
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-color-scheme: dark)',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }));
    });

    it('应该根据系统主题设置页面主题', () => {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        console.log('data-theme:', document.documentElement.getAttribute('data-theme')); // 添加这行

        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('应该正确处理全局错误', () => {
        // 设置 spy 监控 console.error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // 创建一个错误并触发 window.onerror
        const errorEvent = new Error('测试错误');
        window.onerror('测试错误', 'test.js', 1, 1, errorEvent);

        // 验证 console.error 被调用
        expect(consoleSpy).toHaveBeenCalledWith(
            '发生错误：',
            '测试错误',
            '源：',
            'test.js',
            '行号：',
            1,
            '列号：',
            1,
            '错误对象：',
            errorEvent
        );

        // 验证错误信息是否显示在页面上
        expect(document.getElementById('display').textContent).toBe('生成题目时发生错误，请重试');

        // 恢复 console.error
        consoleSpy.mockRestore();
    });
});

// 辅助函数：验证数字范围
function verifyNumberRange(number, max) {
    return number >= 0 && number <= max;
}

// 辅助函数：验证加法题目格式和结果
function verifyAddition(problem, answer, maxValue) {
    const problemPattern = new RegExp(`^(\\d+) ${ADD_SYMBOL} (\\d+) = $`);
    const answerPattern = new RegExp(`^(\\d+) ${ADD_SYMBOL} (\\d+) = (\\d+)$`);

    const problemMatch = problem.match(problemPattern);
    const answerMatch = answer.match(answerPattern);

    if (!problemMatch || !answerMatch) return false;

    const num1 = parseInt(answerMatch[1], 10);
    const num2 = parseInt(answerMatch[2], 10);
    const result = parseInt(answerMatch[3], 10);

    return num1 + num2 === result &&
        result <= maxValue &&
        (num1 % 10 + num2 % 10 >= 10); // 检查进位要求
}

// 辅助函数：验证减法题目格式和结果
function verifySubtraction(problem, answer, maxValue) {
    const problemPattern = new RegExp(`^(\\d+) ${SUBTRACT_SYMBOL} (\\d+) = $`);
    const answerPattern = new RegExp(`^(\\d+) ${SUBTRACT_SYMBOL} (\\d+) = (\\d+)$`);

    const problemMatch = problem.match(problemPattern);
    const answerMatch = answer.match(answerPattern);

    if (!problemMatch || !answerMatch) return false;

    const num1 = parseInt(answerMatch[1], 10);
    const num2 = parseInt(answerMatch[2], 10);
    const result = parseInt(answerMatch[3], 10);

    return num1 - num2 === result &&
        result > 0 &&
        (num1 % 10 - num2 % 10 < 0); // 检查借位要求
}

describe('generateMixedProblems', () => {
    // 测试基本功能
    test('生成正确数量的题目', () => {
        const numProblems = 20;
        const { problems, problemsWithAnswer } = generateMixedProblems(
            numProblems, 100, true, false, false, false, false
        );

        expect(problems.length).toBe(numProblems);
        expect(problemsWithAnswer.length).toBe(numProblems);
    });

    // 测试单一运算符 - 加法
    test('仅加法题目生成', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 100, true, false, false, false, false
        );

        expect(problems.length).toBe(10);
        expect(problemsWithAnswer.length).toBe(10);

        // 验证所有题目都是加法题目
        for (let i = 0; i < problems.length; i++) {
            expect(problems[i]).toContain(ADD_SYMBOL);
            expect(problems[i]).not.toContain(SUBTRACT_SYMBOL);
            expect(problems[i]).not.toContain(MULTIPLY_SYMBOL);
            expect(problems[i]).not.toContain(DIVIDE_SYMBOL);

            // 验证格式和结果
            expect(verifyAddition(problems[i], problemsWithAnswer[i], 100)).toBe(true);
        }
    });

    // 测试单一运算符 - 减法
    test('仅减法题目生成', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 100, false, true, false, false, false
        );

        expect(problems.length).toBe(10);

        // 验证所有题目都是减法题目
        for (let i = 0; i < problems.length; i++) {
            expect(problems[i]).toContain(SUBTRACT_SYMBOL);
            expect(problems[i]).not.toContain(ADD_SYMBOL);
            expect(problems[i]).not.toContain(MULTIPLY_SYMBOL);
            expect(problems[i]).not.toContain(DIVIDE_SYMBOL);

            // 验证格式和结果正确性
            expect(verifySubtraction(problems[i], problemsWithAnswer[i], 100)).toBe(true);
        }
    });

    // 测试单一运算符 - 乘法
    test('仅乘法题目生成', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 100, false, false, true, false, false
        );

        for (let i = 0; i < problems.length; i++) {
            expect(problems[i]).toContain(MULTIPLY_SYMBOL);
            expect(problems[i]).not.toContain(ADD_SYMBOL);
            expect(problems[i]).not.toContain(SUBTRACT_SYMBOL);
            expect(problems[i]).not.toContain(DIVIDE_SYMBOL);

            const [num1, num2] = extractMultiplyOperands(problems[i]);
            expect(num1 >= 2 && num1 <= 9).toBe(true);
            expect(num2 >= 2 && num2 <= 9).toBe(true);
            expect(num1 * num2 <= 100).toBe(true);
        }
    });

    // 测试单一运算符 - 除法
    test('仅除法题目生成', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 100, false, false, false, true, false
        );

        for (let i = 0; i < problems.length; i++) {
            expect(problems[i]).toContain(DIVIDE_SYMBOL);
            expect(problems[i]).not.toContain(ADD_SYMBOL);
            expect(problems[i]).not.toContain(SUBTRACT_SYMBOL);
            expect(problems[i]).not.toContain(MULTIPLY_SYMBOL);

            // 验证除法题目的格式和计算结果
            const [dividend, divisor] = extractDivideOperands(problems[i]);
            expect(dividend <= 100).toBe(true);
            expect(divisor >= 2 && divisor <= 9).toBe(true);
            expect(dividend % divisor === 0).toBe(true);
        }
    });

    // 测试组合运算符 - 加减法
    test('加减法题目生成 - 不带括号', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 100, true, true, false, false, false
        );

        for (let i = 0; i < problems.length; i++) {
            const hasAdd = problems[i].includes(ADD_SYMBOL);
            const hasSubtract = problems[i].includes(SUBTRACT_SYMBOL);

            // 确保只有加减法，没有乘除法
            expect(hasAdd || hasSubtract).toBe(true);
            expect(problems[i]).not.toContain(MULTIPLY_SYMBOL);
            expect(problems[i]).not.toContain(DIVIDE_SYMBOL);

            // 确保没有括号
            expect(problems[i]).not.toContain('(');
            expect(problems[i]).not.toContain(')');
        }
    });

    // 测试组合运算符 - 加减法带括号
    test('加减法题目生成 - 带括号', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 100, true, true, false, false, true
        );

        // 至少有一道题目应该包含括号
        const hasParentheses = problems.some(p => p.includes('(') && p.includes(')'));
        expect(hasParentheses).toBe(true);

        for (let i = 0; i < problems.length; i++) {
            const hasAdd = problems[i].includes(ADD_SYMBOL);
            const hasSubtract = problems[i].includes(SUBTRACT_SYMBOL);

            expect(hasAdd || hasSubtract).toBe(true);
            expect(problems[i]).not.toContain(MULTIPLY_SYMBOL);
            expect(problems[i]).not.toContain(DIVIDE_SYMBOL);
        }
    });

    // 测试其他组合...
    test('加乘法题目生成', () => {
        const { problems } = generateMixedProblems(
            10, 100, true, false, true, false, false
        );

        for (let i = 0; i < problems.length; i++) {
            const hasAdd = problems[i].includes(ADD_SYMBOL);
            const hasMultiply = problems[i].includes(MULTIPLY_SYMBOL);

            expect(hasAdd || hasMultiply).toBe(true);
            expect(problems[i]).not.toContain(SUBTRACT_SYMBOL);
            expect(problems[i]).not.toContain(DIVIDE_SYMBOL);
        }
    });

    // 测试边界情况
    test('边界情况 - 最小问题数量', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            1, 100, true, false, false, false, false
        );

        expect(problems.length).toBe(1);
        expect(problemsWithAnswer.length).toBe(1);
    });

    test('边界情况 - 最大问题数量', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            1000, 100, true, false, false, false, false
        );

        expect(problems.length).toBe(1000);
        expect(problemsWithAnswer.length).toBe(1000);
    });

    test('边界情况 - 最小最大值', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 20, true, false, false, false, false
        );

        for (let i = 0; i < problems.length; i++) {
            const [num1, num2] = extractAdditionOperands(problems[i]);
            expect(num1 + num2 <= 20).toBe(true);
        }
    });

    // 测试答案正确性
    test('答案正确性 - 加法', () => {
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 100, true, false, false, false, false
        );

        for (let i = 0; i < problems.length; i++) {
            const [num1, num2] = extractAdditionOperands(problems[i]);
            const answer = extractAnswer(problemsWithAnswer[i]);

            expect(num1 + num2).toBe(answer);
        }
    });

    // 测试非法输入处理
    test('非法输入 - 空运算符选择', () => {
        // 所有运算符均为 false
        const { problems, problemsWithAnswer } = generateMixedProblems(
            10, 100, false, false, false, false, false
        );

        // 期望返回空数组
        expect(problems.length).toBe(0);
        expect(problemsWithAnswer.length).toBe(0);
    });

    // 辅助函数部分...
    function extractAdditionOperands(problem) {
        const match = problem.match(new RegExp(`^(\\d+) ${ADD_SYMBOL} (\\d+) = $`));
        if (!match) return [0, 0];
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }

    function extractMultiplyOperands(problem) {
        const match = problem.match(new RegExp(`^(\\d+) ${MULTIPLY_SYMBOL} (\\d+) = $`));
        if (!match) return [0, 0];
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }

    function extractDivideOperands(problem) {
        const match = problem.match(new RegExp(`^(\\d+) ${DIVIDE_SYMBOL} (\\d+) = $`));
        if (!match) return [0, 0];
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }

    function extractAnswer(problemWithAnswer) {
        const match = problemWithAnswer.match(/ = (\d+)$/);
        if (!match) return 0;
        return parseInt(match[1], 10);
    }
});