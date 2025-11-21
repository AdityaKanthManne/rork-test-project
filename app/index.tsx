import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Animated, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalendar } from "./context/CalendarContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function Home() {
  const { events, currentDate, setCurrentDate } = useCalendar();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const fabScale = useRef(new Animated.Value(1)).current;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  const days = eachDayOfInterval({
    start: viewMode === "month" ? calendarStart : weekStart,
    end: viewMode === "month" ? calendarEnd : weekEnd,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.date), day)
    );
  };

  const handlePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === "month" && styles.toggleButtonActive]}
              onPress={() => setViewMode("month")}
            >
              <Text style={[styles.toggleText, viewMode === "month" && styles.toggleTextActive]}>
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === "week" && styles.toggleButtonActive]}
              onPress={() => setViewMode("week")}
            >
              <Text style={[styles.toggleText, viewMode === "week" && styles.toggleTextActive]}>
                Week
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.navigation}>
          <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.monthYear}>{format(currentDate, "MMMM yyyy")}</Text>
          <TouchableOpacity onPress={handleNext} style={styles.navButton}>
            <ChevronRight size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <View key={day} style={styles.weekDayCell}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.calendar}>
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(day);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !isCurrentMonth && viewMode === "month" && styles.dayCellOtherMonth,
                ]}
                onPress={() => {
                  setCurrentDate(day);
                  if (dayEvents.length > 0) {
                    router.push(`/event/${dayEvents[0].id}`);
                  } else {
                    router.push("/add-event");
                  }
                }}
              >
                <View
                  style={[
                    styles.dayNumber,
                    isTodayDate && styles.todayCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !isCurrentMonth && viewMode === "month" && styles.dayTextOtherMonth,
                      isTodayDate && styles.todayText,
                    ]}
                  >
                    {format(day, "d")}
                  </Text>
                </View>
                <View style={styles.eventDots}>
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <View
                      key={event.id}
                      style={[styles.eventDot, { backgroundColor: event.color }]}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <Text style={styles.moreEvents}>+{dayEvents.length - 3}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.upcomingSection}>
          <Text style={styles.upcomingTitle}>Upcoming Events</Text>
          {events
            .filter((event) => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => router.push(`/event/${event.id}`)}
              >
                <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>
                    {format(new Date(event.date), "MMM d, yyyy")} at {event.time}
                  </Text>
                  {event.description && (
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {event.description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          router.push("/add-event");
        }}
        onPressIn={() => {
          Animated.spring(fabScale, {
            toValue: 0.9,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(fabScale, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
        activeOpacity={1}
      >
        <Animated.View style={{ transform: [{ scale: fabScale }] }}>
          <Plus size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  safeArea: {
    backgroundColor: "#fff",
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#000",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: "#fff",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#666",
  },
  toggleTextActive: {
    color: "#000",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#000",
  },
  weekDays: {
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  weekDayCell: {
    width: width / 7,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  dayCell: {
    width: width / 7,
    height: 80,
    padding: 4,
    alignItems: "center",
  },
  dayCellOtherMonth: {
    opacity: 0.3,
  },
  dayNumber: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  todayCircle: {
    backgroundColor: "#007AFF",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: "#000",
  },
  dayTextOtherMonth: {
    color: "#999",
  },
  todayText: {
    color: "#fff",
    fontWeight: "700" as const,
  },
  eventDots: {
    flexDirection: "row",
    marginTop: 4,
    gap: 2,
    alignItems: "center",
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  moreEvents: {
    fontSize: 10,
    color: "#666",
    marginLeft: 2,
  },
  upcomingSection: {
    padding: 20,
  },
  upcomingTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#000",
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#000",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: "#888",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
