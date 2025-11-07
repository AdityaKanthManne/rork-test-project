import { useState, useEffect, useMemo, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  color: string;
  location?: string;
  reminder?: boolean;
}

const STORAGE_KEY = "calendar_events";

const COLORS = [
  "#007AFF",
  "#FF3B30",
  "#34C759",
  "#FF9500",
  "#AF52DE",
  "#FF2D55",
  "#5856D6",
  "#00C7BE",
];

export const [CalendarProvider, useCalendar] = createContextHook(() => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEvents = async (newEvents: CalendarEvent[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error("Error saving events:", error);
    }
  };

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
  }, [events]);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...updates } : event
    );
    saveEvents(updatedEvents);
  }, [events]);

  const deleteEvent = useCallback((id: string) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    saveEvents(updatedEvents);
  }, [events]);

  const getEventById = useCallback((id: string): CalendarEvent | undefined => {
    return events.find((event) => event.id === id);
  }, [events]);

  return useMemo(() => ({
    events,
    currentDate,
    setCurrentDate,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    isLoading,
    colors: COLORS,
  }), [events, currentDate, addEvent, updateEvent, deleteEvent, getEventById, isLoading]);
});
