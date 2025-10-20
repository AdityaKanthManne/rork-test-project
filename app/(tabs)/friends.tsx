import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { useUserContext } from '@/context/AuthContext';
import { useFriends } from '@/lib/react-query/queries';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CC29F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
          <UserPlus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Friend</Text>
        </TouchableOpacity>
      </View>

      {friends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No friends added yet.</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleAddFriend}>
            <Text style={styles.createButtonText}>Add Your First Friend</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item: any) => item.$id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.friendCard}>
              <View style={styles.friendAvatar}>
                <Text style={styles.avatarText}>
                  {item.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name || 'Unknown'}</Text>
                <Text style={styles.friendEmail}>{item.email || ''}</Text>
              </View>
            </View>
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
  friendCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1CC29F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
