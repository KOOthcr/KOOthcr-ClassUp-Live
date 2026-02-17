import io from 'socket.io-client';
import CryptoJS from 'crypto-js';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

class SocketManager {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.encryptionKey = null;
        this.isHost = false;
        this.onSyncCallback = null;
    }

    // Connect to Server
    connect() {
        if (!this.socket) {
            this.socket = io(SERVER_URL, {
                reconnectionAttempts: 10, // Retry 10 times
                reconnectionDelay: 2000,  // Wait 2s between attempts
                timeout: 10000            // Connection timeout 10s
            });

            this.socket.on('connect', () => {
                console.log('Connected to Socket Server:', this.socket.id);
            });

            this.socket.on('sync_data', (encryptedData) => {
                if (encryptedData && this.onSyncCallback) {
                    try {
                        const decryptedData = this.decrypt(encryptedData);
                        if (decryptedData) {
                            this.onSyncCallback(decryptedData);
                        }
                    } catch (error) {
                        console.error('Decryption Failed:', error);
                    }
                }
            });
        }
    }

    // Cryptography Helpers
    _deriveRoomId(inviteCode) {
        // Room ID is public (seen by server), so we hash it.
        return CryptoJS.SHA256(inviteCode).toString().substring(0, 12);
    }

    _deriveKey(inviteCode) {
        // Key is private (never sent to server). 
        // We use PBKDF2 for better security than simple hash.
        return CryptoJS.PBKDF2(inviteCode, "ClassUp-Salt-2024", {
            keySize: 256 / 32,
            iterations: 100
        }).toString();
    }

    encrypt(data) {
        if (!this.encryptionKey) return null;
        return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    }

    decrypt(ciphertext) {
        if (!this.encryptionKey) return null;
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, this.encryptionKey);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedString);
        } catch (e) {
            console.error("Failed to decrypt data", e);
            return null;
        }
    }

    // Actions
    joinRoom(inviteCode, isHost, onSync) {
        this.connect();

        this.roomId = this._deriveRoomId(inviteCode);
        this.encryptionKey = this._deriveKey(inviteCode);
        this.isHost = isHost;
        this.onSyncCallback = onSync;

        console.log(`Joining Room: ${this.roomId} (Host: ${isHost})`);

        this.socket.emit('join_room', {
            roomId: this.roomId,
            isHost: isHost
        });
    }

    sendUpdate(data) {
        if (!this.socket || !this.roomId || !this.encryptionKey) return;

        const encryptedData = this.encrypt(data);
        this.socket.emit('update_state', {
            roomId: this.roomId,
            encryptedData: encryptedData
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.roomId = null;
        this.encryptionKey = null;
    }
}

export const socketManager = new SocketManager();
