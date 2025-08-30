// 内容发布相关功能

// 使用全局的currentUser变量，不再重复声明

// 初始化函数，在页面加载时调用
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    initPageSpecificFunctions();
});

// 检查用户登录状态
function checkUserLogin() {
    // 从 localStorage 获取用户信息
    const userData = localStorage.getItem('currentUser');
    
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
        } catch (error) {
            console.error('解析用户数据失败:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

// 初始化页面特定功能
function initPageSpecificFunctions() {
    // 检查当前页面并初始化相应功能
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('create-post.html')) {
        initCreatePostForm();
    } else if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
        // 登录/注册页面的功能已在 auth.js 中处理
        return;
    } else {
        // 其他页面的通用功能
        loadContent();
    }
}

// 初始化创建帖子表单
function initCreatePostForm() {
    const createPostForm = document.getElementById('createPostForm');
    
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }
    
    // 检查用户是否登录，如果未登录则重定向到登录页面
    if (!currentUser) {
        alert('请先登录才能发布内容');
        window.location.href = 'login.html';
    }
}

// 处理创建内容
function handleCreatePost(e) {
    e.preventDefault();
    
    const contentType = document.getElementById('content-type').value;
    const title = document.getElementById('post-title').value;
    const category = document.getElementById('post-category').value;
    const content = document.getElementById('post-content').value;
    const links = document.getElementById('post-links').value;
    
    // 简单的客户端验证
    if (!title || !category || !content) {
        showNotification('请填写完整的内容信息', 'error');
        return;
    }
    
    // 获取现有内容数据
    const localStorageData = JSON.parse(localStorage.getItem('posts')) || {};
    const posts = localStorageData.posts || [];
    
    // 创建新内容
    const newPost = {
        id: Date.now().toString(),
        title,
        category,
        content,
        links: links ? links.split(',').map(link => link.trim()).filter(link => link) : [],
        contentType: contentType,
        author: {
            id: currentUser.id,
            username: currentUser.username,
            avatar: currentUser.avatar // 添加头像信息
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        likedBy: [],
        comments: []
    };
    
    // 保存内容数据
    posts.unshift(newPost); // 添加到数组开头
    localStorage.setItem('posts', JSON.stringify({ posts: posts }));
    
    // 显示成功消息
    showNotification('内容发布成功！', 'success');
    
    // 延迟跳转到首页
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// 加载内容
function loadContent() {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) return;
    
    // 获取本地存储的内容
    const localStorageData = JSON.parse(localStorage.getItem('posts')) || {};
    const storedPosts = localStorageData.posts || [];
    
    // 如果没有用户创建的内容，显示提示信息
    if (storedPosts.length === 0) {
        contentGrid.innerHTML = `
            <div class="no-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px;">
                <h3 style="margin-bottom: 10px; font-size: 24px;">暂无内容</h3>
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 30px;">
                    <p style="margin: 0;">还没有人发布内容，快来成为第一个发布者吧！</p>
                    <a href="create-post.html" class="btn-primary" style="margin: 0;">发布内容</a>
                </div>
            </div>
        `;
        return;
    }
    
    let contentToLoad = storedPosts;
    
    // 清空内容网格
    contentGrid.innerHTML = '';
    
    // 添加内容卡片
    contentToLoad.forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        
        // 生成内容缩略图
        const excerpt = item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content;
        const bgColor = getRandomColor();
        const textColor = getContrastColor(bgColor);
        
        card.innerHTML = `
            <div class="content-image">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><rect width='400' height='200' fill='${encodeURIComponent(bgColor)}'/><text x='200' y='100' font-size='20' text-anchor='middle' fill='${encodeURIComponent(textColor)}'>${encodeURIComponent(item.category)}</text></svg>" alt="${item.title}">
            </div>
            <div class="content-info">
                <span class="content-category">${item.category}</span>
                <h3 class="content-title">${item.title}</h3>
                <p class="content-excerpt">${excerpt}</p>
                ${item.links && item.links.length > 0 ? `
                <div class="content-links">
                    <span class="links-label">相关链接:</span>
                    ${item.links.slice(0, 3).map(link => 
                        `<a href="${link}" target="_blank" class="link-item">${new URL(link).hostname}</a>`
                    ).join('')}
                    ${item.links.length > 3 ? `<span class="more-links">+${item.links.length - 3}更多</span>` : ''}
                </div>
                ` : ''}
                <div class="content-meta">
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="${item.author.avatar || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='${encodeURIComponent(bgColor)}'/><circle cx='50' cy='40' r='10' fill='white'/><path d='M30,70 Q50,90 70,70' fill='white' stroke='white' stroke-width='4'/></svg>`}" alt="${item.author.username}">
                        </div>
                        <span class="username">${item.author.username}</span>
                    </div>
                    <div class="content-stats">
                        <span><i>👁</i> ${item.views || 0}</span>
                        <span><i>👍</i> ${item.likes || 0}</span>
                        <span><i>💬</i> ${(item.comments || []).length}</span>
                    </div>
                </div>
            </div>
        `;
        
        contentGrid.appendChild(card);
    });
}

// 获取模拟内容数据
function getMockContent() {
    // 生成默认头像的SVG模板
    const getDefaultAvatar = (username) => {
        // 根据用户名生成一个相对一致的背景色
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = Math.floor(Math.abs(hash) % 16777215).toString(16);
        const bgColor = '#' + '000000'.substring(0, 6 - color.length) + color;
        return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='${encodeURIComponent(bgColor)}'/><circle cx='50' cy='40' r='10' fill='white'/><path d='M30,70 Q50,90 70,70' fill='white' stroke='white' stroke-width='4'/></svg>`;
    };
    
    return [
        {
            id: 'mock-1',
            title: '《塞尔达传说：王国之泪》速通技巧分享',
            content: '在《塞尔达传说：王国之泪》中，掌握这些速通技巧可以帮助你更快地通关游戏。首先，合理利用滑翔伞可以大大缩短旅行时间...',
            category: '动作冒险',
            contentType: 'article',
            author: {
                id: 'mock-user-1',
                username: '林克大师',
                avatar: getDefaultAvatar('林克大师')
            },
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            views: 1567,
            likes: 123,
            comments: []
        },
        {
            id: 'mock-2',
            title: '《CS2》最新更新内容解析',
            content: 'V社最近发布了《CS2》重大更新，包括新地图、武器平衡性调整以及性能优化...',
            category: '射击游戏',
            contentType: 'post',
            author: {
                id: 'mock-user-2',
                username: '枪神CS',
                avatar: getDefaultAvatar('枪神CS')
            },
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            views: 2345,
            likes: 210,
            comments: []
        },
        {
            id: 'mock-3',
            title: '《文明7》有望在明年发布，官方透露新特性',
            content: '据Firaxis Games透露，《文明7》正在紧锣密鼓地开发中，预计明年发布。新作将引入全新的外交系统和城市管理机制...',
            category: '策略游戏',
            contentType: 'article',
            author: {
                id: 'mock-user-3',
                username: '文明玩家',
                avatar: getDefaultAvatar('文明玩家')
            },
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            views: 3456,
            likes: 321,
            comments: []
        },
        {
            id: 'mock-4',
            title: '《FIFA 24》生涯模式攻略：如何打造顶级俱乐部',
            content: '在《FIFA 24》的生涯模式中，想要打造一支顶级俱乐部需要注意以下几点：转会策略、青训系统利用、战术体系建设...',
            category: '体育竞技',
            contentType: 'guide',
            author: {
                id: 'mock-user-4',
                username: '足球教练',
                avatar: getDefaultAvatar('足球教练')
            },
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            views: 1890,
            likes: 176,
            comments: []
        }
    ];
}

// 获取随机颜色
function getRandomColor() {
    const colors = [
        '#4a90e2', '#50e3c2', '#b8e986', '#f8e71c',
        '#f5a623', '#d0021b', '#9013fe', '#4a4a4a'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 获取对比色
function getContrastColor(hexColor) {
    // 移除 # 号
    hexColor = hexColor.replace('#', '');
    
    // 转换为 RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 返回黑色或白色作为对比色
    return brightness > 125 ? '#000000' : '#ffffff';
}

// 显示通知消息
function showNotification(message, type = 'info') {
    // 检查是否已有通知元素，如果有则移除
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 设置样式
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    
    // 设置不同类型的背景色
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196f3';
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        
        // 动画结束后移除元素
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 将函数暴露到全局作用域，供其他页面使用
window.checkUserLogin = checkUserLogin;
window.loadContent = loadContent;