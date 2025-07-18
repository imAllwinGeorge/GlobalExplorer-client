export {};

declare global {
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name?: string;
    description?: string;
    image?: string;
    order_id: string;
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string>;
    theme?: {
      color?: string;
    };
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    open(): void;
    on(event: string, callback: () => void): void;
  }

  interface Window {
    Razorpay: typeof Razorpay;
  }
}
