/**
 * ST AI Router - Advanced Security System
 * Multi-layer protection against hacking attempts
 */

class SecuritySystem {
    constructor() {
        this.config = {
            maxLoginAttempts: 5,
            lockoutDuration: 15 * 60 * 1000, // 15 minutes
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            allowedIPs: [],
            blockedIPs: [],
            enableRateLimiting: true,
            enableXSSProtection: true,
            enableCSRFProtection: true,
            enableSQLInjectionProtection: true,
            enableFileUploadProtection: true
        };
        
        this.init();
    }
    
    init() {
        // Load security configuration
        this.loadConfig();
        
        // Initialize security modules
        this.initModules();
        
        // Start security monitoring
        this.startMonitoring();
    }
    
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('st_security_config');
            if (savedConfig) {
                this.config = { ...this.config, ...JSON.parse(savedConfig) };
            }
        } catch (error) {
            console.error('Security config loading error:', error);
        }
    }
    
    initModules() {
        // Initialize security event listeners
        this.setupEventListeners();
        
        // Setup mutation observer for DOM tampering detection
        this.setupDOMMonitoring();
        
        // Setup keyboard/mouse monitoring for bot detection
        this.setupUserActivityMonitoring();
        
        // Setup network request monitoring
        this.setupNetworkMonitoring();
    }
    
    // ==================== CORE SECURITY FUNCTIONS ====================
    
    // 1. Input Validation & Sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Remove potentially dangerous characters
        let sanitized = input
            .replace(/[<>]/g, '') // Remove HTML tags
            .replace(/javascript:/gi, '') // Remove JS protocols
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/\\/g, '') // Remove backslashes
            .trim();
        
        // Prevent SQL injection patterns
        const sqlPatterns = [
            /(\b)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)(\b)/gi,
            /('|"|`|--|\/\*|\*\/|;)/g
        ];
        
        sqlPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });
        
        // Prevent XSS attacks
        sanitized = this.escapeHTML(sanitized);
        
        return sanitized;
    }
    
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 2. Authentication Protection
    validateLogin(username, password) {
        const threats = [];
        
        // Check for brute force attempts
        const loginAttempts = this.getLoginAttempts(username);
        if (loginAttempts >= this.config.maxLoginAttempts) {
            threats.push({
                type: 'BRUTE_FORCE',
                severity: 'HIGH',
                message: 'Too many login attempts'
            });
            return { valid: false, threats };
        }
        
        // Check username patterns
        if (!this.isValidUsername(username)) {
            threats.push({
                type: 'INVALID_USERNAME',
                severity: 'MEDIUM',
                message: 'Invalid username format'
            });
        }
        
        // Check password strength
        if (!this.isStrongPassword(password)) {
            threats.push({
                type: 'WEAK_PASSWORD',
                severity: 'LOW',
                message: 'Password does not meet security requirements'
            });
        }
        
        return { 
            valid: threats.length === 0, 
            threats 
        };
    }
    
    // 3. Session Security
    createSecureSession(userData) {
        const sessionId = this.generateSecureId();
        const timestamp = Date.now();
        const userAgent = navigator.userAgent;
        const ip = this.getClientInfo().ip;
        
        const session = {
            id: sessionId,
            userId: userData.id,
            createdAt: timestamp,
            expiresAt: timestamp + this.config.sessionTimeout,
            userAgent: userAgent,
            ip: ip,
            token: this.generateSessionToken(userData),
            lastActivity: timestamp
        };
        
        // Store session
        this.storeSession(session);
        
        // Set secure cookies
        this.setSecureCookie('session_id', sessionId);
        this.setSecureCookie('session_token', session.token);
        
        return session;
    }
    
    validateSession() {
        const sessionId = this.getCookie('session_id');
        const sessionToken = this.getCookie('session_token');
        
        if (!sessionId || !sessionToken) {
            return { valid: false, reason: 'No session found' };
        }
        
        const session = this.getSession(sessionId);
        
        if (!session) {
            return { valid: false, reason: 'Session not found' };
        }
        
        if (session.token !== sessionToken) {
            return { valid: false, reason: 'Invalid session token' };
        }
        
        if (Date.now() > session.expiresAt) {
            this.destroySession(sessionId);
            return { valid: false, reason: 'Session expired' };
        }
        
        // Update last activity
        session.lastActivity = Date.now();
        this.updateSession(session);
        
        return { valid: true, session };
    }
    
    // 4. CSRF Protection
    generateCSRFToken() {
        const token = this.generateSecureId();
        this.setSecureCookie('csrf_token', token);
        return token;
    }
    
    validateCSRFToken(token) {
        const storedToken = this.getCookie('csrf_token');
        return token === storedToken;
    }
    
    // 5. Rate Limiting
    checkRateLimit(action, identifier, limit = 10, windowMs = 60000) {
        const key = `rate_limit_${action}_${identifier}`;
        const now = Date.now();
        
        let attempts = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Remove old attempts
        attempts = attempts.filter(time => now - time < windowMs);
        
        if (attempts.length >= limit) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: attempts[0] + windowMs
            };
        }
        
        // Add new attempt
        attempts.push(now);
        localStorage.setItem(key, JSON.stringify(attempts));
        
        return {
            allowed: true,
            remaining: limit - attempts.length,
            resetAt: attempts[0] + windowMs
        };
    }
    
    // ==================== THREAT DETECTION ====================
    
    detectThreats() {
        const threats = [];
        
        // Check for DevTools
        if (this.isDevToolsOpen()) {
            threats.push({
                type: 'DEVTOOLS_OPEN',
                severity: 'LOW',
                message: 'Browser developer tools are open'
            });
        }
        
        // Check for debugging
        if (this.isDebugging()) {
            threats.push({
                type: 'DEBUGGING_DETECTED',
                severity: 'HIGH',
                message: 'Debugging tools detected'
            });
        }
        
        // Check for automated scripts
        if (this.isAutomatedScript()) {
            threats.push({
                type: 'AUTOMATED_SCRIPT',
                severity: 'HIGH',
                message: 'Automated script detected'
            });
        }
        
        // Check for VPN/Proxy
        if (this.isUsingVPN()) {
            threats.push({
                type: 'VPN_DETECTED',
                severity: 'MEDIUM',
                message: 'VPN/Proxy detected'
            });
        }
        
        return threats;
    }
    
    // ==================== SECURITY MONITORING ====================
    
    setupEventListeners() {
        // Monitor form submissions
        document.addEventListener('submit', (e) => {
            this.logSecurityEvent('FORM_SUBMIT', {
                formId: e.target.id,
                action: e.target.action
            });
        });
        
        // Monitor AJAX requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options] = args;
            securitySystem.logSecurityEvent('FETCH_REQUEST', {
                url: typeof url === 'string' ? url : url.url,
                method: options?.method || 'GET'
            });
            return originalFetch.apply(this, args);
        };
        
        // Monitor localStorage access
        this.monitorLocalStorage();
        
        // Monitor console usage
        this.monitorConsole();
    }
    
    setupDOMMonitoring() {
        // Monitor DOM changes for tampering
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            this.checkForMaliciousElement(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    setupUserActivityMonitoring() {
        let lastActivity = Date.now();
        
        const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
        
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                lastActivity = Date.now();
            }, { passive: true });
        });
        
        // Check for bot-like behavior
        setInterval(() => {
            const now = Date.now();
            const inactiveTime = now - lastActivity;
            
            if (inactiveTime > 300000) { // 5 minutes
                this.logSecurityEvent('INACTIVITY_DETECTED', {
                    inactiveTime: inactiveTime
                });
            }
        }, 60000); // Check every minute
    }
    
    setupNetworkMonitoring() {
        // Monitor WebSocket connections
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(...args) {
            const ws = new originalWebSocket(...args);
            securitySystem.logSecurityEvent('WEBSOCKET_CREATED', {
                url: args[0]
            });
            return ws;
        };
        
        // Monitor XMLHttpRequest
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function(...args) {
                securitySystem.logSecurityEvent('XHR_REQUEST', {
                    method: args[0],
                    url: args[1]
                });
                return originalOpen.apply(this, args);
            };
            
            return xhr;
        };
    }
    
    // ==================== HELPER FUNCTIONS ====================
    
    generateSecureId() {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    generateSessionToken(userData) {
        const data = `${userData.id}:${Date.now()}:${this.generateSecureId()}`;
        return btoa(data);
    }
    
    getClientInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ip: this.getClientIP() // This would come from server in production
        };
    }
    
    getClientIP() {
        // Note: This is client-side and not reliable for security
        // In production, IP should come from server-side
        return '127.0.0.1';
    }
    
    setSecureCookie(name, value, days = 7) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        
        // Set secure cookie flags
        document.cookie = `${name}=${value}${expires}; path=/; Secure; SameSite=Strict; HttpOnly`;
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    
    // ==================== THREAT DETECTION HELPERS ====================
    
    isDevToolsOpen() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        return widthThreshold || heightThreshold;
    }
    
    isDebugging() {
        const startTime = performance.now();
        debugger;
        const endTime = performance.now();
        return endTime - startTime > 100;
    }
    
    isAutomatedScript() {
        // Check for Selenium/webdriver
        if (window.navigator.webdriver || 
            window.document.documentElement.getAttribute('webdriver') ||
            navigator.plugins.length === 0) {
            return true;
        }
        
        // Check for headless browser
        if (!window.chrome || 
            navigator.userAgent.indexOf('Headless') !== -1 ||
            navigator.userAgent.indexOf('PhantomJS') !== -1) {
            return true;
        }
        
        return false;
    }
    
    isUsingVPN() {
        // Check for common VPN/Proxy indicators
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        const languages = navigator.languages;
        
        // In production, this should be server-side IP geolocation check
        return false;
    }
    
    isValidUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }
    
    isStrongPassword(password) {
        if (password.length < 8) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[0-9]/.test(password)) return false;
        if (!/[^A-Za-z0-9]/.test(password)) return false;
        return true;
    }
    
    getLoginAttempts(username) {
        const attempts = JSON.parse(localStorage.getItem(`login_attempts_${username}`) || '[]');
        const now = Date.now();
        const validAttempts = attempts.filter(time => now - time < this.config.lockoutDuration);
        return validAttempts.length;
    }
    
    incrementLoginAttempt(username) {
        const attempts = JSON.parse(localStorage.getItem(`login_attempts_${username}`) || '[]');
        attempts.push(Date.now());
        localStorage.setItem(`login_attempts_${username}`, JSON.stringify(attempts));
    }
    
    resetLoginAttempts(username) {
        localStorage.removeItem(`login_attempts_${username}`);
    }
    
    // ==================== LOGGING & AUDITING ====================
    
    logSecurityEvent(type, data) {
        const event = {
            type,
            timestamp: new Date().toISOString(),
            data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Save to localStorage (in production, send to server)
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push(event);
        
        // Keep only last 1000 events
        if (logs.length > 1000) {
            logs.shift();
        }
        
        localStorage.setItem('security_logs', JSON.stringify(logs));
        
        // Trigger security alert if needed
        this.checkForSecurityAlert(event);
        
        return event;
    }
    
    checkForSecurityAlert(event) {
        const alertRules = [
            {
                condition: (e) => e.type === 'BRUTE_FORCE',
                action: () => this.triggerAlert('Multiple failed login attempts detected!')
            },
            {
                condition: (e) => e.type === 'DEBUGGING_DETECTED',
                action: () => this.triggerAlert('Debugging tools detected!')
            },
            {
                condition: (e) => e.type === 'XSS_ATTEMPT',
                action: () => this.triggerAlert('XSS attack attempt detected!')
            }
        ];
        
        alertRules.forEach(rule => {
            if (rule.condition(event)) {
                rule.action();
            }
        });
    }
    
    triggerAlert(message) {
        // Show security alert to user
        if (window.showSecurityAlert) {
            window.showSecurityAlert(message);
        } else {
            console.warn('SECURITY ALERT:', message);
        }
    }
    
    // ==================== START MONITORING ====================
    
    startMonitoring() {
        // Start periodic security checks
        setInterval(() => {
            this.runSecurityChecks();
        }, 30000); // Every 30 seconds
        
        // Monitor page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logSecurityEvent('PAGE_HIDDEN', {
                    hiddenAt: new Date().toISOString()
                });
            } else {
                this.logSecurityEvent('PAGE_VISIBLE', {
                    visibleAt: new Date().toISOString()
                });
            }
        });
    }
    
    runSecurityChecks() {
        // Run all security checks periodically
        const threats = this.detectThreats();
        
        if (threats.length > 0) {
            threats.forEach(threat => {
                this.logSecurityEvent(threat.type, threat);
            });
            
            // Take action based on threat severity
            const highThreats = threats.filter(t => t.severity === 'HIGH');
            if (highThreats.length > 0) {
                this.handleHighThreat(highThreats);
            }
        }
        
        // Check session validity
        const sessionCheck = this.validateSession();
        if (!sessionCheck.valid) {
            this.logSecurityEvent('INVALID_SESSION', sessionCheck);
        }
    }
    
    handleHighThreat(threats) {
        // For high threats, take immediate action
        threats.forEach(threat => {
            switch (threat.type) {
                case 'DEBUGGING_DETECTED':
                    // Redirect to error page
                    window.location.href = '/security-error.html';
                    break;
                case 'AUTOMATED_SCRIPT':
                    // Block further actions
                    this.blockUserActions();
                    break;
            }
        });
    }
    
    blockUserActions() {
        // Disable all form submissions
        document.querySelectorAll('form').forEach(form => {
            form.style.pointerEvents = 'none';
            form.style.opacity = '0.5';
        });
        
        // Disable all buttons
        document.querySelectorAll('button').forEach(button => {
            button.disabled = true;
        });
        
        // Show blocking message
        this.showBlockMessage();
    }
    
    showBlockMessage() {
        const blockDiv = document.createElement('div');
        blockDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        `;
        
        blockDiv.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">🚫</div>
            <h1 style="color: #ff6b6b; margin-bottom: 20px;">Security Alert</h1>
            <p style="max-width: 600px; margin-bottom: 30px; line-height: 1.6;">
                Suspicious activity detected. Access to this application has been temporarily blocked 
                for security reasons. Please contact the administrator if you believe this is an error.
            </p>
            <button onclick="location.reload()" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
            ">
                Reload Page
            </button>
        `;
        
        document.body.appendChild(blockDiv);
    }
    
    // ==================== SESSION MANAGEMENT ====================
    
    storeSession(session) {
        const sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        sessions.push(session);
        localStorage.setItem('active_sessions', JSON.stringify(sessions));
    }
    
    getSession(sessionId) {
        const sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        return sessions.find(s => s.id === sessionId);
    }
    
    updateSession(updatedSession) {
        let sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        sessions = sessions.map(s => 
            s.id === updatedSession.id ? updatedSession : s
        );
        localStorage.setItem('active_sessions', JSON.stringify(sessions));
    }
    
    destroySession(sessionId) {
        let sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        sessions = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem('active_sessions', JSON.stringify(sessions));
        
        // Clear session cookies
        this.deleteCookie('session_id');
        this.deleteCookie('session_token');
    }
    
    // ==================== ADDITIONAL SECURITY CHECKS ====================
    
    checkForMaliciousElement(element) {
        const suspiciousAttributes = [
            'onload', 'onerror', 'onclick', 'onmouseover',
            'javascript:', 'data:text/html', 'vbscript:'
        ];
        
        // Check element attributes
        suspiciousAttributes.forEach(attr => {
            if (element.hasAttribute(attr) || 
                element.outerHTML.includes(attr)) {
                this.logSecurityEvent('MALICIOUS_ELEMENT', {
                    element: element.outerHTML,
                    attribute: attr
                });
                
                // Remove the malicious element
                element.remove();
            }
        });
        
        // Check for script injection
        if (element.tagName === 'SCRIPT') {
            const scriptContent = element.textContent || element.src || '';
            const maliciousPatterns = [
                /document\.cookie/,
                /localStorage/,
                /XMLHttpRequest/,
                /fetch\(/,
                /eval\(/,
                /Function\(/
            ];
            
            maliciousPatterns.forEach(pattern => {
                if (pattern.test(scriptContent)) {
                    this.logSecurityEvent('MALICIOUS_SCRIPT', {
                        script: scriptContent.substring(0, 100)
                    });
                    element.remove();
                }
            });
        }
    }
    
    monitorLocalStorage() {
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        const originalRemoveItem = localStorage.removeItem;
        
        localStorage.setItem = function(key, value) {
            // Log sensitive operations
            if (key.includes('password') || key.includes('token') || key.includes('session')) {
                securitySystem.logSecurityEvent('LOCALSTORAGE_SET_SENSITIVE', {
                    key: key,
                    valueLength: value ? value.length : 0
                });
            }
            return originalSetItem.call(this, key, value);
        };
        
        localStorage.getItem = function(key) {
            // Log access to sensitive data
            if (key.includes('password') || key.includes('token') || key.includes('session')) {
                securitySystem.logSecurityEvent('LOCALSTORAGE_GET_SENSITIVE', {
                    key: key
                });
            }
            return originalGetItem.call(this, key);
        };
        
        localStorage.removeItem = function(key) {
            // Log removal of sensitive data
            if (key.includes('password') || key.includes('token') || key.includes('session')) {
                securitySystem.logSecurityEvent('LOCALSTORAGE_REMOVE_SENSITIVE', {
                    key: key
                });
            }
            return originalRemoveItem.call(this, key);
        };
    }
    
    monitorConsole() {
        // Override console methods to detect debugging
        ['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
            const original = console[method];
            console[method] = function(...args) {
                // Log console usage (except in development)
                if (!window.location.hostname.includes('localhost')) {
                    securitySystem.logSecurityEvent('CONSOLE_USAGE', {
                        method: method,
                        args: args.map(arg => 
                            typeof arg === 'string' ? arg.substring(0, 100) : typeof arg
                        )
                    });
                }
                return original.apply(this, args);
            };
        });
    }
    
    // ==================== PUBLIC API ====================
    
    // Main security check function
    checkSecurity() {
        return {
            threats: this.detectThreats(),
            session: this.validateSession(),
            clientInfo: this.getClientInfo(),
            securityScore: this.calculateSecurityScore()
        };
    }
    
    calculateSecurityScore() {
        let score = 100;
        const threats = this.detectThreats();
        
        threats.forEach(threat => {
            switch (threat.severity) {
                case 'HIGH': score -= 30; break;
                case 'MEDIUM': score -= 15; break;
                case 'LOW': score -= 5; break;
            }
        });
        
        return Math.max(0, score);
    }
    
    // Security report for admin
    generateSecurityReport() {
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        const sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        
        return {
            timestamp: new Date().toISOString(),
            totalLogs: logs.length,
            activeSessions: sessions.length,
            recentThreats: logs.slice(-10),
            securityScore: this.calculateSecurityScore(),
            recommendations: this.generateRecommendations()
        };
    }
    
    generateRecommendations() {
        const recommendations = [];
        const threats = this.detectThreats();
        
        if (threats.some(t => t.type === 'WEAK_PASSWORD')) {
            recommendations.push('Enforce stronger password policies');
        }
        
        if (threats.some(t => t.type === 'DEVTOOLS_OPEN')) {
            recommendations.push('Consider disabling DevTools in production');
        }
        
        const securityScore = this.calculateSecurityScore();
        if (securityScore < 70) {
            recommendations.push('Review security configuration and consider additional protections');
        }
        
        return recommendations;
    }
}

// Create global instance
const securitySystem = new SecuritySystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecuritySystem, securitySystem };
}

// Auto-start security system
window.addEventListener('load', () => {
    // Initial security check
    const securityCheck = securitySystem.checkSecurity();
    
    if (securityCheck.threats.length > 0) {
        console.warn('Initial security threats detected:', securityCheck.threats);
    }
    
    // Log page load
    securitySystem.logSecurityEvent('PAGE_LOAD', {
        url: window.location.href,
        referrer: document.referrer
    });
});

// Global security alert function
window.showSecurityAlert = function(message, type = 'warning') {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : type === 'warning' ? '#ffd93d' : '#6bcf7f'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        font-family: Arial, sans-serif;
        animation: slideIn 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 20px;">
                ${type === 'error' ? '🚨' : type === 'warning' ? '⚠️' : '✅'}
            </div>
            <div>
                <strong style="display: block; margin-bottom: 5px;">Security Alert</strong>
                <div style="font-size: 14px;">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px;">
                ✕
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
};

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);