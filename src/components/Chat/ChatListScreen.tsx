import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gem } from "lucide-react";

export type ChatPreview = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  unread?: number;
};

interface ChatListScreenProps {
  chats: ChatPreview[];
  onOpenChat: (chatId: string) => void;
  onBack?: () => void;
  onBuyCoins?: () => void;
}

export function ChatListScreen({ chats, onOpenChat, onBack, onBuyCoins }: ChatListScreenProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => chats.filter(c => c.name.toLowerCase().includes(query.toLowerCase())),
    [chats, query]
  );

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-primary pt-16 pb-8 px-4 rounded-b-3xl shadow-warm">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <h1 className="font-dancing text-4xl font-bold text-white mb-1">
              Chat
            </h1>
            <p className="text-white/90 font-poppins text-sm">Your conversations</p>
          </div>
          {onBuyCoins && (
            <Button 
              onClick={onBuyCoins}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 p-3 rounded-full min-h-12 min-w-12"
            >
              <Gem className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <main className="pb-24 px-4 -mt-6 safe-area-bottom">
      <div className="max-w-lg mx-auto">
        <div className="mb-4">
          <Input
            placeholder="Search chats"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 rounded-xl font-poppins shadow-card bg-white border-0"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((chat) => (
            <Card
              key={chat.id}
              className="shadow-card cursor-pointer hover:bg-muted/50 transition-colors rounded-2xl border-0"
              onClick={() => onOpenChat(chat.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-semibold font-poppins">
                  {chat.name.slice(0,1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate font-poppins">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground font-poppins">{chat.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate font-poppins">{chat.lastMessage}</p>
                </div>
                {chat.unread ? (
                  <Badge className="ml-2 font-poppins" variant="secondary">{chat.unread}</Badge>
                ) : null}
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-12 font-poppins">No chats found</p>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
