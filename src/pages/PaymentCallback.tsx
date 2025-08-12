import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { PaymentService } from "@/services/paymentService";
import { useToast } from "@/hooks/use-toast";

type PaymentStatus = 'processing' | 'success' | 'failed' | 'cancelled';

interface PaymentDetails {
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

const PaymentCallback = () => {
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Extract payment details from URL parameters
        const urlParams = new URLSearchParams(location.search);
        
        const paymentId = urlParams.get('razorpay_payment_id');
        const orderId = urlParams.get('razorpay_order_id');
        const signature = urlParams.get('razorpay_signature');
        const error = urlParams.get('error');

        // Store payment details for display
        setPaymentDetails({
          paymentId: paymentId || undefined,
          orderId: orderId || undefined,
          signature: signature || undefined,
          error: error || undefined
        });

        // Check if payment was cancelled or failed
        if (error) {
          console.error('Payment error from URL:', error);
          setStatus('failed');
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment.",
            variant: "destructive"
          });
          return;
        }

        // Check if payment was cancelled (no payment details)
        if (!paymentId || !orderId || !signature) {
          console.log('Payment cancelled - missing payment details');
          setStatus('cancelled');
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled or incomplete.",
            variant: "destructive"
          });
          return;
        }

        // Verify payment with backend
        console.log('Verifying payment:', { paymentId, orderId, signature });
        const isValid = await PaymentService.verifyPayment(paymentId, orderId, signature);

        if (isValid) {
          setStatus('success');
          toast({
            title: "Payment Successful! 🎉",
            description: "Your payment has been processed successfully.",
          });
        } else {
          setStatus('failed');
          toast({
            title: "Payment Verification Failed",
            description: "Payment could not be verified. Please contact support.",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        console.error('Payment callback processing error:', error);
        setStatus('failed');
        toast({
          title: "Payment Processing Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    };

    processPaymentCallback();
  }, [location.search, toast]);

  const handleReturnHome = () => {
    navigate('/', { replace: true });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-16 h-16 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'cancelled':
        return <XCircle className="w-16 h-16 text-gray-500" />;
      default:
        return <Loader2 className="w-16 h-16 text-primary animate-spin" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return {
          title: "Processing Payment...",
          description: "Please wait while we verify your payment."
        };
      case 'success':
        return {
          title: "Payment Successful!",
          description: "Your payment has been processed successfully. You can now enjoy your purchase."
        };
      case 'failed':
        return {
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again or contact support."
        };
      case 'cancelled':
        return {
          title: "Payment Cancelled",
          description: "Your payment was cancelled. No charges have been made to your account."
        };
      default:
        return {
          title: "Processing...",
          description: "Please wait..."
        };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0 overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold mb-3 font-poppins text-gray-800">
            {statusMessage.title}
          </h1>
          
          <p className="text-gray-600 font-poppins mb-6 leading-relaxed">
            {statusMessage.description}
          </p>

          {/* Payment Details (for debugging/transparency) */}
          {(status === 'success' || status === 'failed') && paymentDetails.paymentId && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-sm font-poppins text-gray-800 mb-2">Payment Details</h3>
              <div className="space-y-1 text-xs font-poppins text-gray-600">
                {paymentDetails.paymentId && (
                  <p><span className="font-medium">Payment ID:</span> {paymentDetails.paymentId}</p>
                )}
                {paymentDetails.orderId && (
                  <p><span className="font-medium">Order ID:</span> {paymentDetails.orderId}</p>
                )}
                {paymentDetails.error && (
                  <p className="text-red-600"><span className="font-medium">Error:</span> {paymentDetails.error}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleReturnHome}
              className="w-full h-12 font-poppins font-semibold rounded-xl"
              variant={status === 'success' ? 'gradient' : 'outline'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>

            {status === 'failed' && (
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full h-12 font-poppins rounded-xl"
              >
                Try Again
              </Button>
            )}
          </div>

          {/* Additional help text */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-poppins">
              {status === 'failed' && "If you continue to experience issues, please contact our support team."}
              {status === 'success' && "Thank you for your purchase! Your account has been updated."}
              {status === 'cancelled' && "You can try making the payment again anytime."}
              {status === 'processing' && "This may take a few moments..."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;