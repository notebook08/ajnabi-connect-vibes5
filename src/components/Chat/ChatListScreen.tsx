import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
}

export function ChatListScreen({ chats, onOpenChat }: ChatListScreenProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => chats.filter(c => c.name.toLowerCase().includes(query.toLowerCase())),
    [chats, query]
  );

  return (
    <main className="min-h-screen bg-background pb-24 px-4 pt-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-4">
          <Input
            placeholder="Search chats"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-full"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((chat) => (
            <Card
              key={chat.id}
              className="shadow-card cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onOpenChat(chat.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-semibold">
                  {chat.name.slice(0,1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread ? (
                  <Badge className="ml-2" variant="secondary">{chat.unread}</Badge>
                ) : null}
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">No chats found</p>
          )}
        </div>
      </div>
    </main>
  );
}
