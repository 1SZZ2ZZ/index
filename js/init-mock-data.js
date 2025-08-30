// 初始化模拟用户数据，包含头像信息
function initMockUsers() {
    // 检查是否已经有用户数据
    const existingUsers = localStorage.getItem('users');
    if (existingUsers) {
        console.log('已有用户数据，跳过初始化');
        return;
    }
    
    // 创建一些带有头像信息的模拟用户
    const mockUsers = [
        {
            id: 'user-1',
            username: '林克大师',
            email: 'link@example.com',
            password: 'password123',
            avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#4a90e2"/><circle cx="50" cy="40" r="10" fill="white"/><path d="M30,70 Q50,90 70,70" fill="white" stroke="white" stroke-width="4"/></svg>'
        },
        {
            id: 'user-2',
            username: '枪神CS',
            email: 'cs@example.com',
            password: 'password123',
            avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#50e3c2"/><circle cx="50" cy="40" r="10" fill="white"/><path d="M30,70 Q50,90 70,70" fill="white" stroke="white" stroke-width="4"/></svg>'
        },
        {
            id: 'user-3',
            username: '文明玩家',
            email: 'civ@example.com',
            password: 'password123',
            avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#f5a623"/><circle cx="50" cy="40" r="10" fill="white"/><path d="M30,70 Q50,90 70,70" fill="white" stroke="white" stroke-width="4"/></svg>'
        },
        {
            id: 'user-4',
            username: '足球教练',
            email: 'football@example.com',
            password: 'password123',
            avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#d0021b"/><circle cx="50" cy="40" r="10" fill="white"/><path d="M30,70 Q50,90 70,70" fill="white" stroke="white" stroke-width="4"/></svg>'
        }
    ];
    
    // 保存到localStorage
    localStorage.setItem('users', JSON.stringify(mockUsers));
    console.log('已创建模拟用户数据');
    
    // 自动登录第一个用户，便于测试
    localStorage.setItem('currentUser', JSON.stringify(mockUsers[0]));
    console.log('已自动登录用户: 林克大师');
}

// 当DOM加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMockUsers);
} else {
    initMockUsers();
}

// 等待一段时间后强制更新所有头像
setTimeout(() => {
    if (typeof updateAllUserAvatars === 'function') {
        console.log('强制更新所有头像');
        updateAllUserAvatars();
    }
}, 1000);