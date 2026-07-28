import { CartEventPayload, CartEventType } from '@/types/cart';

type CartEventListener = (payload: CartEventPayload) => void;

class CartEventBus {
  private listeners: Map<CartEventType, Set<CartEventListener>> = new Map();

  public subscribe(eventType: CartEventType, listener: CartEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      const eventListeners = this.listeners.get(eventType);
      if (eventListeners) {
        eventListeners.delete(listener);
      }
    };
  }

  public emit(payload: CartEventPayload): void {
    const eventListeners = this.listeners.get(payload.type);
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (error) {
          console.error(`Error in CartEvent listener for ${payload.type}:`, error);
        }
      });
    }
  }
}

export const cartEventBus = new CartEventBus();
