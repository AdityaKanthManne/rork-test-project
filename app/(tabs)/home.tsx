import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useGetCurrentUser } from '../../lib/react-query/queries';

export default function Groups() {
  const router = useRouter();
  const { data: currentUser, isLoading } = useGetCurrentUser();

  const userMemberGroups = currentUser?.UserMember
    ? [...currentUser.UserMember].reverse()
    : [];

  const handleCreateGroup = () => {
    router.push('/create-group' as any);
  };

  const handleGroupPress = (groupId: string) => {
    router.push(`/groups/${groupId}` as any);
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
        <Text className="text-3xl font-bold text-white">Groups</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-primary-500 px-4 py-2.5 rounded-2xl gap-1.5"
          onPress={handleCreateGroup}>
          <Plus size={20} color="#FFFFFF" />
          <Text className="text-white text-sm font-semibold">Add Group</Text>
        </TouchableOpacity>
      </View>

      {userMemberGroups.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <Text className="text-gray-400 text-base mb-6 text-center">You are not part of any groups.</Text>
          <TouchableOpacity 
            className="bg-primary-500 px-6 py-3.5 rounded-xl"
            onPress={handleCreateGroup}>
            <Text className="text-white text-base font-bold">Create Your First Group</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userMemberGroups}
          keyExtractor={(item: any) => item.$id}
          contentContainerStyle={{ padding: 20, paddingTop: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row bg-dark-4 rounded-xl p-4 mb-3 items-center"
              onPress={() => handleGroupPress(item.$id)}>
              <View className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center mr-4">
                <Image
                  source={{ uri: 'https://img.icons8.com/color/48/add-user-group-man-man-skin-type-7.png' }}
                  className="w-8 h-8"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-white mb-1">{item.groupName || 'Unnamed Group'}</Text>
                <Text className="text-sm text-gray-400">
                  {item.Members?.length || 0} members
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
