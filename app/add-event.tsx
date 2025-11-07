import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalendar } from "@/context/CalendarContext";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Bell } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function AddEvent() {
  const { addEvent, currentDate, colors } = useCalendar();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate] = useState<Date>(currentDate);
  const [time, setTime] = useState<string>("12:00");
  const [location, setLocation] = useState<string>("");
  const [reminder, setReminder] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    addEvent({
      title: title.trim(),
      description: description.trim(),
      date: selectedDate.toISOString(),
      time,
      color: selectedColor,
      location: location.trim(),
      reminder,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TextInput
            style={styles.titleInput}
            placeholder="Event Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#666" />
              <Text style={styles.sectionTitle}>Date</Text>
            </View>
            <Text style={styles.dateText}>{format(selectedDate, "EEEE, MMMM d, yyyy")}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#666" />
              <Text style={styles.sectionTitle}>Time</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="12:00"
              placeholderTextColor="#999"
              value={time}
              onChangeText={setTime}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#666" />
              <Text style={styles.sectionTitle}>Location (Optional)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details about your event..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorPicker}>
              {colors.map((color: string) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedColor(color);
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.reminderRow}>
              <View style={styles.sectionHeader}>
                <Bell size={20} color="#666" />
                <Text style={styles.sectionTitle}>Reminder</Text>
              </View>
              <Switch
                value={reminder}
                onValueChange={setReminder}
                trackColor={{ false: "#e0e0e0", true: "#007AFF" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Text style={styles.saveButtonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#000",
    marginBottom: 24,
    padding: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#666",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500" as const,
    color: "#000",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  colorPicker: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: "#000",
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#000",
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
});
