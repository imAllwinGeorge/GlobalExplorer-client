import { io } from "socket.io-client";
class SocketService {
    constructor() {
        Object.defineProperty(this, "socket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    async connect(role) {
        if (!this.socket) {
            this.socket = io(import.meta.env.VITE_BASE_URL, {
                withCredentials: true,
                query: { role }
            });
            await new Promise((resolve) => {
                this.socket.on("connect", () => {
                    console.log("Socket connected with ID : ", this.socket.id);
                    resolve();
                });
            });
        }
    }
    get instance() {
        if (!this.socket) {
            console.log(this.socket);
            throw new Error("Socket is not connected!.");
        }
        return this.socket;
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}
export const socketService = new SocketService();
