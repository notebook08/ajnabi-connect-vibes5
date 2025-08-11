import { RAZORPAY_KEY_ID, PAYMENT_CONFIG, COIN_PACKAGES, PREMIUM_PLANS, UNLIMITED_CALLS_PLAN } from '@/config/payments';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  orderId?: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export class PaymentService {
  private static isRazorpayLoaded = false;

  // Load Razorpay script
  static async loadRazorpay(): Promise<boolean> {
    if (this.isRazorpayLoaded) {
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isRazorpayLoaded = true;
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Initialize payment
  static async initiatePayment(options: PaymentOptions): Promise<PaymentResult> {
    try {
      // Load Razorpay if not already loaded
      const isLoaded = await this.loadRazorpay();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay');
      }

      return new Promise((resolve) => {
        const razorpayOptions = {
          key: RAZORPAY_KEY_ID,
          amount: options.amount * 100, // Convert to paise
          currency: options.currency || PAYMENT_CONFIG.currency,
          name: PAYMENT_CONFIG.company.name,
          description: options.description,
          image: PAYMENT_CONFIG.company.logo,
          order_id: options.orderId,
          prefill: options.prefill || {},
          notes: options.notes || {},
          theme: PAYMENT_CONFIG.company.theme,
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                error: 'Payment cancelled by user'
              });
            }
          },
          handler: (response: any) => {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
          }
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Payment initialization failed'
      };
    }
  }

  // Buy coins
  static async buyCoinPackage(packageType: keyof typeof COIN_PACKAGES, userInfo?: { name?: string; email?: string; phone?: string }): Promise<PaymentResult> {
    const coinPackage = COIN_PACKAGES[packageType];
    if (!coinPackage) {
      return { success: false, error: 'Invalid coin package' };
    }

    const paymentOptions: PaymentOptions = {
      amount: coinPackage.price,
      description: `${coinPackage.coins} Coins Package`,
      prefill: userInfo,
      notes: {
        package_type: packageType,
        coins: coinPackage.coins.toString(),
        package_id: coinPackage.id
      }
    };

    return this.initiatePayment(paymentOptions);
  }

  // Subscribe to premium
  static async subscribeToPremium(planType: keyof typeof PREMIUM_PLANS, userInfo?: { name?: string; email?: string; phone?: string }): Promise<PaymentResult> {
    const plan = PREMIUM_PLANS[planType];
    if (!plan) {
      return { success: false, error: 'Invalid premium plan' };
    }

    const paymentOptions: PaymentOptions = {
      amount: plan.price,
      description: `Premium Subscription - ${plan.duration}`,
      prefill: userInfo,
      notes: {
        plan_type: planType,
        duration: plan.duration,
        plan_id: plan.id
      }
    };

    return this.initiatePayment(paymentOptions);
  }

  // Subscribe to unlimited calls
  static async subscribeToUnlimitedCalls(autoRenew: boolean = false, userInfo?: { name?: string; email?: string; phone?: string }): Promise<PaymentResult> {
    const paymentOptions: PaymentOptions = {
      amount: UNLIMITED_CALLS_PLAN.price,
      description: `Unlimited Voice Calls - ${UNLIMITED_CALLS_PLAN.duration}`,
      prefill: userInfo,
      notes: {
        plan_type: 'unlimited_calls',
        duration: UNLIMITED_CALLS_PLAN.duration,
        auto_renew: autoRenew.toString(),
        plan_id: UNLIMITED_CALLS_PLAN.id
      }
    };

    return this.initiatePayment(paymentOptions);
  }

  // Verify payment (this would typically be done on your backend)
  static async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    // In a real application, this verification should be done on your backend
    // using the Razorpay webhook or API
    console.log('Payment verification:', { paymentId, orderId, signature });
    
    // For demo purposes, we'll assume all payments are valid
    // In production, implement proper server-side verification
    return true;
  }

  // Get payment status
  static getPaymentStatus(paymentId: string): Promise<any> {
    // This would typically call your backend API to get payment status
    return Promise.resolve({ status: 'captured' });
  }
}