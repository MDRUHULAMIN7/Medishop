'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, ShieldCheck, LogIn } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openAuthModal } from '@/store/slices/authSlice';
import { apiClient, getAccessToken } from '@/lib/apiClient';
import { playNotificationSound } from '@/utils/sound';
import { toast } from 'sonner';
import io, { Socket } from 'socket.io-client';
import { SupportAvatarIcon } from './SupportAvatarIcon';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
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

export function LiveChatWidget({ isOpen, onClose }: LiveChatWidgetProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const token = getAccessToken();
  const isBn = language === 'bn';

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isAdminActive, setIsAdminActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const adminTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAdminTyping]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const initChat = async () => {
        setLoading(true);
        try {
          const convRes: any = await apiClient('/chat/conversation');
          const convData = convRes?.data || convRes;
          setConversation(convData);

          const convId = convData?._id || convData?.id;
          if (convId) {
            const msgRes: any = await apiClient(`/chat/messages/${convId}`);
            const msgList = Array.isArray(msgRes) ? msgRes : msgRes?.data || [];
            setMessages(msgList);
          }
        } catch (err: any) {
          toast.error(err?.message || (isBn ? 'লাইভ চ্যাট লোড করা সম্ভব হয়নি' : 'Failed to load live chat'));
        } finally {
          setLoading(false);
        }
      };

      initChat();
    }
  }, [isOpen, isAuthenticated, isBn]);

  useEffect(() => {
    if (isOpen && isAuthenticated && token) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
      const socket = io(backendUrl, {
        auth: { token },
      });

      socketRef.current = socket;

      // Broadcast active status when chat is open
      const joinActive = () => {
        socket.emit('chat:join_active');
      };
      socket.on('connect', joinActive);
      joinActive();

      socket.on('chat:active_admins', (admins: string[]) => {
        setIsAdminActive(admins.length > 0);
      });

      socket.on('chat:new_message', (newMsg: ChatMessage) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        setIsAdminTyping(false);
        playNotificationSound();
      });

      socket.on('chat:typing', (data: any) => {
        if (data.senderRole === 'admin') {
          setIsAdminTyping(true);
          if (adminTypingTimeoutRef.current) clearTimeout(adminTypingTimeoutRef.current);
          adminTypingTimeoutRef.current = setTimeout(() => {
            setIsAdminTyping(false);
          }, 3500);
        }
      });

      socket.on('chat:stop_typing', (data: any) => {
        if (data.senderRole === 'admin') {
          setIsAdminTyping(false);
        }
      });

      return () => {
        socket.emit('chat:leave_active');
        socket.disconnect();
      };
    }
  }, [isOpen, isAuthenticated, token]);

  const emitTyping = (isTyping: boolean) => {
    if (socketRef.current && conversation) {
      const convId = conversation._id || conversation.id;
      if (isTyping) {
        socketRef.current.emit('chat:typing', {
          conversationId: convId,
          isTyping: true,
        });
      } else {
        socketRef.current.emit('chat:stop_typing', {
          conversationId: convId,
        });
      }
    }
  };

  const handleInputFocus = () => {
    emitTyping(true);
  };

  const handleInputBlur = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    emitTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 2500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversation) return;

    const convId = conversation._id || conversation.id;
    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitTyping(false);

    try {
      const res: any = await apiClient('/chat/messages', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: convId,
          message: textToSend,
        }),
      });

      const savedMessage = res?.data || res;
      if (savedMessage && savedMessage.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === savedMessage.id)) return prev;
          return [...prev, savedMessage];
        });
      }
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'মেসেজ পাঠানো যায়নি' : 'Failed to send message'));
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 flex h-[540px] max-h-[85vh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl pointer-events-auto sm:max-w-md sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-primary p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 p-1 backdrop-blur-md">
                  <SupportAvatarIcon className="h-8 w-8" />
                  {isAdminActive && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-white shadow-xs" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight">
                    {isBn ? 'মেডিশপ লাইভ চ্যাট সাপোর্ট' : 'MediShop Live Support'}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-xl p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto bg-muted/20 p-4 text-xs space-y-3 overflow-x-hidden">
              {!isAuthenticated ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary border border-primary/20 p-3 shadow-xs">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-foreground text-sm">
                      {isBn ? 'লাইভ চ্যাট শুরু করতে লগইন করুন' : 'Please login for live support'}
                    </h4>
                    <p className="max-w-xs text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {isBn
                        ? 'অর্ডার, ওষুধ, আর প্রেসক্রিপশন নিয়ে আমাদের live pharmacist-এর সাথে কথা বলতে আপনার অ্যাকাউন্টে লগইন করুন।'
                        : 'Log in to consult with our live support team regarding your orders and prescriptions.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      dispatch(openAuthModal('signin'));
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark active:scale-95 transition-all cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{isBn ? 'লগইন / সাইন ইন করুন' : 'Sign In / Register'}</span>
                  </button>
                </div>
              ) : loading ? (
                <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>{isBn ? 'চ্যাট লোড হচ্ছে...' : 'Connecting to support...'}</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 p-2">
                    <SupportAvatarIcon className="h-10 w-10" />
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    {isBn ? 'ফার্মাসিস্টের সাথে চ্যাট শুরু করুন' : 'Start chatting with pharmacist'}
                  </p>
                  <p className="mt-1 max-w-xs text-[11px]">
                    {isBn
                      ? 'ওষুধের ডোজ, দাম, বা অর্ডার সম্পর্কিত যেকোনো প্রশ্ন নিচে লিখুন'
                      : 'Ask questions about dosage, pricing, or order details below'}
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isMe = msg.senderRole === 'customer';
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-full ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="mb-0.5 px-1 text-[9px] font-semibold text-muted-foreground">
                          {isMe ? (isBn ? 'আপনি' : 'You') : msg.senderName || 'Pharmacist Support'}
                        </span>

                        <div
                          className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs break-words break-all whitespace-pre-wrap [overflow-wrap:anywhere] ${
                            isMe
                              ? 'rounded-tr-none bg-primary text-white'
                              : 'rounded-tl-none border border-border bg-background font-medium text-foreground'
                          }`}
                        >
                          {msg.message}
                        </div>

                        <span className="mt-0.5 px-1 text-[8px] text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })}

                  {/* Real-time typing indicator */}
                  {isAdminTyping && (
                    <div className="flex flex-col items-start max-w-full">
                      <span className="mb-0.5 px-1 text-[9px] font-semibold text-primary">
                        {isBn ? 'ফার্মাসিস্ট লিখছেন...' : 'Pharmacist is typing...'}
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

            {isAuthenticated && (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-border bg-background p-3">
                <input
                  type="text"
                  value={inputText}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  placeholder={isBn ? 'মেসেজ লিখুন...' : 'Type a message...'}
                  className="flex-1 rounded-2xl border border-border bg-muted/30 px-3.5 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-xs transition-all hover:bg-primary-dark disabled:opacity-40 cursor-pointer"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
