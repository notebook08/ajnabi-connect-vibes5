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
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // Create order on backend (simulated)
  static async createOrder(amount: number, currency: string = 'INR'): Promise<{ orderId: string; amount: number }> {
    // In a real app, this would call your backend API to create a Razorpay order
    // For now, we'll simulate this
    const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    return {
      orderId,
      amount
    };
  }

  // Initialize payment
  static async initiatePayment(options: PaymentOptions): Promise<PaymentResult> {
    try {
      // Load Razorpay if not already loaded
      const isLoaded = await this.loadRazorpay();
      if (!isLoaded) {
        throw new Error('Payment gateway is currently unavailable. Please try again later.');
      }

      // Check if Razorpay is available
      if (!window.Razorpay) {
        throw new Error('Payment gateway failed to initialize. Please refresh and try again.');
      }

      // Create order
      const order = await this.createOrder(options.amount);

      return new Promise((resolve) => {
        const razorpayOptions = {
          key: RAZORPAY_KEY_ID,
          amount: options.amount * 100, // Convert to paise
          currency: options.currency || PAYMENT_CONFIG.currency,
          name: PAYMENT_CONFIG.company.name,
          description: options.description,
          image: PAYMENT_CONFIG.company.logo,
          order_id: order.orderId,
          prefill: {
            name: options.prefill?.name || '',
            email: options.prefill?.email || '',
            contact: options.prefill?.contact || ''
          },
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
          handler: async (response: any) => {
            try {
              // Verify payment on backend (simulated)
              const isValid = await this.verifyPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature
              );

              if (isValid) {
                resolve({
                  success: true,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature
                });
              } else {
                resolve({
                  success: false,
                  error: 'Payment verification failed'
                });
              }
            } catch (error: any) {
              resolve({
                success: false,
                error: error.message || 'Payment verification failed'
              });
            }
          }
        };

        try {
          const razorpay = new window.Razorpay(razorpayOptions);
          razorpay.on('payment.failed', (response: any) => {
            resolve({
              success: false,
              error: response.error.description || 'Payment failed'
            });
          });
          razorpay.open();
        } catch (error: any) {
          console.error('Razorpay initialization error:', error);
          resolve({
            success: false,
            error: 'Payment gateway initialization failed'
          });
        }
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
      return { success: false, error: 'Invalid coin package selected' };
    }

    const paymentOptions: PaymentOptions = {
      amount: coinPackage.price,
      description: `${coinPackage.coins} Coins Package - AjnabiCam`,
      prefill: {
        name: userInfo?.name,
        email: userInfo?.email,
        contact: userInfo?.phone
      },
      notes: {
        package_type: packageType,
        coins: coinPackage.coins.toString(),
        package_id: coinPackage.id,
        product_type: 'coins'
      }
    };

    return this.initiatePayment(paymentOptions);
  }

  // Subscribe to premium
  static async subscribeToPremium(planType: keyof typeof PREMIUM_PLANS, userInfo?: { name?: string; email?: string; phone?: string }): Promise<PaymentResult> {
    const plan = PREMIUM_PLANS[planType];
    if (!plan) {
      return { success: false, error: 'Invalid premium plan selected' };
    }

    const paymentOptions: PaymentOptions = {
      amount: plan.price,
      description: `Premium Subscription (${plan.duration}) - AjnabiCam`,
      prefill: {
        name: userInfo?.name,
        email: userInfo?.email,
        contact: userInfo?.phone
      },
      notes: {
        plan_type: planType,
        duration: plan.duration,
        plan_id: plan.id,
        product_type: 'premium'
      }
    };

    return this.initiatePayment(paymentOptions);
  }

  // Subscribe to unlimited calls
  static async subscribeToUnlimitedCalls(autoRenew: boolean = false, userInfo?: { name?: string; email?: string; phone?: string }): Promise<PaymentResult> {
    const paymentOptions: PaymentOptions = {
      amount: UNLIMITED_CALLS_PLAN.price,
      description: `Unlimited Voice Calls (${UNLIMITED_CALLS_PLAN.duration}) - AjnabiCam`,
      prefill: {
        name: userInfo?.name,
        email: userInfo?.email,
        contact: userInfo?.phone
      },
      notes: {
        plan_type: 'unlimited_calls',
        duration: UNLIMITED_CALLS_PLAN.duration,
        auto_renew: autoRenew.toString(),
        plan_id: UNLIMITED_CALLS_PLAN.id,
        product_type: 'unlimited_calls'
      }
    };

    return this.initiatePayment(paymentOptions);
  }

  // Verify payment (this should be done on your backend in production)
  static async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      // In production, this should call your backend API for verification
      // For now, we'll do basic validation
      
      if (!paymentId || !orderId || !signature) {
        return false;
      }

      // Simulate backend verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would:
      // 1. Send paymentId, orderId, and signature to your backend
      // 2. Backend verifies with Razorpay using webhook secret
      // 3. Backend returns verification result
      
      // For demo purposes, we'll validate the format
      const isValidFormat = 
        paymentId.startsWith('pay_') && 
        orderId.startsWith('order_') && 
        signature.length > 10;

      return isValidFormat;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  // Get payment status
  static async getPaymentStatus(paymentId: string): Promise<{ status: string; amount?: number }> {
    try {
      // This would typically call your backend API to get payment status from Razorpay
      // For demo purposes, we'll simulate this
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { 
        status: 'captured',
        amount: 0 // Would be actual amount from Razorpay
      };
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return { status: 'failed' };
    }
  }

  // Cancel subscription (for auto-renew)
  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      // This would call your backend to cancel the subscription
      console.log('Cancelling subscription:', subscriptionId);
      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }
}