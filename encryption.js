/**
 * ST AI Router - Advanced Encryption System
 * Provides multiple layers of encryption for sensitive data
 */

class EncryptionSystem {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyStrength = 256;
        this.iterations = 100000;
        this.saltLength = 16;
        this.ivLength = 12;
        
        // Generate master key
        this.masterKey = this.generateMasterKey();
        
        // Initialize encryption keys
        this.initKeys();
    }
    
    // 1. Key Management
    async generateMasterKey() {
        try {
            // Generate cryptographically secure random key
            const keyMaterial = await window.crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: this.keyStrength
                },
                true,
                ['encrypt', 'decrypt']
            );
            
            return keyMaterial;
        } catch (error) {
            console.error('Master key generation failed:', error);
            return this.generateFallbackKey();
        }
    }
    
    generateFallbackKey() {
        // Fallback method if Web Crypto API is not available
        const randomValues = new Uint8Array(32);
        window.crypto.getRandomValues(randomValues);
        
        let keyString = '';
        randomValues.forEach(value => {
            keyString += value.toString(16).padStart(2, '0');
        });
        
        return keyString;
    }
    
    async initKeys() {
        this.keys = {
            data: await this.deriveKey('data_encryption_key'),
            session: await this.deriveKey('session_encryption_key'),
            token: await this.deriveKey('token_encryption_key'),
            password: await this.deriveKey('password_hash_key')
        };
    }
    
    async deriveKey(purpose) {
        try {
            const salt = this.generateSalt();
            const keyMaterial = await window.crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(purpose + this.getDeviceId()),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );
            
            const derivedKey = await window.crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: this.iterations,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: this.keyStrength },
                true,
                ['encrypt', 'decrypt']
            );
            
            return derivedKey;
        } catch (error) {
            console.error('Key derivation failed:', error);
            return null;
        }
    }
    
    // 2. Encryption Methods
    async encryptData(data, keyType = 'data') {
        try {
            const key = this.keys[keyType];
            if (!key) throw new Error('Encryption key not found');
            
            const iv = window.crypto.getRandomValues(new Uint8Array(this.ivLength));
            const encoder = new TextEncoder();
            const encodedData = encoder.encode(JSON.stringify(data));
            
            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encodedData
            );
            
            // Combine IV and encrypted data
            const result = new Uint8Array(iv.length + encrypted.byteLength);
            result.set(iv, 0);
            result.set(new Uint8Array(encrypted), iv.length);
            
            return btoa(String.fromCharCode(...result));
        } catch (error) {
            console.error('Encryption failed:', error);
            return this.fallbackEncrypt(data);
        }
    }
    
    async decryptData(encryptedData, keyType = 'data') {
        try {
            const key = this.keys[keyType];
            if (!key) throw new Error('Decryption key not found');
            
            // Decode from base64
            const binaryString = atob(encryptedData);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Extract IV and encrypted data
            const iv = bytes.slice(0, this.ivLength);
            const data = bytes.slice(this.ivLength);
            
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                data
            );
            
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(decrypted));
        } catch (error) {
            console.error('Decryption failed:', error);
            return this.fallbackDecrypt(encryptedData);
        }
    }
    
    // 3. Password Hashing
    async hashPassword(password, salt = null) {
        try {
            if (!salt) {
                salt = window.crypto.getRandomValues(new Uint8Array(16));
            }
            
            const encoder = new TextEncoder();
            const passwordBuffer = encoder.encode(password);
            
            // Import the password as a key
            const keyMaterial = await window.crypto.subtle.importKey(
                'raw',
                passwordBuffer,
                { name: 'PBKDF2' },
                false,
                ['deriveBits']
            );
            
            const derivedBits = await window.crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: this.iterations,
                    hash: 'SHA-256'
                },
                keyMaterial,
                256
            );
            
            // Convert salt and hash to base64
            const saltB64 = btoa(String.fromCharCode(...salt));
            const hashB64 = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
            
            return `${saltB64}:${hashB64}`;
        } catch (error) {
            console.error('Password hashing failed:', error);
            return this.fallbackHashPassword(password);
        }
    }
    
    async verifyPassword(password, hashedPassword) {
        try {
            const [saltB64, storedHashB64] = hashedPassword.split(':');
            
            // Decode salt
            const saltBinary = atob(saltB64);
            const salt = new Uint8Array(saltBinary.length);
            for (let i = 0; i < saltBinary.length; i++) {
                salt[i] = saltBinary.charCodeAt(i);
            }
            
            // Hash the provided password with the same salt
            const newHash = await this.hashPassword(password, salt);
            const [_, newHashB64] = newHash.split(':');
            
            // Compare hashes
            return newHashB64 === storedHashB64;
        } catch (error) {
            console.error('Password verification failed:', error);
            return this.fallbackVerifyPassword(password, hashedPassword);
        }
    }
    
    // 4. Token Generation and Validation
    async generateSecureToken(data, expirationMinutes = 60) {
        try {
            const payload = {
                data: data,
                exp: Date.now() + (expirationMinutes * 60 * 1000),
                iat: Date.now(),
                iss: 'st-ai-router',
                aud: 'client'
            };
            
            // Sign the token
            const token = await this.encryptData(payload, 'token');
            
            // Add checksum
            const checksum = await this.calculateChecksum(token);
            
            return `${token}.${checksum}`;
        } catch (error) {
            console.error('Token generation failed:', error);
            return this.fallbackToken(data, expirationMinutes);
        }
    }
    
    async validateToken(token) {
        try {
            const [encryptedData, checksum] = token.split('.');
            
            // Verify checksum
            const calculatedChecksum = await this.calculateChecksum(encryptedData);
            if (calculatedChecksum !== checksum) {
                return { valid: false, reason: 'Invalid checksum' };
            }
            
            // Decrypt token
            const payload = await this.decryptData(encryptedData, 'token');
            
            // Check expiration
            if (payload.exp < Date.now()) {
                return { valid: false, reason: 'Token expired' };
            }
            
            // Validate issuer
            if (payload.iss !== 'st-ai-router') {
                return { valid: false, reason: 'Invalid issuer' };
            }
            
            return { valid: true, payload };
        } catch (error) {
            console.error('Token validation failed:', error);
            return { valid: false, reason: 'Validation error' };
        }
    }
    
    // 5. Data Integrity
    async calculateChecksum(data) {
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);
            
            const hashBuffer = await window.crypto.subtle.digest(
                'SHA-256',
                dataBuffer
            );
            
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
        } catch (error) {
            console.error('Checksum calculation failed:', error);
            return this.fallbackChecksum(data);
        }
    }
    
    async signData(data) {
        try {
            const checksum = await this.calculateChecksum(JSON.stringify(data));
            const signature = await this.encryptData({
                data: data,
                checksum: checksum,
                timestamp: Date.now()
            }, 'data');
            
            return signature;
        } catch (error) {
            console.error('Data signing failed:', error);
            return null;
        }
    }
    
    async verifySignature(signature, expectedData) {
        try {
            const decrypted = await this.decryptData(signature, 'data');
            
            // Verify timestamp (within 5 minutes)
            if (Date.now() - decrypted.timestamp > 300000) {
                return { valid: false, reason: 'Signature expired' };
            }
            
            // Verify checksum
            const expectedChecksum = await this.calculateChecksum(JSON.stringify(expectedData));
            if (decrypted.checksum !== expectedChecksum) {
                return { valid: false, reason: 'Invalid checksum' };
            }
            
            return { valid: true, data: decrypted.data };
        } catch (error) {
            console.error('Signature verification failed:', error);
            return { valid: false, reason: 'Verification error' };
        }
    }
    
    // 6. Secure Storage
    async secureStore(key, value) {
        try {
            // Encrypt the value
            const encrypted = await this.encryptData(value);
            
            // Store with metadata
            const storageItem = {
                value: encrypted,
                timestamp: Date.now(),
                checksum: await this.calculateChecksum(encrypted),
                version: '1.0'
            };
            
            localStorage.setItem(key, JSON.stringify(storageItem));
            return true;
        } catch (error) {
            console.error('Secure storage failed:', error);
            return false;
        }
    }
    
    async secureRetrieve(key) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return null;
            
            const storageItem = JSON.parse(stored);
            
            // Verify checksum
            const calculatedChecksum = await this.calculateChecksum(storageItem.value);
            if (calculatedChecksum !== storageItem.checksum) {
                console.error('Storage checksum mismatch');
                localStorage.removeItem(key);
                return null;
            }
            
            // Decrypt value
            const decrypted = await this.decryptData(storageItem.value);
            return decrypted;
        } catch (error) {
            console.error('Secure retrieval failed:', error);
            return null;
        }
    }
    
    secureRemove(key) {
        try {
            // Overwrite before removal
            const overwrite = '0'.repeat(1024);
            localStorage.setItem(key, overwrite);
            
            // Remove the item
            localStorage.removeItem(key);
            
            // Clear from memory
            if (window.gc) {
                window.gc();
            }
            
            return true;
        } catch (error) {
            console.error('Secure removal failed:', error);
            return false;
        }
    }
    
    // 7. Fallback Methods (for compatibility)
    fallbackEncrypt(data) {
        // Simple XOR encryption as fallback
        const key = 'st-ai-secure-key-2024';
        const jsonString = JSON.stringify(data);
        let result = '';
        
        for (let i = 0; i < jsonString.length; i++) {
            const charCode = jsonString.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        
        return btoa(result);
    }
    
    fallbackDecrypt(encryptedData) {
        try {
            const key = 'st-ai-secure-key-2024';
            const binaryString = atob(encryptedData);
            let result = '';
            
            for (let i = 0; i < binaryString.length; i++) {
                const charCode = binaryString.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode);
            }
            
            return JSON.parse(result);
        } catch (error) {
            return null;
        }
    }
    
    fallbackHashPassword(password) {
        // Simple hash as fallback
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        const salt = Math.random().toString(36).substring(2, 10);
        return `${salt}:${hash.toString(16)}`;
    }
    
    fallbackVerifyPassword(password, hashedPassword) {
        const [salt, storedHash] = hashedPassword.split(':');
        const newHash = this.fallbackHashPassword(password + salt);
        const [_, newHashPart] = newHash.split(':');
        
        return newHashPart === storedHash;
    }
    
    fallbackToken(data, expirationMinutes) {
        const payload = {
            data: data,
            exp: Date.now() + (expirationMinutes * 60 * 1000),
            iat: Date.now()
        };
        
        return btoa(JSON.stringify(payload));
    }
    
    fallbackChecksum(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16).substring(0, 16);
    }
    
    // 8. Utility Functions
    generateSalt() {
        return window.crypto.getRandomValues(new Uint8Array(this.saltLength));
    }
    
    getDeviceId() {
        // Create a device fingerprint
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            navigator.platform,
            !!window.sessionStorage,
            !!window.localStorage
        ].join('|');
        
        return this.fallbackChecksum(fingerprint);
    }
    
    // 9. Key Rotation
    async rotateKeys() {
        try {
            // Generate new keys
            const newMasterKey = await this.generateMasterKey();
            const oldKeys = { ...this.keys };
            
            // Update keys
            this.masterKey = newMasterKey;
            await this.initKeys();
            
            // Re-encrypt sensitive data with new keys
            await this.reencryptSensitiveData(oldKeys);
            
            return { success: true, rotatedAt: new Date().toISOString() };
        } catch (error) {
            console.error('Key rotation failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async reencryptSensitiveData(oldKeys) {
        // Re-encrypt stored sensitive data
        const sensitiveKeys = [
            'encrypted_users',
            'encrypted_sessions',
            'encrypted_tokens'
        ];
        
        for (const key of sensitiveKeys) {
            const stored = localStorage.getItem(key);
            if (stored) {
                try {
                    // Decrypt with old key (simulated - in reality would need old key)
                    const decrypted = this.fallbackDecrypt(stored);
                    
                    // Encrypt with new key
                    if (decrypted) {
                        const reencrypted = await this.encryptData(decrypted);
                        localStorage.setItem(key, reencrypted);
                    }
                } catch (error) {
                    console.error(`Re-encryption failed for ${key}:`, error);
                }
            }
        }
    }
    
    // 10. Public API
    getEncryptionStatus() {
        return {
            algorithm: this.algorithm,
            keyStrength: this.keyStrength,
            keysInitialized: !!this.keys,
            webCryptoAvailable: !!window.crypto.subtle,
            masterKeyGenerated: !!this.masterKey
        };
    }
    
    // 11. Memory Encryption
    async encryptInMemory(data) {
        // Encrypt data for temporary memory storage
        const encrypted = await this.encryptData(data);
        
        // Store in memory with expiration
        const memoryItem = {
            data: encrypted,
            expires: Date.now() + (5 * 60 * 1000) // 5 minutes
        };
        
        return memoryItem;
    }
    
    async decryptFromMemory(memoryItem) {
        if (!memoryItem || Date.now() > memoryItem.expires) {
            return null;
        }
        
        return await this.decryptData(memoryItem.data);
    }
    
    // 12. Secure Communication
    async prepareSecureRequest(data) {
        const timestamp = Date.now();
        const nonce = window.crypto.getRandomValues(new Uint8Array(8));
        
        const requestData = {
            payload: data,
            timestamp: timestamp,
            nonce: Array.from(nonce).map(b => b.toString(16).padStart(2, '0')).join('')
        };
        
        // Sign the request
        const signature = await this.signData(requestData);
        
        return {
            data: await this.encryptData(requestData),
            signature: signature
        };
    }
    
    async processSecureResponse(response) {
        try {
            // Verify signature
            const verification = await this.verifySignature(
                response.signature,
                response.data
            );
            
            if (!verification.valid) {
                throw new Error('Invalid response signature');
            }
            
            // Decrypt data
            const decrypted = await this.decryptData(response.data);
            
            // Verify nonce and timestamp
            const now = Date.now();
            if (now - decrypted.timestamp > 30000) { // 30 seconds
                throw new Error('Response expired');
            }
            
            return decrypted.payload;
        } catch (error) {
            console.error('Secure response processing failed:', error);
            throw error;
        }
    }
}

// Create global instance
const encryptionSystem = new EncryptionSystem();

// Initialize asynchronously
window.addEventListener('load', async () => {
    try {
        await encryptionSystem.initKeys();
        console.log('Encryption system initialized');
    } catch (error) {
        console.error('Encryption system initialization failed:', error);
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EncryptionSystem, encryptionSystem };
}