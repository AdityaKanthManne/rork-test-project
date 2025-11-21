import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { useUserContext } from '../../context/AuthContext';
import { useFriends } from '../../lib/react-query/queries';

export default function Friends() {
  const router = useRouter();
  const { user } = useUserContext();
  const { data: friendsData, isLoading } = useFriends(user.id);

  const friends = friendsData?.documents?.[0]?.friends || [];

  const handleAddFriend = () => {
    router.push('/add-friend' as any);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#1CC29F" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="flex-row justify-between items-center px-5 pt-6">
        <Text className="text-3xl font-bold text-white">Friends</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-primary-500 px-4 py-2.5 rounded-2xl gap-1.5"
          onPress={handleAddFriend}>
          <UserPlus size={20} color="#FFFFFF" />
          <Text className="text-white text-sm font-semibold">Add Friend</Text>
        </TouchableOpacity>
      </View>

      {friends.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <Text className="text-gray-400 text-base mb-6 text-center">No friends added yet.</Text>
          <TouchableOpacity 
            className="bg-primary-500 px-6 py-3.5 rounded-xl"
            onPress={handleAddFriend}>
            <Text className="text-white text-base font-bold">Add Your First Friend</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item: any) => item.$id}
          contentContainerStyle={{ padding: 20, paddingTop: 8 }}
          renderItem={({ item }) => (
            <View className="flex-row bg-dark-4 rounded-xl p-4 mb-3 items-center">
              <View className="w-12 h-12 rounded-full bg-primary-500 justify-center items-center mr-4">
                <Text className="text-xl font-bold text-white">
                  {item.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-white mb-1">{item.name || 'Unknown'}</Text>
                <Text className="text-sm text-gray-400">{item.email || ''}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
