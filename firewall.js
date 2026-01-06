/**
 * ST AI Router - Application-Level Firewall
 * Blocks malicious requests and patterns
 */

class ApplicationFirewall {
    constructor() {
        this.rules = {
            ipBlacklist: new Set(),
            ipWhitelist: new Set(),
            userBlacklist: new Set(),
            rateLimits: new Map(),
            patterns: this.getMaliciousPatterns(),
            thresholds: this.getSecurityThresholds()
        };
        
        this.stats = {
            blockedRequests: 0,
            allowedRequests: 0,
            threatsDetected: 0,
            lastReset: Date.now()
        };
        
        this.init();
    }
    
    init() {
        // Load rules from storage
        this.loadRules();
        
        // Setup request interception
        this.setupRequestInterception();
        
        // Setup periodic cleanup
        this.setupCleanup();
        
        // Start monitoring
        this.startMonitoring();
    }
    
    // 1. Rule Management
    getMaliciousPatterns() {
        return {
            sqlInjection: [
                /(\b)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)(\b)/gi,
                /('|"|`|--|\/\*|\*\/|;)/g,
                /(\b)(OR|AND)(\s+)(\d+)(\s*)=(\s*)(\d+)/gi,
                /(\b)(LOAD_FILE|INTO_FILE|INTO OUTFILE)(\b)/gi
            ],
            
            xss: [
                /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
                /javascript:/gi,
                /on\w+=/gi,
                /data:text\/html/gi,
                /vbscript:/gi,
                /expression\(/gi,
                /url\(/gi
            ],
            
            pathTraversal: [
                /\.\.\//g,
                /\.\.\\/g,
                /etc\/passwd/gi,
                /win\.ini/gi,
                /boot\.ini/gi
            ],
            
            commandInjection: [
                /(\b)(system|exec|shell_exec|passthru|popen|proc_open)(\s*)\(/gi,
                /(\b)(cmd|bash|sh|powershell|command)(\b)/gi,
                /\$\(/g,
                /\`/g
            ],
            
            fileInclusion: [
                /(\b)(include|require|include_once|require_once)(\s*)\(/gi,
                /\.\.\/(\.\.\/)+/g,
                /php:\/\/filter/gi,
                /data:\/\/text\/plain/gi
            ]
        };
    }
    
    getSecurityThresholds() {
        return {
            maxRequestsPerMinute: 60,
            maxFailedLogins: 5,
            maxConcurrentSessions: 3,
            requestSizeLimit: 10485760, // 10MB
            passwordAttemptWindow: 15 * 60 * 1000 // 15 minutes
        };
    }
    
    loadRules() {
        try {
            const savedRules = JSON.parse(localStorage.getItem('firewall_rules') || '{}');
            
            if (savedRules.ipBlacklist) {
                this.rules.ipBlacklist = new Set(savedRules.ipBlacklist);
            }
            
            if (savedRules.ipWhitelist) {
                this.rules.ipWhitelist = new Set(savedRules.ipWhitelist);
            }
            
            if (savedRules.userBlacklist) {
                this.rules.userBlacklist = new Set(savedRules.userBlacklist);
            }
            
            console.log('Firewall rules loaded');
        } catch (error) {
            console.error('Failed to load firewall rules:', error);
        }
    }
    
    saveRules() {
        try {
            const rulesToSave = {
                ipBlacklist: Array.from(this.rules.ipBlacklist),
                ipWhitelist: Array.from(this.rules.ipWhitelist),
                userBlacklist: Array.from(this.rules.userBlacklist)
            };
            
            localStorage.setItem('firewall_rules', JSON.stringify(rulesToSave));
        } catch (error) {
            console.error('Failed to save firewall rules:', error);
        }
    }
    
    // 2. Request Analysis
    analyzeRequest(request) {
        const threats = [];
        
        // Check IP
        if (this.isIPBlacklisted(request.ip)) {
            threats.push({
                type: 'BLACKLISTED_IP',
                severity: 'HIGH',
                ip: request.ip
            });
        }
        
        // Check for malicious patterns
        const patternThreats = this.checkForMaliciousPatterns(request);
        threats.push(...patternThreats);
        
        // Check rate limits
        const rateLimitCheck = this.checkRateLimit(request);
        if (!rateLimitCheck.allowed) {
            threats.push({
                type: 'RATE_LIMIT_EXCEEDED',
                severity: 'MEDIUM',
                details: rateLimitCheck
            });
        }
        
        // Check request size
        if (request.size > this.rules.thresholds.requestSizeLimit) {
            threats.push({
                type: 'REQUEST_TOO_LARGE',
                severity: 'MEDIUM',
                size: request.size,
                limit: this.rules.thresholds.requestSizeLimit
            });
        }
        
        return threats;
    }
    
    checkForMaliciousPatterns(request) {
        const threats = [];
        const patterns = this.rules.patterns;
        
        // Check all data in request
        const requestData = JSON.stringify(request);
        
        Object.entries(patterns).forEach(([type, patternList]) => {
            patternList.forEach(pattern => {
                if (pattern.test(requestData)) {
                    threats.push({
                        type: `${type.toUpperCase()}_ATTEMPT`,
                        severity: 'HIGH',
                        pattern: pattern.source.substring(0, 50)
                    });
                }
            });
        });
        
        return threats;
    }
    
    checkRateLimit(request) {
        const ip = request.ip;
        const now = Date.now();
        const windowMs = 60000; // 1 minute
        
        // Get or create rate limit entry
        let rateEntry = this.rules.rateLimits.get(ip) || {
            count: 0,
            firstRequest: now,
            lastRequest: now,
            blocked: false
        };
        
        // Reset if window has passed
        if (now - rateEntry.firstRequest > windowMs) {
            rateEntry = {
                count: 1,
                firstRequest: now,
                lastRequest: now,
                blocked: false
            };
        } else {
            rateEntry.count++;
            rateEntry.lastRequest = now;
        }
        
        // Check if exceeded limit
        if (rateEntry.count > this.rules.thresholds.maxRequestsPerMinute) {
            rateEntry.blocked = true;
            this.blockIP(ip, 'Rate limit exceeded');
        }
        
        // Update rate limits
        this.rules.rateLimits.set(ip, rateEntry);
        
        return {
            allowed: !rateEntry.blocked,
            count: rateEntry.count,
            limit: this.rules.thresholds.maxRequestsPerMinute,
            resetIn: windowMs - (now - rateEntry.firstRequest)
        };
    }
    
    // 3. Blocking Mechanisms
    blockIP(ip, reason = 'Suspicious activity') {
        this.rules.ipBlacklist.add(ip);
        this.saveRules();
        
        this.logFirewallEvent('IP_BLOCKED', {
            ip: ip,
            reason: reason,
            timestamp: new Date().toISOString()
        });
        
        return true;
    }
    
    unblockIP(ip) {
        this.rules.ipBlacklist.delete(ip);
        this.saveRules();
        
        this.logFirewallEvent('IP_UNBLOCKED', {
            ip: ip,
            timestamp: new Date().toISOString()
        });
        
        return true;
    }
    
    blockUser(userId, reason = 'Security violation') {
        this.rules.userBlacklist.add(userId);
        this.saveRules();
        
        this.logFirewallEvent('USER_BLOCKED', {
            userId: userId,
            reason: reason,
            timestamp: new Date().toISOString()
        });
        
        return true;
    }
    
    isIPBlacklisted(ip) {
        return this.rules.ipBlacklist.has(ip);
    }
    
    isUserBlacklisted(userId) {
        return this.rules.userBlacklist.has(userId);
    }
    
    // 4. Request Interception
    setupRequestInterception() {
        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const [url, options] = args;
            
            // Create request object for analysis
            const request = {
                url: typeof url === 'string' ? url : url.url,
                method: options?.method || 'GET',
                headers: options?.headers || {},
                body: options?.body,
                ip: 'client', // In production, this would be the actual IP
                size: options?.body ? options.body.toString().length : 0,
                timestamp: Date.now()
            };
            
            // Analyze request
            const threats = firewall.analyzeRequest(request);
            
            if (threats.length > 0) {
                // Block malicious requests
                firewall.handleThreats(threats, request);
                throw new Error('Request blocked by firewall');
            }
            
            // Update stats
            firewall.stats.allowedRequests++;
            
            // Add security headers
            const modifiedOptions = {
                ...options,
                headers: {
                    ...options?.headers,
                    'X-Firewall-Check': 'passed',
                    'X-Request-ID': firewall.generateRequestId()
                }
            };
            
            return originalFetch.call(this, url, modifiedOptions);
        };
        
        // Intercept XMLHttpRequest
        this.interceptXHR();
        
        // Intercept form submissions
        this.interceptForms();
    }
    
    interceptXHR() {
        const originalXHR = window.XMLHttpRequest;
        const self = this;
        
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;
            
            xhr.open = function(method, url, ...args) {
                this._method = method;
                this._url = url;
                return originalOpen.apply(this, [method, url, ...args]);
            };
            
            xhr.send = function(data) {
                const request = {
                    url: this._url,
                    method: this._method,
                    body: data,
                    ip: 'client',
                    size: data ? data.toString().length : 0,
                    timestamp: Date.now()
                };
                
                const threats = self.analyzeRequest(request);
                
                if (threats.length > 0) {
                    self.handleThreats(threats, request);
                    this.dispatchEvent(new Event('error'));
                    return;
                }
                
                self.stats.allowedRequests++;
                return originalSend.call(this, data);
            };
            
            return xhr;
        };
    }
    
    interceptForms() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = new FormData(form);
            
            const request = {
                url: form.action || window.location.href,
                method: form.method || 'POST',
                body: Object.fromEntries(formData),
                ip: 'client',
                size: formData.toString().length,
                timestamp: Date.now()
            };
            
            const threats = this.analyzeRequest(request);
            
            if (threats.length > 0) {
                e.preventDefault();
                this.handleThreats(threats, request);
                this.showBlockMessage(form);
            }
        }, true);
    }
    
    // 5. Threat Handling
    handleThreats(threats, request) {
        this.stats.blockedRequests++;
        this.stats.threatsDetected += threats.length;
        
        // Log the threats
        threats.forEach(threat => {
            this.logFirewallEvent('THREAT_DETECTED', {
                threat: threat,
                request: request,
                timestamp: new Date().toISOString()
            });
        });
        
        // Take action based on threat severity
        const highThreats = threats.filter(t => t.severity === 'HIGH');
        const mediumThreats = threats.filter(t => t.severity === 'MEDIUM');
        
        if (highThreats.length > 0) {
            // Immediate blocking for high threats
            this.blockIP(request.ip, 'High severity threat detected');
            this.showHighThreatAlert(highThreats);
        } else if (mediumThreats.length > 0) {
            // Warning for medium threats
            this.showWarningAlert(mediumThreats);
        }
        
        // Increment threat counter for IP
        this.incrementThreatCounter(request.ip);
    }
    
    incrementThreatCounter(ip) {
        const key = `threat_count_${ip}`;
        let count = parseInt(localStorage.getItem(key) || '0');
        count++;
        localStorage.setItem(key, count.toString());
        
        // Auto-block after 5 threats
        if (count >= 5) {
            this.blockIP(ip, 'Multiple threat attempts');
        }
    }
    
    // 6. Alert System
    showHighThreatAlert(threats) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'firewall-high-alert';
        alertDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: #dc3545;
                color: white;
                padding: 15px;
                text-align: center;
                z-index: 10000;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            ">
                <strong>🚨 SECURITY ALERT:</strong> 
                High severity threat detected. Your request has been blocked.
                <button onclick="this.parentElement.remove()" style="
                    background: none;
                    border: 1px solid white;
                    color: white;
                    margin-left: 15px;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                ">
                    Dismiss
                </button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 10000);
    }
    
    showWarningAlert(threats) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'firewall-warning-alert';
        alertDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: #ffc107;
                color: #212529;
                padding: 10px;
                text-align: center;
                z-index: 9999;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            ">
                <strong>⚠️ WARNING:</strong> 
                Suspicious activity detected. Please review your input.
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    showBlockMessage(form) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            font-family: Arial, sans-serif;
        `;
        
        messageDiv.textContent = 'This request was blocked by the firewall for security reasons.';
        
        form.parentNode.insertBefore(messageDiv, form);
        
        // Highlight suspicious fields
        this.highlightSuspiciousFields(form);
    }
    
    highlightSuspiciousFields(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const value = input.value;
            if (value) {
                // Check for suspicious content
                const isSuspicious = this.isSuspiciousContent(value);
                if (isSuspicious) {
                    input.style.border = '2px solid #dc3545';
                    input.style.backgroundColor = '#fff5f5';
                    
                    // Add warning icon
                    const warningSpan = document.createElement('span');
                    warningSpan.innerHTML = '⚠️';
                    warningSpan.style.marginLeft = '5px';
                    input.parentNode.insertBefore(warningSpan, input.nextSibling);
                }
            }
        });
    }
    
    isSuspiciousContent(content) {
        const patterns = this.rules.patterns;
        
        for (const patternList of Object.values(patterns)) {
            for (const pattern of patternList) {
                if (pattern.test(content)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // 7. Monitoring and Reporting
    startMonitoring() {
        // Periodic stats update
        setInterval(() => {
            this.updateStats();
        }, 60000); // Every minute
        
        // Periodic cleanup
        setInterval(() => {
            this.cleanupOldEntries();
        }, 300000); // Every 5 minutes
        
        // Log startup
        this.logFirewallEvent('FIREWALL_STARTED', {
            version: '1.0',
            timestamp: new Date().toISOString()
        });
    }
    
    updateStats() {
        const now = Date.now();
        const hourInMs = 60 * 60 * 1000;
        
        // Reset stats if more than an hour has passed
        if (now - this.stats.lastReset > hourInMs) {
            this.stats = {
                blockedRequests: 0,
                allowedRequests: 0,
                threatsDetected: 0,
                lastReset: now
            };
        }
        
        // Save stats
        localStorage.setItem('firewall_stats', JSON.stringify(this.stats));
    }
    
    cleanupOldEntries() {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        // Clean up old rate limits
        this.rules.rateLimits.forEach((entry, ip) => {
            if (now - entry.lastRequest > dayInMs) {
                this.rules.rateLimits.delete(ip);
            }
        });
        
        // Clean up old threat counters
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('threat_count_')) {
                const lastUpdated = parseInt(localStorage.getItem(`${key}_time`) || '0');
                if (now - lastUpdated > dayInMs) {
                    localStorage.removeItem(key);
                    localStorage.removeItem(`${key}_time`);
                }
            }
        }
    }
    
    // 8. Logging
    logFirewallEvent(type, data) {
        const event = {
            type,
            timestamp: new Date().toISOString(),
            data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Save to firewall logs
        const logs = JSON.parse(localStorage.getItem('firewall_logs') || '[]');
        logs.push(event);
        
        // Keep only last 1000 events
        if (logs.length > 1000) {
            logs.shift();
        }
        
        localStorage.setItem('firewall_logs', JSON.stringify(logs));
        
        // Send to server in production
        this.sendToSecurityServer(event);
        
        return event;
    }
    
    sendToSecurityServer(event) {
        // In production, send to security monitoring server
        if (navigator.sendBeacon && !window.location.hostname.includes('localhost')) {
            const data = JSON.stringify(event);
            navigator.sendBeacon('/api/firewall/log', data);
        }
    }
    
    // 9. Utility Functions
    generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getFirewallStats() {
        return {
            ...this.stats,
            blockedIPs: this.rules.ipBlacklist.size,
            blockedUsers: this.rules.userBlacklist.size,
            activeRateLimits: this.rules.rateLimits.size,
            uptime: Date.now() - this.stats.lastReset
        };
    }
    
    getSecurityReport() {
        const logs = JSON.parse(localStorage.getItem('firewall_logs') || '[]');
        const recentThreats = logs.filter(log => 
            log.type === 'THREAT_DETECTED'
        ).slice(-10);
        
        return {
            timestamp: new Date().toISOString(),
            stats: this.getFirewallStats(),
            recentThreats: recentThreats,
            blockedIPs: Array.from(this.rules.ipBlacklist),
            blockedUsers: Array.from(this.rules.userBlacklist)
        };
    }
    
    // 10. Admin Functions
    clearAllBlocks() {
        this.rules.ipBlacklist.clear();
        this.rules.userBlacklist.clear();
        this.rules.rateLimits.clear();
        this.saveRules();
        
        this.logFirewallEvent('ALL_BLOCKS_CLEARED', {
            timestamp: new Date().toISOString(),
            clearedBy: 'admin'
        });
        
        return true;
    }
    
    exportRules() {
        const exportData = {
            rules: {
                ipBlacklist: Array.from(this.rules.ipBlacklist),
                ipWhitelist: Array.from(this.rules.ipWhitelist),
                userBlacklist: Array.from(this.rules.userBlacklist)
            },
            stats: this.stats,
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    importRules(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            
            if (importData.rules) {
                this.rules.ipBlacklist = new Set(importData.rules.ipBlacklist || []);
                this.rules.ipWhitelist = new Set(importData.rules.ipWhitelist || []);
                this.rules.userBlacklist = new Set(importData.rules.userBlacklist || []);
                this.saveRules();
                
                this.logFirewallEvent('RULES_IMPORTED', {
                    timestamp: new Date().toISOString(),
                    importedBy: 'admin'
                });
                
                return { success: true, message: 'Rules imported successfully' };
            }
        } catch (error) {
            return { success: false, message: 'Invalid import data' };
        }
    }
}

// Create global instance
const firewall = new ApplicationFirewall();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApplicationFirewall, firewall };
}

// Add CSS for firewall alerts
const firewallStyles = document.createElement('style');
firewallStyles.textContent = `
    .firewall-high-alert {
        animation: slideDown 0.3s ease;
    }
    
    .firewall-warning-alert {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    input.suspicious-field {
        border: 2px solid #dc3545 !important;
        background-color: #fff5f5 !important;
    }
    
    .firewall-block-message {
        background: #f8d7da;
        color: #721c24;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        font-family: Arial, sans-serif;
    }
`;
document.head.appendChild(firewallStyles);