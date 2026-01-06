// Authentication System for ST AI Router

class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('st_ai_users') || '[]');
        this.adminKey = localStorage.getItem('st_ai_admin_key') || 'admin1234';
        this.currentUser = JSON.parse(localStorage.getItem('st_ai_current_user') || 'null');
    }
    
    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Check if current user is admin
    isAdmin() {
        return this.currentUser?.isAdmin === true;
    }
    
    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Login function
    login(username, password, isAdminMode = false, adminKey = '') {
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            return {
                success: false,
                message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
            };
        }
        
        // Check admin access
        if (isAdminMode) {
            if (adminKey !== this.adminKey) {
                return {
                    success: false,
                    message: 'รหัสลับแอดมินไม่ถูกต้อง'
                };
            }
            
            // Admin login successful
            this.currentUser = {
                ...user,
                isAdmin: true,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('st_ai_current_user', JSON.stringify(this.currentUser));
            
            return {
                success: true,
                isAdmin: true,
                message: 'เข้าสู่ระบบแอดมินสำเร็จ',
                user: this.currentUser
            };
        }
        
        // Regular user login
        this.currentUser = {
            ...user,
            isAdmin: false,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('st_ai_current_user', JSON.stringify(this.currentUser));
        
        return {
            success: true,
            isAdmin: false,
            message: 'เข้าสู่ระบบสำเร็จ',
            user: this.currentUser
        };
    }
    
    // Logout function
    logout() {
        this.currentUser = null;
        localStorage.removeItem('st_ai_current_user');
        return {
            success: true,
            message: 'ออกจากระบบสำเร็จ'
        };
    }
    
    // Create new user (admin only)
    createUser(userData) {
        if (!this.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการสร้างผู้ใช้ใหม่'
            };
        }
        
        // Check if username already exists
        if (this.users.some(u => u.username === userData.username)) {
            return {
                success: false,
                message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว'
            };
        }
        
        // Validate user data
        if (!userData.username || !userData.password || !userData.name) {
            return {
                success: false,
                message: 'ข้อมูลผู้ใช้ไม่ครบถ้วน'
            };
        }
        
        const newUser = {
            id: this.generateUserId(),
            username: userData.username,
            password: userData.password,
            name: userData.name,
            email: userData.email || '',
            role: userData.role || 'user',
            isAdmin: userData.role === 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        return {
            success: true,
            message: 'สร้างผู้ใช้ใหม่สำเร็จ',
            user: newUser
        };
    }
    
    // Update user (admin only)
    updateUser(userId, userData) {
        if (!this.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการแก้ไขผู้ใช้'
            };
        }
        
        const userIndex = this.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: 'ไม่พบผู้ใช้ที่ต้องการแก้ไข'
            };
        }
        
        // Check if username already exists (excluding current user)
        if (userData.username && 
            this.users.some((u, index) => 
                u.username === userData.username && index !== userIndex
            )) {
            return {
                success: false,
                message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว'
            };
        }
        
        // Update user data
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...userData,
            updatedAt: new Date().toISOString()
        };
        
        this.saveUsers();
        
        return {
            success: true,
            message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
            user: this.users[userIndex]
        };
    }
    
    // Delete user (admin only)
    deleteUser(userId) {
        if (!this.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการลบผู้ใช้'
            };
        }
        
        // Cannot delete own account
        if (this.currentUser?.id === userId) {
            return {
                success: false,
                message: 'ไม่สามารถลบบัญชีของตัวเองได้'
            };
        }
        
        const initialLength = this.users.length;
        this.users = this.users.filter(u => u.id !== userId);
        
        if (this.users.length === initialLength) {
            return {
                success: false,
                message: 'ไม่พบผู้ใช้ที่ต้องการลบ'
            };
        }
        
        this.saveUsers();
        
        return {
            success: true,
            message: 'ลบผู้ใช้สำเร็จ'
        };
    }
    
    // Get all users (admin only)
    getAllUsers() {
        if (!this.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการดูข้อมูลผู้ใช้ทั้งหมด'
            };
        }
        
        return {
            success: true,
            users: this.users
        };
    }
    
    // Change admin key (admin only)
    changeAdminKey(newKey, oldKey) {
        if (!this.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการเปลี่ยนรหัสลับแอดมิน'
            };
        }
        
        if (oldKey !== this.adminKey) {
            return {
                success: false,
                message: 'รหัสลับแอดมินเดิมไม่ถูกต้อง'
            };
        }
        
        if (!newKey || newKey.length < 6) {
            return {
                success: false,
                message: 'รหัสลับแอดมินใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
            };
        }
        
        this.adminKey = newKey;
        localStorage.setItem('st_ai_admin_key', newKey);
        
        return {
            success: true,
            message: 'เปลี่ยนรหัสลับแอดมินสำเร็จ'
        };
    }
    
    // Change own password
    changePassword(oldPassword, newPassword) {
        if (!this.currentUser) {
            return {
                success: false,
                message: 'กรุณาเข้าสู่ระบบก่อน'
            };
        }
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        
        if (this.users[userIndex].password !== oldPassword) {
            return {
                success: false,
                message: 'รหัสผ่านเดิมไม่ถูกต้อง'
            };
        }
        
        if (!newPassword || newPassword.length < 6) {
            return {
                success: false,
                message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
            };
        }
        
        this.users[userIndex].password = newPassword;
        this.users[userIndex].updatedAt = new Date().toISOString();
        
        // Update current user
        this.currentUser.password = newPassword;
        
        this.saveUsers();
        localStorage.setItem('st_ai_current_user', JSON.stringify(this.currentUser));
        
        return {
            success: true,
            message: 'เปลี่ยนรหัสผ่านสำเร็จ'
        };
    }
    
    // Helper functions
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    saveUsers() {
        localStorage.setItem('st_ai_users', JSON.stringify(this.users));
    }
    
    // Validation functions
    validateUsername(username) {
        if (!username || username.length < 3) {
            return 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร';
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'ชื่อผู้ใช้สามารถใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ, ตัวเลข และขีดล่าง';
        }
        
        return null;
    }
    
    validatePassword(password) {
        if (!password || password.length < 6) {
            return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
        }
        
        return null;
    }
    
    validateEmail(email) {
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'รูปแบบอีเมลไม่ถูกต้อง';
        }
        
        return null;
    }
}

// Create global instance
const authSystem = new AuthSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem, authSystem };
}