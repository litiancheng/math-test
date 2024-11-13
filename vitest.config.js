// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        // 可以根据需要添加其他配置
    },
})