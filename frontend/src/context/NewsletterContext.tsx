// src/context/NewsletterContext.tsx
// useNewsletter foi movido para src/hooks/useNewsletter.ts
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface Subscription {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  event?: string;
  subscribedAt: Date;
  read: boolean;
}

export interface NewsletterContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id' | 'subscribedAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  deleteSubscription: (id: string) => void;
  unreadCount: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const NewsletterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const saved = localStorage.getItem('newsletter_subscriptions');
      return saved ? (JSON.parse(saved) as Subscription[]) : [];
    } catch {
      return [];
    }
  });

  const unreadCount = subscriptions.filter(sub => !sub.read).length;

  const addSubscription = (subscriptionData: Omit<Subscription, 'id' | 'subscribedAt' | 'read'>) => {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: Date.now().toString(),
      subscribedAt: new Date(),
      read: false,
    };

    setSubscriptions(prev => {
      const updated = [newSubscription, ...prev];
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(updated));
      return updated;
    });

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nova Inscrição!', {
        body: `Novo inscrito: ${subscriptionData.email}`,
        icon: '/logo-mv.svg',
      });
    }
  };

  const markAsRead = (id: string) => {
    setSubscriptions(prev => {
      const updated = prev.map(sub => sub.id === id ? { ...sub, read: true } : sub);
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => {
      const updated = prev.filter(sub => sub.id !== id);
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(updated));
      return updated;
    });
  };

  // Pedir permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, []);

  // Persistir sempre que subscriptions mudar
  useEffect(() => {
    localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  return (
    <NewsletterContext.Provider value={{ subscriptions, addSubscription, markAsRead, deleteSubscription, unreadCount }}>
      {children}
    </NewsletterContext.Provider>
  );
};