document.addEventListener('DOMContentLoaded', function () {
    // DOM 元素
    const hanziInput = document.getElementById('hanziInput');
    const queryBtn = document.getElementById('queryBtn');
    const displayElement = document.getElementById('display');

    // 汉字数据存储
    let hanziToSemester = {};
    let isDataLoaded = false;

    // 加载汉字数据
    async function loadHanziData() {
        try {
            const response = await fetch('../assets/data/hanzi-semester.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const semesterData = await response.json();

            // 创建反向映射：汉字 -> 学期
            hanziToSemester = {};
            for (const [semester, characters] of Object.entries(semesterData)) {
                characters.forEach(char => {
                    hanziToSemester[char] = semester;
                });
            }

            isDataLoaded = true;
            console.log('汉字数据加载成功');
        } catch (error) {
            console.error('加载汉字数据失败:', error);
            showResult('数据加载失败，请刷新页面重试', 'error');
        }
    }

    // 查询汉字学期
    function queryHanzi() {
        if (!isDataLoaded) {
            showResult('数据正在加载中，请稍候...', 'error');
            return;
        }

        const inputChar = hanziInput.value.trim();

        // 验证输入
        if (!inputChar) {
            showResult('请输入一个汉字', 'error');
            return;
        }

        if (inputChar.length !== 1) {
            showResult('请只输入一个汉字', 'error');
            return;
        }

        // 验证是否为汉字
        if (!/[\u4e00-\u9fa5]/.test(inputChar)) {
            showResult('请输入有效的汉字', 'error');
            return;
        }

        // 查询汉字
        const semester = hanziToSemester[inputChar];

        if (semester) {
            showResult(`汉字"${inputChar}"在 ${semester} 学习`, 'success');
        } else {
            showResult(`汉字"${inputChar}"不在小学学习范围内，或数据库中暂无记录`, 'not-found');
        }
    }

    // 显示查询结果
    function showResult(message, type) {
        displayElement.innerHTML = '';

        const resultDiv = document.createElement('div');
        resultDiv.className = `query-result ${type}`;

        const icon = getResultIcon(type);
        const resultText = document.createElement('p');
        resultText.innerHTML = `${icon} ${message}`;

        resultDiv.appendChild(resultText);
        displayElement.appendChild(resultDiv);
    }

    // 获取结果图标
    function getResultIcon(type) {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'not-found':
                return '🔍';
            default:
                return 'ℹ️';
        }
    }

    // 事件监听器
    queryBtn.addEventListener('click', queryHanzi);

    // 回车键查询
    hanziInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            queryHanzi();
        }
    });

    // 限制输入为单个字符
    hanziInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value.length > 1) {
            e.target.value = value.slice(-1); // 只保留最后一个字符
        }
    });

    // 清空输入框时恢复初始状态
    hanziInput.addEventListener('input', (e) => {
        if (!e.target.value.trim()) {
            displayElement.innerHTML = '<p>请输入一个汉字，点击查询按钮查看该字在小学哪个学期学习</p>';
        }
    });

    // 页面加载时初始化数据
    loadHanziData();
});
