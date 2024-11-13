// assets/js/script.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 导入脚本
import './script.js';

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
