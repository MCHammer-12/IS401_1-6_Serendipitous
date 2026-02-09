import React, { createContext, useContext, useState, useEffect, useRef, useMemo, ReactNode, useCallback } from 'react';
import { Platform, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { nearbyPeople } from '@/lib/mock-data';
import type { UserProfile } from '@/lib/mock-data';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface DiscoveredPerson {
  person: UserProfile;
  discoveredAt: number;
  notified: boolean;
}

interface DiscoveryContextValue {
  isScanning: boolean;
  startScanning: () => void;
  stopScanning: () => void;
  discoveredPeople: DiscoveredPerson[];
  highlightedPersonId: string | null;
  clearHighlight: () => void;
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
}

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null);

const DISCOVERY_INTERVAL = 15000;
const PROXIMITY_DURATION = 60000;

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredPeople, setDiscoveredPeople] = useState<DiscoveredPerson[]>([]);
  const [highlightedPersonId, setHighlightedPersonId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const discoveredRef = useRef<DiscoveredPerson[]>([]);

  useEffect(() => {
    discoveredRef.current = discoveredPeople;
  }, [discoveredPeople]);

  useEffect(() => {
    checkPermission();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.personId) {
        setHighlightedPersonId(data.personId as string);
        router.push({ pathname: '/connection/[id]', params: { id: data.personId as string } });
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch {
      setHasPermission(false);
    }
  };

  const requestPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch {
      setHasPermission(false);
    }
  };

  const sendDiscoveryNotification = useCallback(async (person: UserProfile) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Connection Nearby',
          body: `${person.name} has been near you for a minute! Tap to see their profile.`,
          data: { personId: person.id },
          sound: true,
        },
        trigger: null,
      });
    } catch (e) {
      console.error('Failed to send notification', e);
    }
  }, []);

  const simulateDiscovery = useCallback(() => {
    const current = discoveredRef.current;
    const availableToDiscover = nearbyPeople.filter(
      p => !current.some(d => d.person.id === p.id)
    );

    if (availableToDiscover.length > 0) {
      const randomIdx = Math.floor(Math.random() * availableToDiscover.length);
      const newPerson = availableToDiscover[randomIdx];

      setDiscoveredPeople(prev => [
        ...prev,
        { person: newPerson, discoveredAt: Date.now(), notified: false },
      ]);
    }

    setDiscoveredPeople(prev => {
      const now = Date.now();
      let changed = false;
      const updated = prev.map(d => {
        if (!d.notified && now - d.discoveredAt >= PROXIMITY_DURATION) {
          changed = true;
          sendDiscoveryNotification(d.person);
          return { ...d, notified: true };
        }
        return d;
      });
      return changed ? updated : prev;
    });
  }, [sendDiscoveryNotification]);

  const startScanning = useCallback(() => {
    if (isScanning) return;
    setIsScanning(true);
    setDiscoveredPeople([]);

    simulateDiscovery();

    scanIntervalRef.current = setInterval(() => {
      simulateDiscovery();
    }, DISCOVERY_INTERVAL);
  }, [isScanning, simulateDiscovery]);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightedPersonId(null);
  }, []);

  const value = useMemo(() => ({
    isScanning,
    startScanning,
    stopScanning,
    discoveredPeople,
    highlightedPersonId,
    clearHighlight,
    hasPermission,
    requestPermission,
  }), [isScanning, discoveredPeople, highlightedPersonId, hasPermission, startScanning, stopScanning, clearHighlight]);

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
}
