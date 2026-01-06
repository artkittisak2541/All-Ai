/**
 * ST AI Router - Rate Limiting System
 * Prevents abuse and brute force attacks
 */

class RateLimiter {
    constructor() {
        this.limits = {
            // Global limits
            global: {
                requests: 1000,
                windowMs: 60 * 1000 // 1 minute
            },
            
            // Authentication limits
            auth: {
                login: {
                    attempts: 5,
                    windowMs: 15 * 60 * 1000, // 15 minutes
                    blockDuration: 30 * 60 * 1000 // 30 minutes
                },
                passwordReset: {
                    attempts: 3,
                    windowMs: 60 * 60 * 1000 // 1 hour
                }
            },
            
            // API limits
            api: {
                general: {
                    requests: 100,
                    windowMs: 60 * 1000 // 1 minute
                },
                admin: {
                    requests: 200,
                    windowMs: 60 * 1000
                }
            },
            
            // Resource limits
            resources: {
                fileUpload: {
                    requests: 10,
                    windowMs: 60 * 60 * 1000 // 1 hour
                },
                export: {
                    requests: 5,
                    windowMs: 60 * 60 * 1000
                }
            }
        };
        
        this.storage = new Map();
        this.blocks = new Map();
        
        this.init();
    }
    
    init() {
        // Load stored data
        this.loadFromStorage();
        
        // Setup cleanup interval
        this.setupCleanup();
        
        // Monitor for abuse patterns
        this.setupMonitoring();
    }
    
    // 1. Core Rate Limiting
    async checkLimit(key, limitConfig, increment = true) {
        const now = Date.now();
        const windowMs = limitConfig.windowMs;
        
        // Check if blocked
        const blockInfo = this.blocks.get(key);
        if (blockInfo && blockInfo.expires > now) {
            return {
                allowed: false,
                remaining: 0,
                reset: blockInfo.expires,
                reason: 'blocked',
                retryAfter: Math.ceil((blockInfo.expires - now) / 1000)
            };
        }
        
        // Get or create entry
        let entry = this.storage.get(key) || {
            count: 0,
            resetTime: now + windowMs,
            firstRequest: now,
            lastRequest: now
        };
        
        // Reset if window has passed
        if (now > entry.resetTime) {
            entry = {
                count: 1,
                resetTime: now + windowMs,
                firstRequest: now,
                lastRequest: now
            };
        } else if (increment) {
            entry.count++;
            entry.lastRequest = now;
        }
        
        // Check limit
        if (entry.count > limitConfig.requests) {
            // Auto-block if configured
            if (limitConfig.blockDuration) {
                this.block(key, limitConfig.blockDuration, 'Rate limit exceeded');
            }
            
            return {
                allowed: false,
                remaining: 0,
                reset: entry.resetTime,
                reason: 'limit_exceeded',
                retryAfter: Math.ceil((entry.resetTime - now) / 1000)
            };
        }
        
        // Update storage
        if (increment) {
            this.storage.set(key, entry);
            this.saveToStorage();
        }
        
        return {
            allowed: true,
            remaining: Math.max(0, limitConfig.requests - entry.count),
            reset: entry.resetTime,
            retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        };
    }
    
    // 2. Block Management
    block(key, durationMs, reason = 'Manual block') {
        const expires = Date.now() + durationMs;
        this.blocks.set(key, { expires, reason, blockedAt: new Date().toISOString() });
        
        // Log block
        this.logBlock(key, reason, durationMs);
        
        // Save to storage
        this.saveBlocks();
        
        return true;
    }
    
    unblock(key) {
        const wasBlocked = this.blocks.delete(key);
        if (wasBlocked) {
            this.saveBlocks();
            this.logUnblock(key);
        }
        return wasBlocked;
    }
    
    isBlocked(key) {
        const blockInfo = this.blocks.get(key);
        if (!blockInfo) return false;
        
        if (Date.now() > blockInfo.expires) {
            this.blocks.delete(key);
            this.saveBlocks();
            return false;
        }
        
        return {
            blocked: true,
            expires: blockInfo.expires,
            reason: blockInfo.reason,
            retryAfter: Math.ceil((blockInfo.expires - Date.now()) / 1000)
        };
    }
    
    // 3. Specific Rate Limits
    async checkLogin(username, ip) {
        const userKey = `login:user:${username}`;
        const ipKey = `login:ip:${ip}`;
        
        // Check user attempts
        const userCheck = await this.checkLimit(
            userKey, 
            this.limits.auth.login
        );
        
        // Check IP attempts
        const ipCheck = await this.checkLimit(
            ipKey,
            this.limits.auth.login
        );
        
        // Return the most restrictive result
        if (!userCheck.allowed || !ipCheck.allowed) {
            return userCheck.remaining < ipCheck.remaining ? userCheck : ipCheck;
        }
        
        return {
            allowed: true,
            remaining: Math.min(userCheck.remaining, ipCheck.remaining),
            reset: Math.max(userCheck.reset, ipCheck.reset)
        };
    }
    
    async checkAPI(endpoint, userId = null) {
        const limitConfig = endpoint.includes('/admin/') ? 
            this.limits.api.admin : 
            this.limits.api.general;
        
        const keys = [`api:endpoint:${endpoint}`];
        
        if (userId) {
            keys.push(`api:user:${userId}:${endpoint}`);
        }
        
        // Check all keys
        const results = await Promise.all(
            keys.map(key => this.checkLimit(key, limitConfig))
        );
        
        // Return the most restrictive result
        const failed = results.find(r => !r.allowed);
        if (failed) return failed;
        
        // Find the one with least remaining
        const mostRestrictive = results.reduce((min, curr) => 
            curr.remaining < min.remaining ? curr : min
        );
        
        return mostRestrictive;
    }
    
    async checkResource(resource, userId) {
        const key = `resource:${resource}:${userId}`;
        const limitConfig = this.limits.resources[resource] || 
            this.limits.resources.general;
        
        return await this.checkLimit(key, limitConfig);
    }
    
    // 4. Dynamic Rate Limiting
    async checkDynamic(key, baseLimit, factors = {}) {
        let adjustedLimit = baseLimit;
        
        // Adjust based on factors
        if (factors.trustScore && factors.trustScore < 50) {
            adjustedLimit = Math.floor(baseLimit * 0.5); // Reduce by 50%
        }
        
        if (factors.isNewUser) {
            adjustedLimit = Math.floor(baseLimit * 0.3); // Reduce for new users
        }
        
        if (factors.isAdmin) {
            adjustedLimit = baseLimit * 2; // Increase for admins
        }
        
        const limitConfig = {
            requests: adjustedLimit,
            windowMs: 60 * 1000
        };
        
        return await this.checkLimit(key, limitConfig);
    }
    
    // 5. Storage Management
    saveToStorage() {
        try {
            const data = {
                storage: Array.from(this.storage.entries()),
                timestamp: Date.now()
            };
            
            localStorage.setItem('rate_limiter_storage', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save rate limiter storage:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('rate_limiter_storage') || '{}');
            
            if (data.storage && Array.isArray(data.storage)) {
                this.storage = new Map(data.storage);
            }
            
            if (data.blocks && Array.isArray(data.blocks)) {
                this.blocks = new Map(data.blocks);
            }
        } catch (error) {
            console.error('Failed to load rate limiter storage:', error);
        }
    }
    
    saveBlocks() {
        try {
            const data = Array.from(this.blocks.entries());
            localStorage.setItem('rate_limiter_blocks', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save rate limiter blocks:', error);
        }
    }
    
    // 6. Cleanup
    setupCleanup() {
        // Cleanup every 5 minutes
        setInterval(() => {
            this.cleanupExpired();
        }, 5 * 60 * 1000);
    }
    
    cleanupExpired() {
        const now = Date.now();
        let cleaned = false;
        
        // Clean expired rate limit entries
        for (const [key, entry] of this.storage.entries()) {
            if (now > entry.resetTime + 3600000) { // 1 hour after reset
                this.storage.delete(key);
                cleaned = true;
            }
        }
        
        // Clean expired blocks
        for (const [key, block] of this.blocks.entries()) {
            if (now > block.expires) {
                this.blocks.delete(key);
                cleaned = true;
            }
        }
        
        if (cleaned) {
            this.saveToStorage();
            this.saveBlocks();
        }
    }
    
    // 7. Monitoring and Analytics
    setupMonitoring() {
        // Monitor for abuse patterns
        setInterval(() => {
            this.analyzePatterns();
        }, 60 * 1000);
    }
    
    analyzePatterns() {
        const now = Date.now();
        const patterns = [];
        
        // Look for rapid sequential requests
        for (const [key, entry] of this.storage.entries()) {
            if (key.startsWith('api:')) {
                const requestRate = entry.count / ((now - entry.firstRequest) / 1000);
                
                if (requestRate > 10) { // More than 10 requests per second
                    patterns.push({
                        key,
                        requestRate: requestRate.toFixed(2),
                        count: entry.count,
                        type: 'HIGH_FREQUENCY'
                    });
                }
            }
        }
        
        // Take action on patterns
        if (patterns.length > 0) {
            this.handlePatterns(patterns);
        }
    }
    
    handlePatterns(patterns) {
        patterns.forEach(pattern => {
            if (pattern.type === 'HIGH_FREQUENCY') {
                // Temporary block for high frequency attacks
                this.block(
                    pattern.key,
                    5 * 60 * 1000, // 5 minutes
                    'High frequency requests detected'
                );
                
                // Log the incident
                this.logIncident(pattern);
            }
        });
    }
    
    // 8. Logging
    logBlock(key, reason, duration) {
        const logEntry = {
            type: 'BLOCK',
            key,
            reason,
            duration,
            timestamp: new Date().toISOString(),
            ip: this.extractIPFromKey(key)
        };
        
        this.saveLog(logEntry);
        
        // Also send to audit log if available
        if (window.auditLog) {
            window.auditLog.logSecurityEvent('RATE_LIMIT_BLOCK', logEntry);
        }
    }
    
    logUnblock(key) {
        const logEntry = {
            type: 'UNBLOCK',
            key,
            timestamp: new Date().toISOString()
        };
        
        this.saveLog(logEntry);
    }
    
    logIncident(pattern) {
        const logEntry = {
            type: 'INCIDENT',
            pattern,
            timestamp: new Date().toISOString()
        };
        
        this.saveLog(logEntry);
        
        // Trigger alert
        this.triggerAlert('Rate limit incident detected', pattern);
    }
    
    saveLog(entry) {
        const logs = JSON.parse(localStorage.getItem('rate_limiter_logs') || '[]');
        logs.push(entry);
        
        if (logs.length > 1000) {
            logs.shift();
        }
        
        localStorage.setItem('rate_limiter_logs', JSON.stringify(logs));
    }
    
    // 9. Alerting
    triggerAlert(message, data) {
        // Show in-page alert
        this.showAlert(message, data);
        
        // Send to monitoring system
        this.sendToMonitoring(message, data);
    }
    
    showAlert(message, data) {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
            animation: slideDown 0.3s ease;
            max-width: 500px;
            text-align: center;
        `;
        
        alertDiv.innerHTML = `
            <strong>🚨 Rate Limiter Alert</strong>
            <div style="margin-top: 5px; font-size: 14px;">${message}</div>
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
            ">
                ✕
            </button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 10000);
    }
    
    sendToMonitoring(message, data) {
        // In production, send to monitoring system
        const event = {
            type: 'RATE_LIMITER_ALERT',
            message,
            data,
            timestamp: new Date().toISOString()
        };
        
        // Store for monitoring dashboard
        const alerts = JSON.parse(localStorage.getItem('monitoring_alerts') || '[]');
        alerts.push(event);
        
        if (alerts.length > 100) {
            alerts.shift();
        }
        
        localStorage.setItem('monitoring_alerts', JSON.stringify(alerts));
    }
    
    // 10. Utility Functions
    extractIPFromKey(key) {
        const match = key.match(/ip:([^:]+)/);
        return match ? match[1] : 'unknown';
    }
    
    getStats() {
        const now = Date.now();
        
        // Calculate active entries
        let activeEntries = 0;
        let totalRequests = 0;
        
        for (const entry of this.storage.values()) {
            if (now < entry.resetTime) {
                activeEntries++;
                totalRequests += entry.count;
            }
        }
        
        // Get blocked count
        let activeBlocks = 0;
        for (const block of this.blocks.values()) {
            if (now < block.expires) {
                activeBlocks++;
            }
        }
        
        // Get recent logs
        const logs = JSON.parse(localStorage.getItem('rate_limiter_logs') || '[]');
        const recentLogs = logs.slice(-10);
        
        return {
            activeEntries,
            totalRequests,
            activeBlocks,
            storageSize: this.storage.size,
            blocksSize: this.blocks.size,
            recentLogs,
            lastCleanup: this.lastCleanupTime || 'Never'
        };
    }
    
    // 11. Reset Functions
    resetKey(key) {
        const existed = this.storage.delete(key);
        if (existed) {
            this.saveToStorage();
        }
        return existed;
    }
    
    resetAll() {
        this.storage.clear();
        this.blocks.clear();
        this.saveToStorage();
        this.saveBlocks();
        
        // Log reset
        this.logReset();
        
        return true;
    }
    
    logReset() {
        const logEntry = {
            type: 'RESET_ALL',
            timestamp: new Date().toISOString(),
            resetBy: this.getCurrentUser()
        };
        
        this.saveLog(logEntry);
    }
    
    getCurrentUser() {
        try {
            const user = JSON.parse(localStorage.getItem('st_ai_current_user') || 'null');
            return user?.username || 'system';
        } catch {
            return 'system';
        }
    }
    
    // 12. Integration Helpers
    middleware() {
        return async (req, res, next) => {
            // This would be used in a server environment
            // For client-side, we use the check methods directly
            return next();
        };
    }
    
    // 13. Public API
    getLimits() {
        return {
            ...this.limits,
            dynamic: {
                enabled: true,
                factors: ['trustScore', 'isNewUser', 'isAdmin']
            }
        };
    }
    
    updateLimit(path, newLimit) {
        const parts = path.split('.');
        let current = this.limits;
        
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
        
        const lastPart = parts[parts.length - 1];
        const oldValue = current[lastPart];
        current[lastPart] = newLimit;
        
        // Log the change
        this.logLimitChange(path, oldValue, newLimit);
        
        return { success: true, oldValue, newValue: newLimit };
    }
    
    logLimitChange(path, oldValue, newValue) {
        const logEntry = {
            type: 'LIMIT_CHANGE',
            path,
            oldValue,
            newValue,
            timestamp: new Date().toISOString(),
            changedBy: this.getCurrentUser()
        };
        
        this.saveLog(logEntry);
    }
}

// Create global instance
const rateLimiter = new RateLimiter();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RateLimiter, rateLimiter };
}

// Add CSS for alerts
const rateLimiterStyles = document.createElement('style');
rateLimiterStyles.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(rateLimiterStyles);