// // src/lib/eventBus.ts
// export type Listener<T> = (payload: T) => void;

// export class EventBus<Events extends Record<string, unknown>> {
//   private listeners = new Map<keyof Events, Set<Listener<Events[keyof Events]>>>();

//   on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
//     const set = this.listeners.get(event) ?? new Set();
//     set.add(listener as Listener<Events[keyof Events]>);
//     this.listeners.set(event, set);
//     return () => this.off(event, listener);
//   }

//   off<K extends keyof Events>(event: K, listener?: Listener<Events[K]>) {
//     const set = this.listeners.get(event);
//     if (!set) return;
//     if (listener) {
//       set.delete(listener as Listener<Events[keyof Events]>);
//       if (set.size === 0) this.listeners.delete(event);
//       return;
//     }
//     this.listeners.delete(event);
//   }

//   emit<K extends keyof Events>(event: K, payload: Events[K]) {
//     const set = this.listeners.get(event);
//     if (!set) return;
//     // copy to avoid mutation issues
//     Array.from(set).forEach((listener) => (listener as Listener<Events[K]>)(payload));
//   }
// }


// src/lib/eventBus.ts
export type Listener<T> = (payload: T) => void;

export class EventBus<Events extends Record<string, unknown>> {
  // Give every instance a random ID
  private busId = Math.floor(Math.random() * 10000); 
  private listeners = new Map<keyof Events, Set<Listener<Events[keyof Events]>>>();

  constructor() {
    console.log(`🚌 EventBus Created: Instance ID [${this.busId}]`);
  }

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    console.log(`[Bus ${this.busId}] 👂 Listening to: ${String(event)}`);
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener as Listener<Events[keyof Events]>);
    this.listeners.set(event, set);
    return () => this.off(event, listener);
  }

  off<K extends keyof Events>(event: K, listener?: Listener<Events[K]>) {
    const set = this.listeners.get(event);
    if (!set) return;
    if (listener) {
      set.delete(listener as Listener<Events[keyof Events]>);
      if (set.size === 0) this.listeners.delete(event);
      return;
    }
    this.listeners.delete(event);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    const set = this.listeners.get(event);
    const listenerCount = set ? set.size : 0;
    
    console.log(`[Bus ${this.busId}] 📢 Emitting: ${String(event)} to ${listenerCount} listeners`);
    
    if (!set) return;
    Array.from(set).forEach((listener) => (listener as Listener<Events[K]>)(payload));
  }
}