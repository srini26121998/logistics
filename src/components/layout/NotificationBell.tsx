"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'critical' | 'success' | 'warning' | 'info';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Customs Clearance Pending",
    description: "AWB-100293 requires immediate customs clearance at DEL.",
    time: "45 mins ago",
    type: "critical",
    read: false,
  },
  {
    id: "2",
    title: "Invoice Approved",
    description: "Invoice #INV-2026 has been approved by Finance.",
    time: "1 hour ago",
    type: "success",
    read: false,
  },
  {
    id: "3",
    title: "Fleet Assignment Needed",
    description: "Route PNQ-MAA is awaiting fleet assignment.",
    time: "2 hours ago",
    type: "warning",
    read: true,
  }
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'critical': return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case 'success': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'warning': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100/50"
        suppressHydrationWarning
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[#0A0A0B]">
            <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-blue-200 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            <div className="p-4 border-b border-blue-200/60 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                  <Bell className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 transition-colors cursor-pointer group hover:bg-slate-100/30 ${notif.read ? 'opacity-60' : 'bg-slate-50'}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${getTypeStyles(notif.type)}`}>
                          {getTypeIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium truncate ${notif.read ? 'text-slate-600' : 'text-slate-900'}`}>
                              {notif.title}
                            </p>
                            <button 
                              onClick={(e) => removeNotification(notif.id, e)}
                              className="text-slate-500 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {notif.description}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-blue-200/60 bg-white text-center">
              <button className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                View All Activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
