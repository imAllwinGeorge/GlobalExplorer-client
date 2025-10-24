export class EventBus {
    constructor() {
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    on(event, listener) {
        const set = this.listeners.get(event) ?? new Set();
        set.add(listener);
        this.listeners.set(event, set);
        return () => this.off(event, listener);
    }
    off(event, listener) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        if (listener) {
            set.delete(listener);
            if (set.size === 0)
                this.listeners.delete(event);
            return;
        }
        this.listeners.delete(event);
    }
    emit(event, payload) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        // copy to avoid mutation issues
        Array.from(set).forEach((listener) => listener(payload));
    }
}
