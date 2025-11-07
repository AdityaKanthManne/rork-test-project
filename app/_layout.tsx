import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CalendarProvider } from "@/context/CalendarContext";

export default function RootLayout() {
  return (
    <CalendarProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="add-event" 
          options={{ 
            presentation: "modal",
            headerShown: true,
            title: "New Event"
          }} 
        />
        <Stack.Screen 
          name="event/[id]" 
          options={{ 
            presentation: "modal",
            headerShown: true,
            title: "Event Details"
          }} 
        />
      </Stack>
    </CalendarProvider>
  );
}
