'use strict';

const config = {
    production: {
        baseUrl: '/math-test/'
    },
    development: {
        baseUrl: '/'
    }
};

export const getBaseUrl = () => {
    const isProduction = window.location.hostname === 'litiancheng.github.io';
    return isProduction ? config.production.baseUrl : config.development.baseUrl;
};

// 添加自动设置 base 的功能
export const setupBase = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const base = document.createElement('base');
        base.href = getBaseUrl();
        document.head.appendChild(base);
    });
};