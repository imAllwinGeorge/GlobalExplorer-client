import { io, type Socket } from "socket.io-client";

class SocketService {

    private socket: Socket | null = null;

    async connect(role: string): Promise<void> {
        if(!this.socket) {
            this.socket = io(import.meta.env.VITE_BASE_URL, {
                withCredentials: true,
                query: {role}
            });

            await new Promise<void>((resolve) => {
                this.socket!.on("connect", () => {
                    console.log("Socket connected with ID : ", this.socket!.id)
                    resolve();
                })
            })
        }

        
    }

    get instance(): Socket {

        if(!this.socket) {
            console.log(this.socket)
            throw new Error("Socket is not connected!.")}
    
        return this.socket;
    }

    disconnect() {
        if(this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();