import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalendar, CalendarEvent } from "../context/CalendarContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Bell, Trash2, Edit3, Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function EventDetails() {
  const { getEventById, updateEvent, deleteEvent, colors } = useCalendar();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [event, setEvent] = useState<CalendarEvent | null>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [reminder, setReminder] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

  useEffect(() => {
    if (id) {
      const foundEvent = getEventById(id);
      if (foundEvent) {
        setEvent(foundEvent);
        setTitle(foundEvent.title);
        setDescription(foundEvent.description || "");
        setTime(foundEvent.time);
        setLocation(foundEvent.location || "");
        setReminder(foundEvent.reminder || false);
        setSelectedColor(foundEvent.color);
      }
    }
  }, [id, getEventById]);

  const handleSave = () => {
    if (!title.trim() || !id) {
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    updateEvent(id, {
      title: title.trim(),
      description: description.trim(),
      time,
      color: selectedColor,
      location: location.trim(),
      reminder,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to delete this event?")) {
        deleteEvent(id);
        router.back();
      }
    } else {
      Alert.alert(
        "Delete Event",
        "Are you sure you want to delete this event?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteEvent(id);
              router.back();
            },
          },
        ]
      );
    }
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Event Title"
              placeholderTextColor="#999"
              autoFocus
            />
          ) : (
            <Text style={styles.title}>{event.title}</Text>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#666" />
              <Text style={styles.sectionTitle}>Date</Text>
            </View>
            <Text style={styles.dateText}>
              {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#666" />
              <Text style={styles.sectionTitle}>Time</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="12:00"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.infoText}>{event.time}</Text>
            )}
          </View>

          {(isEditing || event.location) && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MapPin size={20} color="#666" />
                <Text style={styles.sectionTitle}>Location</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Add location"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.infoText}>{event.location}</Text>
              )}
            </View>
          )}

          {(isEditing || event.description) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add details..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.infoText}>{event.description}</Text>
              )}
            </View>
          )}

          {isEditing && (
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
          )}

          <View style={styles.section}>
            <View style={styles.reminderRow}>
              <View style={styles.sectionHeader}>
                <Bell size={20} color="#666" />
                <Text style={styles.sectionTitle}>Reminder</Text>
              </View>
              {isEditing ? (
                <Switch
                  value={reminder}
                  onValueChange={setReminder}
                  trackColor={{ false: "#e0e0e0", true: "#007AFF" }}
                  thumbColor="#fff"
                />
              ) : (
                <Text style={styles.infoText}>{event.reminder ? "On" : "Off"}</Text>
              )}
            </View>
          </View>

          {!isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Trash2 size={20} color="#FF3B30" />
              <Text style={styles.deleteButtonText}>Delete Event</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                setTitle(event.title);
                setDescription(event.description || "");
                setTime(event.time);
                setLocation(event.location || "");
                setReminder(event.reminder || false);
                setSelectedColor(event.color);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!title.trim()}
            >
              <Check size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Edit3 size={20} color="#007AFF" />
            <Text style={styles.editButtonText}>Edit Event</Text>
          </TouchableOpacity>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#000",
    marginBottom: 24,
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
  infoText: {
    fontSize: 16,
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FF3B30",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#007AFF",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#007AFF",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
});
