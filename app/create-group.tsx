import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useCreateGroup } from '../lib/react-query/queries';
import { useUserContext } from '../context/AuthContext';

export default function CreateGroup() {
  const router = useRouter();
  const { user } = useUserContext();
  const createGroupMutation = useCreateGroup();
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      await createGroupMutation.mutateAsync({
        userId: user.id,
        groupName,
        members: [user.id],
      });
      
      Alert.alert('Success', 'Group created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Create Group</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-5">
          <View className="mb-6">
            <Text className="text-sm font-semibold text-white mb-2">Group Name</Text>
            <TextInput
              className="bg-dark-4 rounded-xl px-4 py-3.5 text-base text-white border border-gray-700"
              placeholder="Enter group name"
              placeholderTextColor="#9CA3AF"
              value={groupName}
              onChangeText={setGroupName}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            className={`bg-primary-500 rounded-xl py-4 items-center mb-4 ${loading ? 'opacity-60' : ''}`}
            onPress={handleCreateGroup}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-bold">Create Group</Text>
            )}
          </TouchableOpacity>

          <Text className="text-sm text-gray-400 text-center">
            You can add members to the group after creating it.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
