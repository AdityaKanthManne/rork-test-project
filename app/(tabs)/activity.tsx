import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActivity } from '@/lib/react-query/queries';
import { format } from 'date-fns';

export default function Activity() {
  const { data: activityData, isLoading } = useActivity();

  const activities = activityData?.documents || [];

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
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No activities yet.</Text>
          <Text style={styles.emptySubtext}>
            Start by creating a group and adding expenses!
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item: any) => item.$id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityDesc}>{item.Desc}</Text>
                <Text style={styles.activityAmount}>₹{item.Amout || '0'}</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityPaidBy}>
                  Paid by {item.PaidBy?.name || 'Unknown'}
                </Text>
                <Text style={styles.activityTime}>
                  {item.Time ? format(new Date(item.Time), 'MMM dd, yyyy') : 'Unknown date'}
                </Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  activityCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityDesc: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    flex: 1,
  },
  activityAmount: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1CC29F',
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityPaidBy: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});
