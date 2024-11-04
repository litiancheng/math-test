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