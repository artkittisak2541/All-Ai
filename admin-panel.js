// Admin Panel Extension Functions

class AdminPanel {
    constructor() {
        this.authSystem = authSystem;
    }
    
    // Get system statistics
    getSystemStats() {
        const users = JSON.parse(localStorage.getItem('st_ai_users') || '[]');
        const totalUsers = users.length;
        const adminUsers = users.filter(u => u.role === 'admin').length;
        const regularUsers = totalUsers - adminUsers;
        
        // Get login history
        const loginHistory = JSON.parse(localStorage.getItem('st_ai_login_history') || '[]');
        
        return {
            totalUsers,
            adminUsers,
            regularUsers,
            totalLogins: loginHistory.length,
            activeUsers: this.getActiveUsers(loginHistory)
        };
    }
    
    // Get active users (last 24 hours)
    getActiveUsers(loginHistory) {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        
        return loginHistory.filter(login => {
            const loginTime = new Date(login.timestamp);
            return loginTime > twentyFourHoursAgo;
        }).length;
    }
    
    // Get user activity log
    getUserActivityLog(userId) {
        const loginHistory = JSON.parse(localStorage.getItem('st_ai_login_history') || '[]');
        return loginHistory.filter(login => login.userId === userId);
    }
    
    // Create login history entry
    logLogin(userId, username, isAdmin) {
        const loginHistory = JSON.parse(localStorage.getItem('st_ai_login_history') || '[]');
        
        loginHistory.push({
            userId,
            username,
            isAdmin,
            timestamp: new Date().toISOString(),
            ip: this.getClientIP() // Simplified - in real app, get from server
        });
        
        // Keep only last 100 entries
        if (loginHistory.length > 100) {
            loginHistory.splice(0, loginHistory.length - 100);
        }
        
        localStorage.setItem('st_ai_login_history', JSON.stringify(loginHistory));
    }
    
    // Get client IP (simplified)
    getClientIP() {
        return 'localhost'; // In real app, get from server
    }
    
    // Reset user password (admin only)
    resetUserPassword(userId, newPassword) {
        if (!this.authSystem.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการรีเซ็ตรหัสผ่าน'
            };
        }
        
        const result = this.authSystem.getAllUsers();
        
        if (!result.success) {
            return result;
        }
        
        const userIndex = result.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: 'ไม่พบผู้ใช้'
            };
        }
        
        // Validate new password
        const passwordError = this.authSystem.validatePassword(newPassword);
        
        if (passwordError) {
            return {
                success: false,
                message: passwordError
            };
        }
        
        // Update password
        result.users[userIndex].password = newPassword;
        result.users[userIndex].updatedAt = new Date().toISOString();
        
        localStorage.setItem('st_ai_users', JSON.stringify(result.users));
        
        return {
            success: true,
            message: 'รีเซ็ตรหัสผ่านสำเร็จ'
        };
    }
    
    // Bulk user operations
    bulkDeleteUsers(userIds) {
        if (!this.authSystem.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการลบผู้ใช้หลายราย'
            };
        }
        
        const currentUser = this.authSystem.getCurrentUser();
        
        // Cannot delete own account
        if (userIds.includes(currentUser.id)) {
            return {
                success: false,
                message: 'ไม่สามารถลบบัญชีของตัวเองได้'
            };
        }
        
        let deletedCount = 0;
        const users = JSON.parse(localStorage.getItem('st_ai_users') || '[]');
        const newUsers = users.filter(user => {
            if (userIds.includes(user.id)) {
                deletedCount++;
                return false;
            }
            return true;
        });
        
        localStorage.setItem('st_ai_users', JSON.stringify(newUsers));
        
        return {
            success: true,
            message: `ลบผู้ใช้ ${deletedCount} รายการสำเร็จ`,
            deletedCount
        };
    }
    
    // Export all data
    exportAllData() {
        if (!this.authSystem.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการส่งออกข้อมูล'
            };
        }
        
        const users = JSON.parse(localStorage.getItem('st_ai_users') || '[]');
        const loginHistory = JSON.parse(localStorage.getItem('st_ai_login_history') || '[]');
        const adminKey = localStorage.getItem('st_ai_admin_key');
        
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: '4.0',
                totalUsers: users.length,
                totalLogins: loginHistory.length
            },
            users: users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }),
            loginHistory,
            systemConfig: {
                hasAdminKey: !!adminKey
            }
        };
        
        return {
            success: true,
            data: exportData,
            filename: `st-ai-backup-${new Date().toISOString().split('T')[0]}.json`
        };
    }
    
    // Import data
    importData(jsonData) {
        if (!this.authSystem.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการนำเข้าข้อมูล'
            };
        }
        
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            // Validate data structure
            if (!data.users || !Array.isArray(data.users)) {
                return {
                    success: false,
                    message: 'รูปแบบข้อมูลไม่ถูกต้อง'
                };
            }
            
            // Backup current data
            const backup = {
                users: JSON.parse(localStorage.getItem('st_ai_users') || '[]'),
                loginHistory: JSON.parse(localStorage.getItem('st_ai_login_history') || '[]')
            };
            
            // Store backup
            localStorage.setItem('st_ai_backup', JSON.stringify(backup));
            
            // Import users
            if (data.users.length > 0) {
                localStorage.setItem('st_ai_users', JSON.stringify(data.users));
            }
            
            // Import login history if exists
            if (data.loginHistory && Array.isArray(data.loginHistory)) {
                localStorage.setItem('st_ai_login_history', JSON.stringify(data.loginHistory));
            }
            
            return {
                success: true,
                message: `นำเข้าข้อมูลสำเร็จ (${data.users.length} ผู้ใช้)`,
                importedCount: data.users.length
            };
            
        } catch (error) {
            return {
                success: false,
                message: 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ' + error.message
            };
        }
    }
    
    // Restore from backup
    restoreBackup() {
        if (!this.authSystem.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการกู้คืนข้อมูล'
            };
        }
        
        const backup = JSON.parse(localStorage.getItem('st_ai_backup') || 'null');
        
        if (!backup) {
            return {
                success: false,
                message: 'ไม่พบข้อมูลสำรอง'
            };
        }
        
        localStorage.setItem('st_ai_users', JSON.stringify(backup.users));
        localStorage.setItem('st_ai_login_history', JSON.stringify(backup.loginHistory));
        
        return {
            success: true,
            message: 'กู้คืนข้อมูลสำเร็จ'
        };
    }
    
    // Clear all data (DANGEROUS - for development only)
    clearAllData() {
        if (!this.authSystem.isAdmin()) {
            return {
                success: false,
                message: 'ไม่มีสิทธิ์ในการล้างข้อมูล'
            };
        }
        
        // Create final backup
        const finalBackup = {
            users: JSON.parse(localStorage.getItem('st_ai_users') || '[]'),
            loginHistory: JSON.parse(localStorage.getItem('st_ai_login_history') || '[]'),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('st_ai_final_backup', JSON.stringify(finalBackup));
        
        // Clear all auth data
        localStorage.removeItem('st_ai_users');
        localStorage.removeItem('st_ai_current_user');
        localStorage.removeItem('st_ai_login_history');
        localStorage.removeItem('st_ai_admin_key');
        
        return {
            success: true,
            message: 'ล้างข้อมูลทั้งหมดสำเร็จ',
            backupCreated: true
        };
    }
}

// Create global instance
const adminPanel = new AdminPanel();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminPanel, adminPanel };
}