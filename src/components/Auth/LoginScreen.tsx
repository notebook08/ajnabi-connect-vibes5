import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ArrowRight, Heart } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handlePhoneSubmit = () => {
    if (phone.length === 10) {
      setStep("otp");
    }
  };

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-white animate-float" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AjnabiCam</h1>
          <p className="text-white/80">Connect. Chat. Care.</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-center">
              {step === "phone" ? "Enter your phone number" : "Verify OTP"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "phone" ? (
              <>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={handlePhoneSubmit}
                  disabled={phone.length !== 10}
                  className="w-full"
                  variant="gradient"
                >
                  Send OTP <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    OTP sent to +91 {phone}
                  </p>
                </div>
                <Button 
                  onClick={handleOtpSubmit}
                  disabled={otp.length !== 6}
                  className="w-full"
                  variant="gradient"
                >
                  Verify & Continue
                </Button>
                <Button 
                  onClick={() => setStep("phone")}
                  variant="outline"
                  className="w-full"
                >
                  Change Number
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}