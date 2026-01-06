/**
 * ST AI Router - Anti-Tampering System
 * Protects against code modification and reverse engineering
 */

class AntiTamper {
    constructor() {
        this.checksums = new Map();
        this.integrityChecks = [];
        this.obfuscationLevel = 'high';
        
        this.init();
    }
    
    init() {
        // Calculate initial checksums
        this.calculateChecksums();
        
        // Setup integrity monitoring
        this.setupIntegrityMonitoring();
        
        // Setup obfuscation
        this.setupObfuscation();
        
        // Setup anti-debugging
        this.setupAntiDebugging();
    }
    
    // 1. Code Integrity Checking
    calculateChecksums() {
        // Calculate checksum of critical functions
        this.addIntegrityCheck(() => {
            const authSystemCode = authSystem.toString();
            return this.calculateHash(authSystemCode);
        }, 'authSystem');
        
        this.addIntegrityCheck(() => {
            const securitySystemCode = securitySystem.toString();
            return this.calculateHash(securitySystemCode);
        }, 'securitySystem');
        
        // Check DOM integrity
        this.addIntegrityCheck(() => {
            const criticalElements = ['loginForm', 'adminPanel', 'userTable'];
            return criticalElements.map(id => {
                const element = document.getElementById(id);
                return element ? this.calculateHash(element.outerHTML) : 'MISSING';
            });
        }, 'domIntegrity');
    }
    
    addIntegrityCheck(checkFunction, name) {
        const initialValue = checkFunction();
        this.checksums.set(name, initialValue);
        this.integrityChecks.push({ name, check: checkFunction });
    }
    
    verifyIntegrity() {
        const violations = [];
        
        this.integrityChecks.forEach(({ name, check }) => {
            const currentValue = check();
            const storedValue = this.checksums.get(name);
            
            if (JSON.stringify(currentValue) !== JSON.stringify(storedValue)) {
                violations.push({
                    component: name,
                    stored: storedValue,
                    current: currentValue,
                    type: 'INTEGRITY_VIOLATION'
                });
            }
        });
        
        return violations;
    }
    
    // 2. Anti-Debugging Techniques
    setupAntiDebugging() {
        // Debugger detection
        const debuggerCheck = () => {
            const start = new Date().getTime();
            debugger;
            const end = new Date().getTime();
            return (end - start) > 1000;
        };
        
        // Periodic debugger checks
        setInterval(() => {
            if (debuggerCheck()) {
                this.triggerTamperResponse('DEBUGGER_DETECTED');
            }
        }, 1000);
        
        // Breakpoint detection
        this.setupBreakpointDetection();
        
        // Memory tampering detection
        this.setupMemoryProtection();
    }
    
    setupBreakpointDetection() {
        // Override console methods to detect breakpoints
        const consoleMethods = ['log', 'error', 'warn', 'info'];
        consoleMethods.forEach(method => {
            const original = console[method];
            console[method] = function(...args) {
                // Check if we're in a debugging session
                const error = new Error();
                const stack = error.stack || '';
                
                if (stack.includes('debugger')) {
                    antiTamper.triggerTamperResponse('BREAKPOINT_DETECTED');
                }
                
                return original.apply(this, args);
            };
        });
    }
    
    setupMemoryProtection() {
        // Protect sensitive data in memory
        const sensitiveKeys = ['password', 'token', 'secret', 'key'];
        
        // Monitor memory access
        this.setupMemoryAccessMonitoring();
        
        // Encrypt sensitive data in memory
        this.encryptSensitiveMemory();
    }
    
    // 3. Code Obfuscation
    setupObfuscation() {
        if (this.obfuscationLevel === 'high') {
            this.applyAdvancedObfuscation();
        } else {
            this.applyBasicObfuscation();
        }
    }
    
    applyAdvancedObfuscation() {
        // Rename variables and functions (simulated)
        this.obfuscateFunctionNames();
        
        // Add junk code
        this.addJunkCode();
        
        // Control flow obfuscation
        this.obfuscateControlFlow();
        
        // String encryption
        this.encryptStrings();
    }
    
    obfuscateFunctionNames() {
        // In a real implementation, this would be done at build time
        // This is just a simulation
        const functionMap = new Map();
        
        // Rename security functions
        const securityFunctions = [
            'validateLogin',
            'createSecureSession',
            'generateCSRFToken',
            'sanitizeInput'
        ];
        
        securityFunctions.forEach((funcName, index) => {
            const newName = `_${this.generateRandomName()}_${index}`;
            functionMap.set(funcName, newName);
        });
        
        // Store mapping for internal use
        this.functionMap = functionMap;
    }
    
    addJunkCode() {
        // Add meaningless code to confuse reverse engineers
        const junkFunctions = [
            () => {
                const x = Math.random();
                if (x > 0.5) {
                    return () => {};
                } else {
                    return function() { return null; };
                }
            },
            () => {
                for (let i = 0; i < 1000; i++) {
                    // Do nothing
                }
                return false;
            }
        ];
        
        // Execute junk code periodically
        setInterval(() => {
            if (Math.random() > 0.9) {
                junkFunctions[Math.floor(Math.random() * junkFunctions.length)]();
            }
        }, 5000);
    }
    
    obfuscateControlFlow() {
        // Obfuscate control flow with indirect jumps
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay) {
            // Add random delay variation
            const variedDelay = delay + (Math.random() * 100 - 50);
            return originalSetTimeout.call(this, callback, Math.max(0, variedDelay));
        };
    }
    
    encryptStrings() {
        // Encrypt sensitive strings
        const stringMap = new Map();
        
        const sensitiveStrings = [
            'admin',
            'password',
            'token',
            'session',
            'secret'
        ];
        
        sensitiveStrings.forEach(str => {
            const encrypted = btoa(this.xorEncrypt(str, 'secret_key'));
            stringMap.set(str, encrypted);
        });
        
        this.stringMap = stringMap;
    }
    
    // 4. Runtime Protection
    setupIntegrityMonitoring() {
        // Monitor script modifications
        this.monitorScriptElements();
        
        // Monitor function modifications
        this.monitorFunctionIntegrity();
        
        // Monitor global object modifications
        this.monitorGlobalObject();
        
        // Periodic integrity checks
        setInterval(() => {
            const violations = this.verifyIntegrity();
            if (violations.length > 0) {
                this.handleTampering(violations);
            }
        }, 30000);
    }
    
    monitorScriptElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.tagName === 'SCRIPT') {
                            this.triggerTamperResponse('SCRIPT_INJECTION');
                            node.remove();
                        }
                    });
                }
            });
        });
        
        observer.observe(document.head, { childList: true });
        observer.observe(document.body, { childList: true });
    }
    
    monitorFunctionIntegrity() {
        // Monitor critical function modifications
        const criticalFunctions = {
            'authSystem.login': authSystem.login,
            'securitySystem.validateSession': securitySystem.validateSession,
            'antiTamper.verifyIntegrity': this.verifyIntegrity
        };
        
        Object.entries(criticalFunctions).forEach(([name, originalFunc]) => {
            const wrapper = function(...args) {
                // Check function integrity before execution
                if (originalFunc.toString() !== wrapper._original.toString()) {
                    antiTamper.triggerTamperResponse('FUNCTION_TAMPERING');
                    return null;
                }
                return originalFunc.apply(this, args);
            };
            
            wrapper._original = originalFunc;
            
            // Replace function with wrapper
            const parts = name.split('.');
            let obj = window;
            for (let i = 0; i < parts.length - 1; i++) {
                obj = obj[parts[i]];
            }
            obj[parts[parts.length - 1]] = wrapper;
        });
    }
    
    monitorGlobalObject() {
        // Prevent modification of critical global objects
        const protectedObjects = ['localStorage', 'sessionStorage', 'document', 'window'];
        
        protectedObjects.forEach(objName => {
            const obj = window[objName];
            if (obj) {
                Object.seal(obj);
                Object.freeze(Object.getPrototypeOf(obj));
            }
        });
        
        // Monitor global property modifications
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (obj === window || obj === document) {
                antiTamper.logTamperAttempt('GLOBAL_PROPERTY_MODIFICATION', {
                    object: obj.constructor.name,
                    property: prop
                });
                return obj;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
    }
    
    // 5. Tamper Response System
    triggerTamperResponse(type, details = {}) {
        this.logTamperAttempt(type, details);
        
        // Take appropriate action based on severity
        switch (type) {
            case 'DEBUGGER_DETECTED':
            case 'BREAKPOINT_DETECTED':
                this.handleDebuggerDetection();
                break;
                
            case 'FUNCTION_TAMPERING':
            case 'INTEGRITY_VIOLATION':
                this.handleCodeTampering();
                break;
                
            case 'SCRIPT_INJECTION':
                this.handleScriptInjection();
                break;
                
            default:
                this.handleGeneralTampering();
        }
    }
    
    handleDebuggerDetection() {
        // Redirect to error page
        window.location.href = '/security-error.html?reason=debugging';
    }
    
    handleCodeTampering() {
        // Clear all sensitive data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login with warning
        window.location.href = '/login.html?warning=tampering';
    }
    
    handleScriptInjection() {
        // Reload page to remove injected scripts
        location.reload();
    }
    
    handleGeneralTampering() {
        // Show warning and log user out
        if (window.showSecurityAlert) {
            window.showSecurityAlert('Security violation detected. Please login again.', 'error');
        }
        
        setTimeout(() => {
            localStorage.removeItem('st_ai_current_user');
            window.location.href = '/login.html';
        }, 3000);
    }
    
    // 6. Utility Functions
    calculateHash(str) {
        // Simple hash function for demonstration
        // In production, use SHA-256 or similar
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
    
    generateRandomName() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    xorEncrypt(str, key) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    }
    
    // 7. Logging and Reporting
    logTamperAttempt(type, details) {
        const logEntry = {
            type,
            timestamp: new Date().toISOString(),
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Save to tamper log
        const tamperLogs = JSON.parse(localStorage.getItem('tamper_logs') || '[]');
        tamperLogs.push(logEntry);
        
        // Keep only last 100 entries
        if (tamperLogs.length > 100) {
            tamperLogs.shift();
        }
        
        localStorage.setItem('tamper_logs', JSON.stringify(tamperLogs));
        
        // Send to server in production
        this.reportToServer(logEntry);
        
        return logEntry;
    }
    
    reportToServer(logEntry) {
        // In production, send to security monitoring server
        // This is a simulated version
        if (navigator.sendBeacon) {
            const data = JSON.stringify(logEntry);
            navigator.sendBeacon('/api/security/log', data);
        }
    }
    
    // 8. Security Self-Test
    runSelfTest() {
        const tests = [
            {
                name: 'Integrity Check',
                test: () => this.verifyIntegrity().length === 0,
                weight: 40
            },
            {
                name: 'Debugger Detection',
                test: () => {
                    const start = new Date().getTime();
                    debugger;
                    const end = new Date().getTime();
                    return (end - start) < 100;
                },
                weight: 30
            },
            {
                name: 'Memory Protection',
                test: () => {
                    try {
                        // Try to access protected memory
                        Object.defineProperty(window, 'testProp', { value: 'test' });
                        return false;
                    } catch {
                        return true;
                    }
                },
                weight: 20
            },
            {
                name: 'Script Injection Protection',
                test: () => {
                    // Test if script injection is blocked
                    const script = document.createElement('script');
                    script.textContent = 'window.injectionTest = true';
                    document.head.appendChild(script);
                    const result = window.injectionTest === true;
                    delete window.injectionTest;
                    return !result;
                },
                weight: 10
            }
        ];
        
        let totalScore = 0;
        const results = [];
        
        tests.forEach(({ name, test, weight }) => {
            try {
                const passed = test();
                results.push({ name, passed });
                if (passed) totalScore += weight;
            } catch (error) {
                results.push({ name, passed: false, error: error.message });
            }
        });
        
        return {
            score: totalScore,
            results,
            timestamp: new Date().toISOString()
        };
    }
    
    // 9. Public API
    getSecurityStatus() {
        const integrity = this.verifyIntegrity();
        const selfTest = this.runSelfTest();
        const tamperLogs = JSON.parse(localStorage.getItem('tamper_logs') || '[]');
        
        return {
            integrity: {
                violations: integrity,
                status: integrity.length === 0 ? 'SECURE' : 'COMPROMISED'
            },
            selfTest,
            recentTamperAttempts: tamperLogs.slice(-5),
            obfuscationLevel: this.obfuscationLevel,
            protectionActive: true
        };
    }
    
    // 10. Memory Access Monitoring
    setupMemoryAccessMonitoring() {
        // Protect sensitive objects
        const sensitiveObjects = [
            authSystem,
            securitySystem,
            this
        ];
        
        sensitiveObjects.forEach(obj => {
            this.protectObject(obj);
        });
        
        // Monitor access to sensitive data
        this.monitorSensitiveAccess();
    }
    
    protectObject(obj) {
        // Make object non-configurable and non-writable
        Object.keys(obj).forEach(key => {
            try {
                Object.defineProperty(obj, key, {
                    configurable: false,
                    writable: false,
                    enumerable: true
                });
            } catch (e) {
                // Some properties might not be configurable
            }
        });
        
        // Freeze the object
        Object.freeze(obj);
    }
    
    monitorSensitiveAccess() {
        // Override Function constructor to detect eval-like behavior
        const OriginalFunction = Function;
        window.Function = function(...args) {
            antiTamper.logTamperAttempt('FUNCTION_CONSTRUCTOR_CALL', {
                args: args.map(arg => typeof arg === 'string' ? arg.substring(0, 50) : typeof arg)
            });
            return OriginalFunction(...args);
        };
        
        // Monitor eval usage
        const originalEval = eval;
        window.eval = function(code) {
            antiTamper.logTamperAttempt('EVAL_CALL', {
                code: typeof code === 'string' ? code.substring(0, 100) : typeof code
            });
            return originalEval(code);
        };
    }
    
    encryptSensitiveMemory() {
        // Store sensitive data encrypted in memory
        const encryptionKey = this.generateRandomName();
        
        // Override sensitive data access
        const sensitiveData = {
            adminKey: localStorage.getItem('st_ai_admin_key'),
            users: localStorage.getItem('st_ai_users')
        };
        
        // Store encrypted
        Object.entries(sensitiveData).forEach(([key, value]) => {
            if (value) {
                const encrypted = this.xorEncrypt(value, encryptionKey);
                localStorage.setItem(`enc_${key}`, btoa(encrypted));
                localStorage.removeItem(key);
            }
        });
        
        // Store encryption key in a non-obvious place
        sessionStorage.setItem('mem_key', btoa(encryptionKey));
    }
    
    decryptSensitiveMemory() {
        // Decrypt when needed
        const encryptionKey = atob(sessionStorage.getItem('mem_key') || '');
        if (!encryptionKey) return null;
        
        const encryptedData = {
            adminKey: localStorage.getItem('enc_adminKey'),
            users: localStorage.getItem('enc_users')
        };
        
        const decrypted = {};
        Object.entries(encryptedData).forEach(([key, value]) => {
            if (value) {
                const decryptedValue = this.xorEncrypt(atob(value), encryptionKey);
                decrypted[key] = decryptedValue;
            }
        });
        
        return decrypted;
    }
}

// Create global instance
const antiTamper = new AntiTamper();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AntiTamper, antiTamper };
}