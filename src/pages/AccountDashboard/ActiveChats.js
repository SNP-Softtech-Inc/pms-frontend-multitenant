import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { chatAPI } from "../../services/api";

// Strips tags to plain text via the DOM parser (not a regex) so
// HTML-entity-encoded content (e.g. "&nbsp;", "&lt;b&gt;") decodes
// correctly instead of showing the raw entity text in the preview.
const getMessagePreview = (html) => {
  if (!html) return "No message";
  const text = new DOMParser()
    .parseFromString(html, "text/html")
    .body.textContent.trim();
  return text || "No message";
};

const ActiveChats = ({ accountId, setChatsCount }) => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);

  const accountwiseChatlist = async (accId, active) => {
    try {
      setLoading(true);

      const res = await chatAPI.getChatsByAccountAndStatus(
        accId,
        active,
        "admin"
      );

      const chats = res.data.chataccountwise || [];

      setChatList(chats);

      setChatsCount?.(chats.length);
    } catch (error) {
      console.error("Error fetching chat list:", error);

      setChatsCount?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      accountwiseChatlist(accountId, true);
    }
  }, [accountId]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/60">
      <MessageCircle className="text-5xl mb-3 opacity-50" />

      <p className="text-sm text-muted-foreground">
        No active chats found
      </p>
    </div>
  );

  return (
    <div className="p-4">
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-muted-foreground">
                Loading chats...
              </p>
            </div>
          ) : chatList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    Subject
                  </TableHead>

                  <TableHead className="font-semibold">
                    Last Message
                  </TableHead>

                  <TableHead className="font-semibold">
                    From
                  </TableHead>

                  <TableHead className="font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="font-semibold">
                    Messages
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {chatList.map((chat) => {
                  const lastMessage =
                    chat.description?.[
                      chat.description.length - 1
                    ];

                  return (
                    <TableRow key={chat._id}>
                      {/* Subject */}
                      <TableCell className="font-medium max-w-[220px] truncate">
                        {chat.chatsubject}
                      </TableCell>

                      {/* Last Message */}
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">
                        {getMessagePreview(lastMessage?.message)}
                      </TableCell>

                      {/* Sender */}
                      <TableCell>
                        {lastMessage?.senderid || "-"}
                      </TableCell>

                      {/* Read Status */}
                      <TableCell>
                        {lastMessage?.isRead ? (
                          <Badge className="bg-green-500 text-white border-0">
                            Read
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white border-0">
                            Unread
                          </Badge>
                        )}
                      </TableCell>

                      {/* Total Messages */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-full"
                        >
                          {chat.description?.length || 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveChats;