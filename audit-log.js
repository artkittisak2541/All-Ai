/**
 * ST AI Router - Audit Log System
 * Comprehensive logging of all security-relevant events
 */

class AuditLogSystem {
    constructor() {
        this.config = {
            maxLogEntries: 10000,
            retentionDays: 90,
            logLevels: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'],
            enabled: true,
            autoExport: false,
            encryption: true
        };
        
        this.categories = {
            AUTHENTICATION: [
                'LOGIN_SUCCESS',
                'LOGIN_FAILED',
                'LOGOUT',
                'PASSWORD_CHANGE',
                'ACCOUNT_LOCKOUT',
                'SESSION_CREATED',
                'SESSION_DESTROYED'
            ],
            AUTHORIZATION: [
                'PERMISSION_DENIED',
                'ROLE_CHANGE',
                'PRIVILEGE_ESCALATION',
                'UNAUTHORIZED_ACCESS'
            ],
            DATA_ACCESS: [
                'DATA_READ',
                'DATA_WRITE',
                'DATA_DELETE',
                'DATA_EXPORT',
                'DATA_IMPORT'
            ],
            SECURITY: [
                'SECURITY_ALERT',
                'THREAT_DETECTED',
                'FIREWALL_BLOCK',
                'ANTIVIRUS_ALERT',
                'TAMPER_DETECTED'
            ],
            SYSTEM: [
                'SYSTEM_START',
                'SYSTEM_STOP',
                'CONFIG_CHANGE',
                'BACKUP_CREATED',
                'BACKUP_RESTORED'
            ],
            ADMIN: [
                'ADMIN_LOGIN',
                'ADMIN_ACTION',
                'USER_MANAGEMENT',
                'SETTINGS_CHANGE',
                'AUDIT_LOG_ACCESS'
            ]
        };
        
        this.init();
    }
    
    init() {
        // Load configuration
        this.loadConfig();
        
        // Initialize storage
        this.initStorage();
        
        // Setup automatic cleanup
        this.setupCleanup();
        
        // Log system startup
        this.log({
            category: 'SYSTEM',
            level: 'INFO',
            event: 'SYSTEM_START',
            message: 'Audit log system initialized',
            details: {
                version: '2.0',
                timestamp: new Date().toISOString()
            }
        });
    }
    
    // 1. Core Logging Functions
    log(entry) {
        if (!this.config.enabled) return null;
        
        // Validate entry
        const validatedEntry = this.validateEntry(entry);
        if (!validatedEntry) return null;
        
        // Add metadata
        const completeEntry = this.enrichEntry(validatedEntry);
        
        // Store entry
        this.storeEntry(completeEntry);
        
        // Trigger alerts if needed
        this.checkForAlerts(completeEntry);
        
        // Auto-export if enabled
        if (this.config.autoExport && completeEntry.level === 'CRITICAL') {
            this.exportCriticalLogs();
        }
        
        return completeEntry;
    }
    
    validateEntry(entry) {
        const requiredFields = ['category', 'level', 'event', 'message'];
        
        // Check required fields
        for (const field of requiredFields) {
            if (!entry[field]) {
                console.error(`Audit log entry missing required field: ${field}`);
                return null;
            }
        }
        
        // Validate category
        if (!this.categories[entry.category]) {
            console.error(`Invalid audit log category: ${entry.category}`);
            return null;
        }
        
        // Validate level
        if (!this.config.logLevels.includes(entry.level)) {
            console.error(`Invalid audit log level: ${entry.level}`);
            return null;
        }
        
        // Validate event against category
        if (!this.categories[entry.category].includes(entry.event)) {
            console.warn(`Event ${entry.event} not in category ${entry.category} list`);
        }
        
        return entry;
    }
    
    enrichEntry(entry) {
        const enriched = {
            ...entry,
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            source: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                ip: this.getClientIP(),
                userId: this.getCurrentUserId(),
                sessionId: this.getSessionId()
            },
            metadata: {
                logVersion: '2.0',
                encrypted: this.config.encryption
            }
        };
        
        // Add stack trace for errors
        if (entry.level === 'ERROR' || entry.level === 'CRITICAL') {
            enriched.stackTrace = new Error().stack;
        }
        
        return enriched;
    }
    
    // 2. Storage Management
    initStorage() {
        // Create log storage if it doesn't exist
        if (!localStorage.getItem('audit_logs')) {
            localStorage.setItem('audit_logs', JSON.stringify([]));
        }
        
        // Create index for faster searching
        this.buildIndex();
    }
    
    storeEntry(entry) {
        try {
            // Get current logs
            const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
            
            // Encrypt if enabled
            const entryToStore = this.config.encryption ? 
                this.encryptEntry(entry) : entry;
            
            // Add to logs
            logs.push(entryToStore);
            
            // Enforce maximum size
            if (logs.length > this.config.maxLogEntries) {
                logs.splice(0, logs.length - this.config.maxLogEntries);
            }
            
            // Save back to storage
            localStorage.setItem('audit_logs', JSON.stringify(logs));
            
            // Update index
            this.updateIndex(entry);
            
            return true;
        } catch (error) {
            console.error('Failed to store audit log entry:', error);
            return false;
        }
    }
    
    // 3. Encryption
    encryptEntry(entry) {
        try {
            // Simple encryption for demo purposes
            // In production, use proper encryption like AES
            const entryString = JSON.stringify(entry);
            const encrypted = btoa(unescape(encodeURIComponent(entryString)));
            
            return {
                encrypted: true,
                data: encrypted,
                timestamp: entry.timestamp,
                level: entry.level,
                category: entry.category,
                event: entry.event
            };
        } catch (error) {
            console.error('Failed to encrypt audit log entry:', error);
            return entry;
        }
    }
    
    decryptEntry(encryptedEntry) {
        try {
            if (!encryptedEntry.encrypted) {
                return encryptedEntry;
            }
            
            const decryptedString = decodeURIComponent(escape(atob(encryptedEntry.data)));
            return JSON.parse(decryptedString);
        } catch (error) {
            console.error('Failed to decrypt audit log entry:', error);
            return encryptedEntry;
        }
    }
    
    // 4. Query and Search
    queryLogs(filters = {}, limit = 100, offset = 0) {
        try {
            const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
            let filteredLogs = logs;
            
            // Apply filters
            if (filters.category) {
                filteredLogs = filteredLogs.filter(log => 
                    this.decryptEntry(log).category === filters.category
                );
            }
            
            if (filters.level) {
                filteredLogs = filteredLogs.filter(log => 
                    this.decryptEntry(log).level === filters.level
                );
            }
            
            if (filters.event) {
                filteredLogs = filteredLogs.filter(log => 
                    this.decryptEntry(log).event === filters.event
                );
            }
            
            if (filters.userId) {
                filteredLogs = filteredLogs.filter(log => 
                    this.decryptEntry(log).source?.userId === filters.userId
                );
            }
            
            if (filters.startDate) {
                const start = new Date(filters.startDate);
                filteredLogs = filteredLogs.filter(log => 
                    new Date(this.decryptEntry(log).timestamp) >= start
                );
            }
            
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                filteredLogs = filteredLogs.filter(log => 
                    new Date(this.decryptEntry(log).timestamp) <= end
                );
            }
            
            if (filters.searchText) {
                const searchLower = filters.searchText.toLowerCase();
                filteredLogs = filteredLogs.filter(log => {
                    const decrypted = this.decryptEntry(log);
                    return (
                        decrypted.message.toLowerCase().includes(searchLower) ||
                        decrypted.event.toLowerCase().includes(searchLower) ||
                        (decrypted.details && 
                         JSON.stringify(decrypted.details).toLowerCase().includes(searchLower))
                    );
                });
            }
            
            // Sort by timestamp (newest first)
            filteredLogs.sort((a, b) => {
                const timeA = new Date(this.decryptEntry(a).timestamp);
                const timeB = new Date(this.decryptEntry(b).timestamp);
                return timeB - timeA;
            });
            
            // Apply pagination
            const paginatedLogs = filteredLogs.slice(offset, offset + limit);
            
            // Decrypt entries if needed
            const decryptedLogs = paginatedLogs.map(log => 
                this.config.encryption ? this.decryptEntry(log) : log
            );
            
            return {
                logs: decryptedLogs,
                total: filteredLogs.length,
                page: Math.floor(offset / limit) + 1,
                totalPages: Math.ceil(filteredLogs.length / limit),
                hasMore: offset + limit < filteredLogs.length
            };
        } catch (error) {
            console.error('Failed to query audit logs:', error);
            return { logs: [], total: 0, page: 1, totalPages: 0, hasMore: false };
        }
    }
    
    // 5. Indexing for Performance
    buildIndex() {
        const index = {
            byCategory: {},
            byLevel: {},
            byUser: {},
            byDate: {},
            byEvent: {}
        };
        
        const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
        
        logs.forEach((log, indexNum) => {
            const decrypted = this.decryptEntry(log);
            
            // Index by category
            if (!index.byCategory[decrypted.category]) {
                index.byCategory[decrypted.category] = [];
            }
            index.byCategory[decrypted.category].push(indexNum);
            
            // Index by level
            if (!index.byLevel[decrypted.level]) {
                index.byLevel[decrypted.level] = [];
            }
            index.byLevel[decrypted.level].push(indexNum);
            
            // Index by user
            const userId = decrypted.source?.userId;
            if (userId) {
                if (!index.byUser[userId]) {
                    index.byUser[userId] = [];
                }
                index.byUser[userId].push(indexNum);
            }
            
            // Index by date (YYYY-MM-DD)
            const date = decrypted.timestamp.split('T')[0];
            if (!index.byDate[date]) {
                index.byDate[date] = [];
            }
            index.byDate[date].push(indexNum);
            
            // Index by event
            if (!index.byEvent[decrypted.event]) {
                index.byEvent[decrypted.event] = [];
            }
            index.byEvent[decrypted.event].push(indexNum);
        });
        
        localStorage.setItem('audit_log_index', JSON.stringify(index));
        return index;
    }
    
    updateIndex(entry) {
        try {
            const index = JSON.parse(localStorage.getItem('audit_log_index') || '{}');
            const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
            const logIndex = logs.length - 1;
            
            // Update category index
            if (!index.byCategory) index.byCategory = {};
            if (!index.byCategory[entry.category]) {
                index.byCategory[entry.category] = [];
            }
            index.byCategory[entry.category].push(logIndex);
            
            // Update level index
            if (!index.byLevel) index.byLevel = {};
            if (!index.byLevel[entry.level]) {
                index.byLevel[entry.level] = [];
            }
            index.byLevel[entry.level].push(logIndex);
            
            // Update user index
            if (!index.byUser) index.byUser = {};
            const userId = entry.source?.userId;
            if (userId) {
                if (!index.byUser[userId]) {
                    index.byUser[userId] = [];
                }
                index.byUser[userId].push(logIndex);
            }
            
            // Update date index
            if (!index.byDate) index.byDate = {};
            const date = entry.timestamp.split('T')[0];
            if (!index.byDate[date]) {
                index.byDate[date] = [];
            }
            index.byDate[date].push(logIndex);
            
            // Update event index
            if (!index.byEvent) index.byEvent = {};
            if (!index.byEvent[entry.event]) {
                index.byEvent[entry.event] = [];
            }
            index.byEvent[entry.event].push(logIndex);
            
            localStorage.setItem('audit_log_index', JSON.stringify(index));
        } catch (error) {
            console.error('Failed to update audit log index:', error);
        }
    }
    
    // 6. Alerting System
    checkForAlerts(entry) {
        const alertRules = [
            {
                condition: (e) => e.level === 'CRITICAL',
                action: () => this.triggerAlert('CRITICAL event logged', entry)
            },
            {
                condition: (e) => e.event === 'LOGIN_FAILED',
                action: () => this.checkFailedLoginPattern(entry)
            },
            {
                condition: (e) => e.event === 'UNAUTHORIZED_ACCESS',
                action: () => this.triggerAlert('Unauthorized access attempt', entry)
            },
            {
                condition: (e) => e.event === 'TAMPER_DETECTED',
                action: () => this.triggerAlert('System tampering detected', entry)
            }
        ];
        
        alertRules.forEach(rule => {
            if (rule.condition(entry)) {
                rule.action();
            }
        });
    }
    
    checkFailedLoginPattern(entry) {
        const userId = entry.source?.userId;
        if (!userId) return;
        
        // Count failed logins in last 15 minutes
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const failedLogins = this.queryLogs({
            event: 'LOGIN_FAILED',
            userId: userId,
            startDate: fifteenMinutesAgo.toISOString()
        });
        
        if (failedLogins.total >= 5) {
            this.triggerAlert('Multiple failed login attempts', entry);
            
            // Log account lockout
            this.log({
                category: 'AUTHENTICATION',
                level: 'WARN',
                event: 'ACCOUNT_LOCKOUT',
                message: `Account locked due to multiple failed login attempts`,
                details: {
                    userId: userId,
                    attempts: failedLogins.total,
                    lockoutDuration: '15 minutes'
                }
            });
        }
    }
    
    triggerAlert(message, entry) {
        // Send to security dashboard
        this.sendToSecurityDashboard(message, entry);
        
        // Show notification if enabled
        if (this.shouldShowNotification(entry.level)) {
            this.showNotification(message, entry);
        }
    }
    
    sendToSecurityDashboard(message, entry) {
        // In production, send to real-time security dashboard
        const alertData = {
            message: message,
            entry: entry,
            timestamp: new Date().toISOString()
        };
        
        // Store for dashboard to pick up
        const alerts = JSON.parse(localStorage.getItem('security_alerts') || '[]');
        alerts.push(alertData);
        
        if (alerts.length > 100) {
            alerts.shift();
        }
        
        localStorage.setItem('security_alerts', JSON.stringify(alerts));
    }
    
    shouldShowNotification(level) {
        const notificationLevels = ['ERROR', 'CRITICAL'];
        return notificationLevels.includes(level);
    }
    
    showNotification(message, entry) {
        if (Notification.permission === 'granted') {
            new Notification('Security Alert', {
                body: message,
                icon: '/security-alert.png',
                tag: 'security-alert'
            });
        }
        
        // Also show in-page notification
        this.showInPageNotification(message, entry);
    }
    
    showInPageNotification(message, entry) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'audit-log-notification';
        notificationDiv.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${entry.level === 'CRITICAL' ? '#dc3545' : '#ffc107'};
                color: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 400px;
                font-family: Arial, sans-serif;
                animation: slideUp 0.3s ease;
            ">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="font-size: 20px;">
                        ${entry.level === 'CRITICAL' ? '🚨' : '⚠️'}
                    </div>
                    <div>
                        <strong>${entry.level} Alert</strong>
                        <div style="font-size: 12px; opacity: 0.8;">${new Date(entry.timestamp).toLocaleTimeString()}</div>
                    </div>
                </div>
                <div style="font-size: 14px; margin-bottom: 10px;">${message}</div>
                <div style="font-size: 12px; opacity: 0.8;">
                    Event: ${entry.event} | Category: ${entry.category}
                </div>
                <button onclick="this.parentElement.remove()" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                ">
                    ✕
                </button>
            </div>
        `;
        
        document.body.appendChild(notificationDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notificationDiv.parentElement) {
                notificationDiv.remove();
            }
        }, 10000);
    }
    
    // 7. Reporting
    generateReport(options = {}) {
        const { 
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            endDate = new Date(),
            category = null,
            level = null
        } = options;
        
        const filters = {};
        if (category) filters.category = category;
        if (level) filters.level = level;
        filters.startDate = startDate.toISOString();
        filters.endDate = endDate.toISOString();
        
        const result = this.queryLogs(filters, 1000, 0);
        
        // Generate statistics
        const stats = {
            totalEvents: result.total,
            byCategory: this.countByCategory(result.logs),
            byLevel: this.countByLevel(result.logs),
            byHour: this.countByHour(result.logs),
            topUsers: this.getTopUsers(result.logs),
            criticalEvents: result.logs.filter(log => log.level === 'CRITICAL').length
        };
        
        // Generate trends
        const trends = this.generateTrends(startDate, endDate);
        
        return {
            metadata: {
                generatedAt: new Date().toISOString(),
                period: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                },
                filters: options
            },
            summary: stats,
            trends: trends,
            sampleEvents: result.logs.slice(0, 20) // First 20 events as sample
        };
    }
    
    countByCategory(logs) {
        const counts = {};
        logs.forEach(log => {
            counts[log.category] = (counts[log.category] || 0) + 1;
        });
        return counts;
    }
    
    countByLevel(logs) {
        const counts = {};
        logs.forEach(log => {
            counts[log.level] = (counts[log.level] || 0) + 1;
        });
        return counts;
    }
    
    countByHour(logs) {
        const counts = new Array(24).fill(0);
        logs.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            counts[hour]++;
        });
        return counts;
    }
    
    getTopUsers(logs, limit = 5) {
        const userCounts = {};
        logs.forEach(log => {
            const userId = log.source?.userId;
            if (userId) {
                userCounts[userId] = (userCounts[userId] || 0) + 1;
            }
        });
        
        return Object.entries(userCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([userId, count]) => ({ userId, count }));
    }
    
    generateTrends(startDate, endDate) {
        const trends = [];
        const current = startDate;
        
        while (current <= endDate) {
            const nextDay = new Date(current);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const dayLogs = this.queryLogs({
                startDate: current.toISOString(),
                endDate: nextDay.toISOString()
            });
            
            trends.push({
                date: current.toISOString().split('T')[0],
                count: dayLogs.total
            });
            
            current.setDate(current.getDate() + 1);
        }
        
        return trends;
    }
    
    // 8. Export and Import
    exportLogs(options = {}) {
        const { 
            format = 'json',
            includeEncrypted = false,
            filters = {}
        } = options;
        
        const result = this.queryLogs(filters, 10000, 0);
        
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                format: format,
                logCount: result.logs.length,
                system: 'ST AI Router Audit Logs'
            },
            logs: includeEncrypted ? 
                JSON.parse(localStorage.getItem('audit_logs') || '[]') :
                result.logs
        };
        
        if (format === 'json') {
            return JSON.stringify(exportData, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(exportData.logs);
        } else {
            return exportData;
        }
    }
    
    convertToCSV(logs) {
        if (logs.length === 0) return '';
        
        const headers = ['Timestamp', 'Level', 'Category', 'Event', 'Message', 'User', 'IP'];
        const rows = logs.map(log => [
            log.timestamp,
            log.level,
            log.category,
            log.event,
            `"${log.message.replace(/"/g, '""')}"`,
            log.source?.userId || '',
            log.source?.ip || ''
        ]);
        
        return [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');
    }
    
    importLogs(logsData) {
        try {
            const data = typeof logsData === 'string' ? 
                JSON.parse(logsData) : logsData;
            
            if (!Array.isArray(data.logs)) {
                throw new Error('Invalid log format');
            }
            
            const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
            const mergedLogs = [...existingLogs, ...data.logs];
            
            // Sort by timestamp
            mergedLogs.sort((a, b) => {
                const timeA = new Date(
                    a.timestamp || this.decryptEntry(a).timestamp
                );
                const timeB = new Date(
                    b.timestamp || this.decryptEntry(b).timestamp
                );
                return timeA - timeB;
            });
            
            // Limit to max entries
            if (mergedLogs.length > this.config.maxLogEntries) {
                mergedLogs.splice(0, mergedLogs.length - this.config.maxLogEntries);
            }
            
            localStorage.setItem('audit_logs', JSON.stringify(mergedLogs));
            
            // Rebuild index
            this.buildIndex();
            
            this.log({
                category: 'SYSTEM',
                level: 'INFO',
                event: 'AUDIT_LOG_IMPORT',
                message: 'Audit logs imported successfully',
                details: {
                    importedCount: data.logs.length,
                    totalCount: mergedLogs.length
                }
            });
            
            return {
                success: true,
                imported: data.logs.length,
                total: mergedLogs.length
            };
        } catch (error) {
            this.log({
                category: 'SYSTEM',
                level: 'ERROR',
                event: 'AUDIT_LOG_IMPORT_FAILED',
                message: 'Failed to import audit logs',
                details: {
                    error: error.message
                }
            });
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // 9. Cleanup and Maintenance
    setupCleanup() {
        // Run cleanup every hour
        setInterval(() => {
            this.cleanupOldLogs();
        }, 60 * 60 * 1000);
    }
    
    cleanupOldLogs() {
        const retentionMs = this.config.retentionDays * 24 * 60 * 60 * 1000;
        const cutoffDate = new Date(Date.now() - retentionMs);
        
        const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
        const originalLength = logs.length;
        
        const filteredLogs = logs.filter(log => {
            const logDate = new Date(
                log.timestamp || this.decryptEntry(log).timestamp
            );
            return logDate >= cutoffDate;
        });
        
        if (filteredLogs.length < originalLength) {
            localStorage.setItem('audit_logs', JSON.stringify(filteredLogs));
            this.buildIndex();
            
            this.log({
                category: 'SYSTEM',
                level: 'INFO',
                event: 'AUDIT_LOG_CLEANUP',
                message: 'Cleaned up old audit log entries',
                details: {
                    removed: originalLength - filteredLogs.length,
                    remaining: filteredLogs.length,
                    cutoffDate: cutoffDate.toISOString()
                }
            });
        }
    }
    
    clearAllLogs() {
        localStorage.removeItem('audit_logs');
        localStorage.removeItem('audit_log_index');
        
        this.log({
            category: 'SYSTEM',
            level: 'WARN',
            event: 'AUDIT_LOG_CLEARED',
            message: 'All audit logs cleared by administrator',
            details: {
                clearedBy: this.getCurrentUserId() || 'system'
            }
        });
        
        this.initStorage();
    }
    
    // 10. Utility Functions
    generateId() {
        return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getClientIP() {
        // This is a simplified version
        // In production, IP should come from server-side
        return '127.0.0.1';
    }
    
    getCurrentUserId() {
        try {
            const user = JSON.parse(localStorage.getItem('st_ai_current_user') || 'null');
            return user?.id || 'anonymous';
        } catch {
            return 'anonymous';
        }
    }
    
    getSessionId() {
        return sessionStorage.getItem('session_id') || 'no-session';
    }
    
    exportCriticalLogs() {
        const criticalLogs = this.queryLogs({ level: 'CRITICAL' }, 50, 0);
        
        if (criticalLogs.logs.length > 0) {
            const exportData = this.exportLogs({
                format: 'json',
                filters: { level: 'CRITICAL' }
            });
            
            // In production, send to external system
            this.sendToExternalSystem(exportData);
        }
    }
    
    sendToExternalSystem(data) {
        // This would send to an external logging system
        // For now, just log it
        console.log('Critical logs for external system:', data);
    }
    
    // 11. Public API
    getStatus() {
        const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
        
        return {
            enabled: this.config.enabled,
            totalLogs: logs.length,
            lastLog: logs.length > 0 ? 
                this.decryptEntry(logs[logs.length - 1]).timestamp : 
                'No logs',
            storageUsed: (JSON.stringify(logs).length / 1024).toFixed(2) + ' KB',
            config: {
                maxLogEntries: this.config.maxLogEntries,
                retentionDays: this.config.retentionDays,
                logLevels: this.config.logLevels
            }
        };
    }
    
    // 12. Integration Helpers
    logSecurityEvent(event, details) {
        return this.log({
            category: 'SECURITY',
            level: 'INFO',
            event: event,
            message: `Security event: ${event}`,
            details: details
        });
    }
    
    logAuthenticationEvent(event, userId, success, details = {}) {
        return this.log({
            category: 'AUTHENTICATION',
            level: success ? 'INFO' : 'WARN',
            event: event,
            message: `${event} ${success ? 'successful' : 'failed'} for user ${userId}`,
            details: {
                userId: userId,
                success: success,
                ...details
            }
        });
    }
    
    logAdminAction(action, target, details = {}) {
        return this.log({
            category: 'ADMIN',
            level: 'INFO',
            event: 'ADMIN_ACTION',
            message: `Admin action: ${action} on ${target}`,
            details: {
                action: action,
                target: target,
                ...details
            }
        });
    }
}

// Create global instance
const auditLog = new AuditLogSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuditLogSystem, auditLog };
}

// Add CSS for notifications
const auditLogStyles = document.createElement('style');
auditLogStyles.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .audit-log-notification {
        animation: slideUp 0.3s ease;
    }
`;
document.head.appendChild(auditLogStyles);

// Request notification permission
if (Notification.permission === 'default') {
    Notification.requestPermission();
}