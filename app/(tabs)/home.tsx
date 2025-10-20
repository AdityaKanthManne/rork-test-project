import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useGetCurrentUser } from '@/lib/react-query/queries';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CC29F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groups</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateGroup}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Group</Text>
        </TouchableOpacity>
      </View>

      {userMemberGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You are not part of any groups.</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
            <Text style={styles.createButtonText}>Create Your First Group</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userMemberGroups}
          keyExtractor={(item: any) => item.$id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupCard}
              onPress={() => handleGroupPress(item.$id)}>
              <View style={styles.groupIcon}>
                <Image
                  source={{ uri: 'https://img.icons8.com/color/48/add-user-group-man-man-skin-type-7.png' }}
                  style={styles.groupImage}
                />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.groupName || 'Unnamed Group'}</Text>
                <Text style={styles.groupMembers}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1CC29F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#1CC29F',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupImage: {
    width: 32,
    height: 32,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
