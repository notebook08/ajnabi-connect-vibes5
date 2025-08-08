import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Lock, Users } from "lucide-react";

interface MatchScreenProps {
  onStartMatch: () => void;
  isPremium: boolean;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  onRequestUpgrade: () => void;
}

export function MatchScreen({
  onStartMatch,
  isPremium,
  matchPreference,
  onChangePreference,
  onRequestUpgrade,
}: MatchScreenProps) {
  const PreferenceButton = ({
    value,
    label,
  }: { value: "anyone" | "men" | "women"; label: string }) => {
    const locked = !isPremium && value !== "anyone";
    const isActive = matchPreference === value;
    return (
      <button
        onClick={() => (locked ? onRequestUpgrade() : onChangePreference(value))}
        className={
          `flex-1 h-11 rounded-full border text-sm font-medium transition-all
           ${isActive ? "bg-primary text-primary-foreground border-primary shadow-warm" : "bg-background text-foreground border-border hover:bg-muted"}
           ${locked ? "opacity-60" : ""}`
        }
        aria-disabled={locked}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {label} {locked && <Lock className="w-4 h-4" />}
        </span>
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-background pb-24 px-4 pt-16 safe-area-top safe-area-bottom">
      <section className="max-w-lg mx-auto">
        <header className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 font-poppins text-foreground">Find Your Match</h2>
          <p className="text-muted-foreground font-poppins">Choose who you want to meet</p>
        </header>

        <Card className="shadow-card rounded-2xl overflow-hidden mb-6 border-0">
          <CardHeader>
            <CardTitle className="text-base font-poppins flex items-center gap-2">
              <Users className="w-4 h-4" /> Match Preference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PreferenceButton value="anyone" label="Anyone" />
              <PreferenceButton value="men" label="Men" />
              <PreferenceButton value="women" label="Women" />
            </div>
            {!isPremium && (
              <p className="text-xs text-muted-foreground mt-2">
                Men/Women filters are Premium. Tap to upgrade.
              </p>
            )}
          </CardContent>
        </Card>

        <Button 
          onClick={onStartMatch}
          className="w-full h-14 font-poppins font-semibold text-lg rounded-xl"
          variant="gradient"
        >
          <Video className="w-6 h-6 mr-3" />
          Start Random Chat
        </Button>
      </section>
    </main>
  );
}
