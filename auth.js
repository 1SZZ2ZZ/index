// 用户认证相关功能

// 存储当前登录的用户信息
let currentUser = null;

// 初始化函数，在页面加载时调用
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    initEventListeners();
    
    // 在页面加载完成后更新所有需要显示的头像
    setTimeout(() => {
        updateAllUserAvatars();
    }, 100);
});

// 初始化事件监听器
function initEventListeners() {
    // 检查是否在登录/注册页面
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logout-btn');
    const createPostBtn = document.getElementById('create-post-btn');
    
    // 登录表单提交事件
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 注册表单提交事件
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // 登出按钮点击事件
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 创建内容按钮点击事件
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!currentUser) {
                alert('请先登录才能发布内容');
                window.location.href = 'login.html';
            } else {
                window.location.href = 'create-post.html';
            }
        });
    }
    

}

// 检查用户登录状态
function checkUserLogin() {
    // 从 localStorage 获取用户信息
    const userData = localStorage.getItem('currentUser');
    
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            updateUILoggedIn();
        } catch (error) {
            console.error('解析用户数据失败:', error);
            localStorage.removeItem('currentUser');
        }
    } else {
        updateUILoggedOut();
    }
}

// 用户登录处理
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // 简单的客户端验证
    if (!email || !password) {
        alert('请填写完整的登录信息');
        return;
    }
    
    // 从 localStorage 获取用户数据
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // 查找匹配的用户
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // 登录成功，保存用户信息到 localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        
        // 显示成功消息
        showNotification('登录成功！', 'success');
        
        // 检查用户是否有头像，如果没有则提示上传
        if (!user.avatar) {
            setTimeout(() => {
                showAvatarUploadPrompt();
            }, 2000);
        }
        
        // 延迟跳转到首页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        // 登录失败
        showNotification('邮箱或密码错误', 'error');
    }
}

// 用户注册处理
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // 简单的客户端验证
    if (!username || !email || !password || !confirmPassword) {
        showNotification('请填写完整的注册信息', 'error');
        return;
    }
    
    // 验证用户名只能包含中文
    const chineseRegex = /^[\u4e00-\u9fa5]+$/;
    if (!chineseRegex.test(username)) {
        showNotification('用户名只能包含中文，不能包含特殊符号或英文', 'error');
        return;
    }
    
    // 检查密码是否一致
    if (password !== confirmPassword) {
        showNotification('两次输入的密码不一致', 'error');
        return;
    }
    
    // 检查是否为网易邮箱
    if (!email.endsWith('@163.com') && !email.endsWith('@126.com') && !email.endsWith('@yeah.net')) {
        showNotification('请使用网易邮箱（@163.com、@126.com、@yeah.net）注册', 'error');
        return;
    }
    

    
    // 获取现有用户数据
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // 检查用户名是否已被注册
    if (users.some(user => user.username === username)) {
        showNotification('该用户名已被注册', 'error');
        return;
    }
    
    // 检查邮箱是否已被注册
    if (users.some(user => user.email === email)) {
        showNotification('该邮箱已被注册', 'error');
        return;
    }
    
    // 创建新用户
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    // 保存用户数据
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    

    
    // 显示成功消息
    showNotification('注册成功！请登录', 'success');
    
    // 延迟跳转到登录页面
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// 登出处理
function handleLogout() {
    // 清除用户信息
    localStorage.removeItem('currentUser');
    currentUser = null;
    
    // 更新 UI
    updateUILoggedOut();
    
    // 显示成功消息
    showNotification('已成功退出登录', 'success');
    
    // 跳转到首页
    window.location.href = 'index.html';
}



// 更新登录状态的 UI
function updateUILoggedIn() {
    // 显示用户信息，隐藏登录/注册按钮
    const userProfile = document.getElementById('user-profile');
    const usernameDisplay = document.getElementById('username-display');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const createPostBtn = document.getElementById('create-post-btn');
    
    if (userProfile) userProfile.classList.remove('hidden');
    if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
    if (loginBtn) loginBtn.classList.add('hidden');
    if (registerBtn) registerBtn.classList.add('hidden');
    if (createPostBtn) createPostBtn.classList.remove('hidden');
    
    // 显示用户头像
    const navbarAvatar = document.getElementById('navbar-avatar');
    const userIcon = document.querySelector('#user-profile i.fa-user');
    
    if (navbarAvatar && userIcon && currentUser && currentUser.avatar) {
        navbarAvatar.src = currentUser.avatar;
        navbarAvatar.style.display = 'block';
        userIcon.style.display = 'none';
    } else if (navbarAvatar && userIcon) {
        navbarAvatar.style.display = 'none';
        userIcon.style.display = 'block';
    }
    
    // 如果是新用户，显示头像上传提示
    if (currentUser && !currentUser.avatar && !localStorage.getItem('avatarPromptShown')) {
        showAvatarUploadPrompt();
        localStorage.setItem('avatarPromptShown', 'true');
    }
    
    // 调用全局头像更新函数，确保所有需要显示头像的地方都能正确加载
    updateAllUserAvatars();
}

// 更新未登录状态的 UI
function updateUILoggedOut() {
    // 隐藏用户信息，显示登录/注册按钮
    const userProfile = document.getElementById('user-profile');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const createPostBtn = document.getElementById('create-post-btn');
    
    if (userProfile) userProfile.classList.add('hidden');
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (registerBtn) registerBtn.classList.remove('hidden');
    if (createPostBtn) createPostBtn.classList.remove('hidden'); // 保留按钮但会在点击时提示登录
}

// 显示头像上传提示
function showAvatarUploadPrompt() {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'avatar-upload-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>欢迎来到MKX！</h3>
            <p>请上传您的头像，让其他用户更好地认识您</p>
            
            <div class="avatar-upload-area" style="margin: 20px 0;">
                <div class="avatar-preview" id="avatarPreview" style="width: 120px; height: 120px; border-radius: 50%; border: 2px dashed #ddd; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
                    <i class="fas fa-user" style="color: #ccc; font-size: 48px;"></i>
                </div>
                <input type="file" id="avatarUploadInput" accept="image/*" style="display: none;">
                <button id="selectAvatarBtn" class="btn-secondary" style="padding: 10px 20px; background-color: #4a90e2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                    <i class="fas fa-upload"></i> 选择图片
                </button>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">支持JPG、PNG、GIF等格式</p>
            </div>
            
            <div class="modal-buttons">
                <button id="confirmUploadBtn" class="btn-primary" disabled style="padding: 12px 24px; background-color: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; opacity: 0.6; cursor: not-allowed;">
                    确认上传
                </button>
                <button id="cancelUploadBtn" class="btn-secondary" style="padding: 12px 24px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                    稍后再说
                </button>
            </div>
        </div>
    `;
    
    // 设置样式
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';
    
    // 模态框内容样式
    const content = modal.querySelector('.modal-content');
    content.style.backgroundColor = 'white';
    content.style.padding = '30px';
    content.style.borderRadius = '12px';
    content.style.textAlign = 'center';
    content.style.maxWidth = '400px';
    content.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
    
    // 标题样式
    content.querySelector('h3').style.margin = '0 0 15px 0';
    content.querySelector('h3').style.color = '#333';
    content.querySelector('h3').style.fontSize = '24px';
    
    // 段落样式
    content.querySelector('p').style.margin = '0 0 25px 0';
    content.querySelector('p').style.color = '#666';
    content.querySelector('p').style.fontSize = '16px';
    content.querySelector('p').style.lineHeight = '1.5';
    
    // 按钮容器样式
    const buttons = content.querySelector('.modal-buttons');
    buttons.style.display = 'flex';
    buttons.style.gap = '15px';
    buttons.style.justifyContent = 'center';
    buttons.style.marginTop = '20px';
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 绑定事件
    const uploadInput = document.getElementById('avatarUploadInput');
    const selectBtn = document.getElementById('selectAvatarBtn');
    const confirmBtn = document.getElementById('confirmUploadBtn');
    const cancelBtn = document.getElementById('cancelUploadBtn');
    const avatarPreview = document.getElementById('avatarPreview');
    let selectedImage = null;
    
    selectBtn.addEventListener('click', () => {
        uploadInput.click();
    });
    
    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    selectedImage = event.target.result;
                    avatarPreview.innerHTML = `<img src="${selectedImage}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    confirmBtn.disabled = false;
                    confirmBtn.style.opacity = '1';
                    confirmBtn.style.cursor = 'pointer';
                };
                img.src = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    confirmBtn.addEventListener('click', () => {
        if (selectedImage) {
            handleAvatarUpload(selectedImage);
        }
    });
    
    cancelBtn.addEventListener('click', closeAvatarModal);
}

// 处理头像上传
function handleAvatarUpload(avatarData) {
    if (!currentUser) return;
    
    // 更新用户对象
    currentUser.avatar = avatarData;
    
    // 更新localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // 更新所有用户数据中的头像
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].avatar = avatarData;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // 更新所有帖子中该用户的头像
    const localStorageData = JSON.parse(localStorage.getItem('posts')) || {};
    const posts = localStorageData.posts || [];
    
    posts.forEach(post => {
        if (post.author && post.author.id === currentUser.id) {
            post.author.avatar = avatarData;
        }
    });
    
    localStorage.setItem('posts', JSON.stringify({ posts }));
    
    // 更新UI
    updateUILoggedIn();
    // 更新所有需要显示头像的地方
    updateAllUserAvatars();
    
    // 关闭模态框
    closeAvatarModal();
    
    // 显示成功消息
    showNotification('头像上传成功！', 'success');
    
    // 刷新内容显示
    if (typeof loadContent === 'function') {
        loadContent();
    }
}

// 关闭头像模态框
function closeAvatarModal() {
    const modal = document.querySelector('.avatar-upload-modal');
    if (modal) {
        modal.remove();
    }
}

// 更新用户头像显示
function updateUserAvatar(displayElement, userId) {
    // 从localStorage获取用户数据
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    // 如果找到用户且有头像，显示头像
    if (user && user.avatar) {
        if (displayElement.tagName === 'IMG') {
            displayElement.src = user.avatar;
        } else {
            // 查找内部的img元素
            const img = displayElement.querySelector('img');
            if (img) {
                img.src = user.avatar;
            }
        }
    }
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

// 加载热门内容
function loadFeaturedContent() {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) return;
    
    // 获取真实的帖子数据
    const localStorageData = JSON.parse(localStorage.getItem('posts')) || {};
    const posts = localStorageData.posts || [];
    
    // 如果没有帖子数据，显示提示信息
    if (posts.length === 0) {
        contentGrid.innerHTML = `
            <div class="no-content">
                <h3>暂无内容</h3>
                <p>还没有人发布内容，快来成为第一个发布者吧！</p>
                <a href="create-post.html" class="btn-primary">发布内容</a>
            </div>
        `;
        return;
    }
    
    // 清空内容网格
    contentGrid.innerHTML = '';
    
    // 添加内容卡片（最多显示6个最新帖子）
    const recentPosts = posts.slice(0, 6);
    recentPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'content-card';
        
        // 生成内容缩略图
        const excerpt = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
        const bgColor = getRandomColor();
        const textColor = getContrastColor(bgColor);
        
        // 检查当前用户是否是内容作者
        const isAuthor = currentUser && currentUser.id === post.author.id;
        
        card.innerHTML = `
            <div class="content-image">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><rect width='400' height='200' fill='${encodeURIComponent(bgColor)}'/><text x='200' y='100' font-size='20' text-anchor='middle' fill='${encodeURIComponent(textColor)}'>${post.category}</text></svg>" alt="${post.title}">
            </div>
            <div class="content-info">
                <span class="content-category">${post.category}</span>
                <h3 class="content-title">${post.title}</h3>
                <p class="content-excerpt">${excerpt}</p>
                <div class="content-meta">
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='${encodeURIComponent(bgColor)}'/><circle cx='50' cy='40' r='10' fill='white'/><path d='M30,70 Q50,85 70,70' fill='white'/></svg>" alt="${post.author.username}">
                        </div>
                        <span class="username">${post.author.username}</span>
                    </div>
                    <div class="content-stats">
                        <span><i>👁</i> ${post.views || 0}</span>
                        <span><i>👍</i> ${post.likes || 0}</span>
                        <span><i>💬</i> ${(post.comments || []).length}</span>
                        ${isAuthor ? `<button class="delete-btn" onclick="event.stopPropagation(); handleDeleteContent('${post.id}')" title="删除内容">🗑️</button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // 点击卡片跳转到帖子详情（待实现）
        card.addEventListener('click', function() {
            alert('帖子详情功能即将上线');
        });
        
        contentGrid.appendChild(card);
    });
}

// 处理删除内容
function handleDeleteContent(contentId) {
    
    if (!currentUser) {
        alert('请先登录才能删除内容');
        return;
    }
    
    const localStorageData = JSON.parse(localStorage.getItem('posts')) || {};
    const posts = localStorageData.posts || [];
    const contentIndex = posts.findIndex(p => p.id === contentId);
    
    if (contentIndex === -1) {
        alert('内容不存在');
        return;
    }
    
    const content = posts[contentIndex];
    
    // 检查当前用户是否是内容作者
    if (currentUser.id !== content.author.id) {
        alert('您只能删除自己发布的内容');
        return;
    }
    
    // 确认删除
    if (!confirm('确定要删除这条内容吗？此操作不可恢复。')) {
        return;
    }
    
    // 删除内容
    posts.splice(contentIndex, 1);
    localStorage.setItem('posts', JSON.stringify({ posts: posts }));
    
    // 显示成功消息
    showNotification('内容删除成功', 'success');
    
    // 重新加载内容
    setTimeout(() => {
        loadFeaturedContent();
    }, 1000);
}

// 将函数暴露到全局作用域，供其他页面使用
window.checkUserLogin = checkUserLogin;
window.currentUser = currentUser;
window.showNotification = showNotification;
window.updateNavDisplay = function() {
    // 更新导航栏显示
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            // 隐藏登录/注册按钮
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            if (loginBtn) loginBtn.classList.add('hidden');
            if (registerBtn) registerBtn.classList.add('hidden');
            
            // 显示用户信息
            const userProfile = document.getElementById('user-profile');
            const usernameDisplay = document.getElementById('username-display');
            const logoutBtn = document.getElementById('logout-btn');
            if (userProfile) userProfile.classList.remove('hidden');
            if (usernameDisplay) usernameDisplay.textContent = user.username;
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            
            // 显示发布内容按钮
            const createPostBtn = document.getElementById('create-post-btn');
            if (createPostBtn) createPostBtn.classList.remove('hidden');
        } catch (error) {
            console.error('解析用户数据失败:', error);
        }
    }
}

// 更新页面上所有需要显示的用户头像
function updateAllUserAvatars() {
    try {
        // 获取所有用户数据
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUserData = localStorage.getItem('currentUser');
        let currentUser = currentUserData ? JSON.parse(currentUserData) : null;
        
        // 1. 更新导航栏头像 - 跨浏览器兼容版本
        const navbarAvatar = document.getElementById('navbar-avatar');
        const userIcon = document.querySelector('#user-profile i.fa-user');
        const userProfile = document.getElementById('user-profile');
        
        // 确保元素存在
        if (userProfile && !userProfile.classList.contains('hidden')) {
            if (navbarAvatar && userIcon) {
                if (currentUser && currentUser.avatar) {
                    // 安全设置头像URL - 增强兼容性处理
                    try {
                        // 使用try-catch包装图片加载，处理图片URL无效的情况
                        const img = new Image();
                        img.onload = function() {
                            navbarAvatar.src = currentUser.avatar;
                            navbarAvatar.style.display = 'inline-block';
                            userIcon.style.display = 'none';
                        };
                        img.onerror = function() {
                            console.error('头像图片加载失败，显示默认图标');
                            navbarAvatar.style.display = 'none';
                            userIcon.style.display = 'inline-block';
                        };
                        // 设置图片源
                        img.src = currentUser.avatar;
                        
                        // 对于某些浏览器，如果图片已在缓存中，onload可能不会触发
                        if (img.complete && img.naturalWidth > 0) {
                            navbarAvatar.src = currentUser.avatar;
                            navbarAvatar.style.display = 'inline-block';
                            userIcon.style.display = 'none';
                        }
                    } catch (e) {
                        console.error('设置头像失败:', e);
                        // 失败时显示默认图标
                        navbarAvatar.style.display = 'none';
                        userIcon.style.display = 'inline-block';
                    }
                } else {
                    // 没有头像时显示默认图标
                    navbarAvatar.style.display = 'none';
                    userIcon.style.display = 'inline-block';
                }
            }
        }
        
        // 2. 更新内容卡片中的所有用户头像 - 增强兼容性
        const userAvatarImgs = document.querySelectorAll('.user-avatar img');
        if (userAvatarImgs && userAvatarImgs.length > 0) {
            userAvatarImgs.forEach(img => {
                try {
                    // 尝试从最近的用户名获取用户信息
                    const parentElement = img.closest('.user-info, .post-author, .comment-author');
                    if (parentElement) {
                        const usernameElement = parentElement.querySelector('.username, span');
                        if (usernameElement) {
                            const username = usernameElement.textContent.trim();
                            if (username) {
                                const user = users.find(u => u.username === username);
                                
                                if (user && user.avatar) {
                                    // 使用图片预加载来确保兼容性
                                    const tempImg = new Image();
                                    tempImg.onload = function() {
                                        img.src = user.avatar;
                                    };
                                    tempImg.onerror = function() {
                                        console.error('内容卡片头像加载失败:', username);
                                        // 保留现有头像或使用默认头像
                                    };
                                    tempImg.src = user.avatar;
                                }
                            }
                        }
                    }
                } catch (e) {
                    // 单个头像更新失败不应影响其他头像
                    console.error('更新用户头像失败:', e);
                }
            });
        }
        
        // 3. 更新作者头像 - 增强兼容性
        const authorAvatar = document.getElementById('author-avatar');
        if (authorAvatar) {
            if (currentUser && currentUser.avatar) {
                // 安全设置背景图
                try {
                    // 先验证头像URL是否有效
                    const tempImg = new Image();
                    tempImg.onload = function() {
                        // 避免在某些浏览器中的引号转义问题
                        authorAvatar.style.backgroundImage = 'url("' + String(currentUser.avatar).replace(/"/g, '\\"') + '")';
                        authorAvatar.style.backgroundSize = 'cover';
                        authorAvatar.style.backgroundPosition = 'center';
                        // 移除任何默认内容
                        while (authorAvatar.firstChild) {
                            authorAvatar.removeChild(authorAvatar.firstChild);
                        }
                    };
                    tempImg.onerror = function() {
                        console.error('作者头像加载失败');
                        authorAvatar.style.backgroundImage = 'none';
                        authorAvatar.style.backgroundColor = '#e2e8f0';
                    };
                    tempImg.src = currentUser.avatar;
                } catch (e) {
                    console.error('设置作者头像失败:', e);
                    authorAvatar.style.backgroundImage = 'none';
                    authorAvatar.style.backgroundColor = '#e2e8f0';
                }
            } else {
                // 没有头像时设置默认样式
                authorAvatar.style.backgroundImage = 'none';
                authorAvatar.style.backgroundColor = '#e2e8f0';
            }
        }
        
    } catch (e) {
        console.error('更新头像时发生错误:', e);
        // 发生严重错误时也不能阻止页面其他功能
    }
}

// 将函数暴露到全局作用域
window.updateAllUserAvatars = updateAllUserAvatars;