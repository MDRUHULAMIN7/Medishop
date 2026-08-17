'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Search,
  Phone,
  Mail,
  Clock,
  CheckCheck,
  Loader2,
  Headphones,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { apiClient, getAccessToken } from '@/lib/apiClient';
import { playNotificationSound } from '@/utils/sound';
import { toast } from 'sonner';
import io, { Socket } from 'socket.io-client';
import { SupportAvatarIcon } from '../chat/SupportAvatarIcon';

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userAvatar?: string;
  status: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCountAdmin: number;
  unreadCountCustomer?: number;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'admin';
  message: string;
  createdAt: string;
}

export function AdminChatManager() {
  const language = useAppSelector((state) => state.ui.language);
  const token = getAccessToken();
  const isBn = language === 'bn';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [activeUserIds, setActiveUserIds] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const selectedConvRef = useRef<Conversation | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const customerTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    selectedConvRef.current = selectedConv;
    setIsCustomerTyping(false);
  }, [selectedConv]);

  const fetchConversations = async (silent = false) => {
    if (!silent) setLoadingConvs(true);
    try {
      const res: any = await apiClient('/chat/admin/conversations');
      const convList: Conversation[] = Array.isArray(res) ? res : res?.data || [];
      setConversations(convList);

      setSelectedConv((prev) => {
        if (!prev && convList.length > 0) return convList[0];
        if (prev) {
          const updated = convList.find((c) => c.id === prev.id);
          return updated || prev;
        }
        return null;
      });
    } catch (err: any) {
      if (!silent) {
        toast.error(err?.message || (isBn ? 'কথোপকথন লোড করা যায়নি' : 'Failed to fetch conversations'));
      }
    } finally {
      if (!silent) setLoadingConvs(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    setLoadingMsgs(true);
    try {
      const res: any = await apiClient(`/chat/messages/${convId}`);
      const msgList: ChatMessage[] = Array.isArray(res) ? res : res?.data || [];
      setMessages(msgList);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'মেসেজ লোড করা যায়নি' : 'Failed to fetch messages'));
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv?.id) {
      fetchMessages(selectedConv.id);
    } else {
      setMessages([]);
    }
  }, [selectedConv?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCustomerTyping]);

  // Socket.IO Real-Time Connection for Admin & Pharmacist
  useEffect(() => {
    if (token) {
      const backendUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL ||
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
        'http://localhost:5000';
      const socket = io(backendUrl, {
        auth: { token },
      });

      socketRef.current = socket;
      const joinAdmins = () => {
        socket.emit('join:admins');
        socket.emit('chat:admin_join');
      };
      socket.on('connect', joinAdmins);
      joinAdmins();

      socket.on('chat:active_users', (users: string[]) => {
        setActiveUserIds(users || []);
      });

      socket.on('chat:new_message', (newMsg: ChatMessage) => {
        const currentSelected = selectedConvRef.current;
        if (currentSelected && newMsg.conversationId === currentSelected.id) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
        setIsCustomerTyping(false);
        fetchConversations(true);
        playNotificationSound();
      });

      socket.on('chat:typing', (data: any) => {
        const currentSelected = selectedConvRef.current;
        if (
          currentSelected &&
          (data.conversationId === currentSelected.id || data.userId === currentSelected.userId) &&
          data.senderRole === 'customer'
        ) {
          setIsCustomerTyping(true);
          if (customerTypingTimeoutRef.current) clearTimeout(customerTypingTimeoutRef.current);
          customerTypingTimeoutRef.current = setTimeout(() => {
            setIsCustomerTyping(false);
          }, 3500);
        }
      });

      socket.on('chat:stop_typing', (data: any) => {
        const currentSelected = selectedConvRef.current;
        if (
          currentSelected &&
          (data.conversationId === currentSelected.id || data.userId === currentSelected.userId) &&
          data.senderRole === 'customer'
        ) {
          setIsCustomerTyping(false);
        }
      });

      return () => {
        socket.emit('chat:admin_leave');
        socket.off('connect', joinAdmins);
        socket.disconnect();
      };
    }
  }, [token]);

  // Background polling fallback every 15s
  useEffect(() => {
    if (!token) return;

    const polling = setInterval(() => {
      fetchConversations(true);
      if (selectedConvRef.current?.id) {
        apiClient(`/chat/messages/${selectedConvRef.current.id}`)
          .then((res: any) => {
            const list: ChatMessage[] = Array.isArray(res) ? res : res?.data || [];
            setMessages(list);
          })
          .catch(() => {});
      }
    }, 15000);

    return () => clearInterval(polling);
  }, [token]);

  const emitAdminTyping = (isTyping: boolean) => {
    if (socketRef.current && selectedConv) {
      if (isTyping) {
        socketRef.current.emit('chat:typing', {
          conversationId: selectedConv.id,
          targetUserId: selectedConv.userId,
          isTyping: true,
        });
      } else {
        socketRef.current.emit('chat:stop_typing', {
          conversationId: selectedConv.id,
          targetUserId: selectedConv.userId,
        });
      }
    }
  };

  const handleInputFocus = () => {
    emitAdminTyping(true);
  };

  const handleInputBlur = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitAdminTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    emitAdminTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitAdminTyping(false);
    }, 2500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConv) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitAdminTyping(false);

    try {
      const res: any = await apiClient('/chat/messages', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: selectedConv.id,
          message: textToSend,
        }),
      });

      const sentMsg: ChatMessage = res?.data || res;
      if (sentMsg && sentMsg.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === sentMsg.id)) return prev;
          return [...prev, sentMsg];
        });
      }
      fetchConversations(true);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'মেসেজ পাঠানো সম্ভব হয়নি' : 'Failed to send message'));
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter(
    (c) =>
      c.userName?.toLowerCase().includes(search.toLowerCase()) ||
      c.userPhone?.includes(search) ||
      c.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary p-2 border border-primary/20">
            <SupportAvatarIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight font-serif-title">
              {isBn ? 'লাইভ ফার্মাসিস্ট চ্যাট ম্যানেজমেন্ট' : 'Live Pharmacist Support Center'}
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {isBn
                ? 'গ্রাহকদের লাইভ মেসেজের উত্তর দিন এবং রিয়েল-টাইমে ফার্মেসি সেবা প্রদান করুন'
                : 'Manage customer live messages and respond in real time'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-210px)] min-h-[580px] max-h-[820px]">
        {/* Left Column: Customer Conversations List (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-border bg-background flex flex-col overflow-hidden shadow-2xs h-full lg:sticky lg:top-20">
          <div className="p-3.5 border-b border-border bg-muted/30">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isBn ? 'গ্রাহকের নাম, ফোন বা ইমেইল দিয়ে খুঁজুন...' : 'Search customer by name or phone...'}
                className="w-full rounded-2xl border border-border bg-background pl-9 pr-3 py-2 text-xs font-medium focus:border-primary focus:outline-hidden"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {loadingConvs ? (
              <div className="flex flex-col items-center justify-center h-52 gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span>{isBn ? 'কথোপকথন লোড হচ্ছে...' : 'Loading conversations...'}</span>
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="font-bold text-foreground">
                  {isBn ? 'কোন সক্রিয় চ্যাট পাওয়া যায়নি' : 'No active conversations'}
                </p>
                <p className="mt-1 text-[11px]">
                  {isBn
                    ? 'গ্রাহকরা লাইভ চ্যাটে মেসেজ দিলে এখানে দেখা যাবে'
                    : 'Customer messages will appear here in real time'}
                </p>
              </div>
            ) : (
              filteredConvs.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                const contactInfo = conv.userPhone || conv.userEmail || '';
                const isUserActive = activeUserIds.includes(conv.userId);

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-muted/40'
                    }`}
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary font-bold text-xs border border-primary/20">
                      {conv.userName ? (
                        conv.userName.slice(0, 2).toUpperCase()
                      ) : (
                        <User className="h-5 w-5" />
                      )}

                      {/* Active green dot on profile avatar */}
                      {isUserActive && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-background" />
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {conv.userName || 'Customer'}
                          </h4>
                          {isUserActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" title="Active now" />
                          )}
                        </div>
                        {conv.lastMessageAt && (
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p className="text-[11px] text-muted-foreground truncate leading-tight flex-1">
                          {conv.lastMessage || (isBn ? 'চ্যাট শুরু হয়েছে' : 'Chat started')}
                        </p>
                        {conv.unreadCountAdmin > 0 && (
                          <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white shadow-xs shrink-0">
                            {conv.unreadCountAdmin}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Conversation Thread (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-border bg-background flex flex-col overflow-hidden shadow-2xs">
          {!selectedConv ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 p-3">
                <SupportAvatarIcon className="h-12 w-12" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {isBn ? 'কথোপকথন নির্বাচন করুন' : 'Select a customer conversation'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {isBn
                  ? 'বামপাশের তালিকা থেকে যেকোনো গ্রাহক সিলেক্ট করে তার মেসেজ হিস্টোরি দেখুন ও রিয়েল-টাইমে উত্তর দিন।'
                  : 'Choose a customer from the left list to view their message history and reply in real time.'}
              </p>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary font-extrabold text-sm border border-primary/20">
                    {selectedConv.userName
                      ? selectedConv.userName.slice(0, 2).toUpperCase()
                      : 'CU'}

                    {/* Active green dot on profile avatar */}
                    {activeUserIds.includes(selectedConv.userId) && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-background" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm sm:text-base font-extrabold text-foreground leading-tight">
                      {selectedConv.userName || 'Customer'}
                    </h3>
                    {(selectedConv.userPhone || selectedConv.userEmail) && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mt-0.5">
                        {selectedConv.userPhone ? (
                          <Phone className="h-3 w-3 text-primary shrink-0" />
                        ) : (
                          <Mail className="h-3 w-3 text-primary shrink-0" />
                        )}
                        <span>{selectedConv.userPhone || selectedConv.userEmail}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Thread Messages */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 bg-muted/10 text-xs">
                {loadingMsgs ? (
                  <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span>{isBn ? 'মেসেজ লোড হচ্ছে...' : 'Loading messages...'}</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-2" />
                    <p className="text-xs font-bold text-foreground">
                      {isBn ? 'এখনও কোন মেসেজ হিস্টোরি নেই' : 'No message history yet'}
                    </p>
                    <p className="text-[11px] mt-0.5">
                      {isBn
                        ? 'নিচের ইনপুট বক্সে মেসেজ লিখে গ্রাহকের সাথে চ্যাট শুরু করুন'
                        : 'Type a message below to start chatting with the customer'}
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isAdmin = msg.senderRole === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-full ${isAdmin ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[9px] font-semibold text-muted-foreground mb-0.5 px-1">
                            {isAdmin
                              ? isBn
                                ? 'ফার্মাসিস্ট / এডমিন সাপোর্ট'
                                : 'Admin / Support Agent'
                              : msg.senderName || selectedConv.userName || 'Customer'}
                          </span>

                          <div
                            className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs break-words break-all whitespace-pre-wrap [overflow-wrap:anywhere] ${
                              isAdmin
                                ? 'bg-slate-900 text-white rounded-tr-none'
                                : 'bg-background border border-border text-foreground rounded-tl-none font-medium'
                            }`}
                          >
                            {msg.message}
                          </div>

                          <span className="text-[8px] text-muted-foreground mt-0.5 px-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      );
                    })}

                    {/* Customer is typing real-time indicator */}
                    {isCustomerTyping && (
                      <div className="flex flex-col items-start">
                        <span className="text-[9px] font-semibold text-primary mb-0.5 px-1">
                          {isBn
                            ? `${selectedConv.userName || 'গ্রাহক'} লিখছেন...`
                            : `${selectedConv.userName || 'Customer'} is typing...`}
                        </span>
                        <div className="rounded-2xl rounded-tl-none border border-border bg-background px-3.5 py-2 shadow-2xs flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-border bg-background flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  placeholder={
                    isBn
                      ? `${selectedConv.userName || 'গ্রাহক'}-কে রিপ্লাই দিন...`
                      : `Type reply to ${selectedConv.userName || 'customer'}...`
                  }
                  className="flex-1 rounded-2xl border border-border bg-muted/20 px-4 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark disabled:opacity-40 transition-all cursor-pointer"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{isBn ? 'পাঠান' : 'Send'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
