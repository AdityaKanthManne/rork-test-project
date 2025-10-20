import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000' },
          }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-expense/[id]" options={{ presentation: 'modal', title: 'Add Expense' }} />
          <Stack.Screen name="settlement/[amount]/[receiverID]" options={{ presentation: 'modal', title: 'Settlement' }} />
          <Stack.Screen name="groups/[id]" options={{ title: 'Group Details' }} />
          <Stack.Screen name="add-member/[id]" options={{ presentation: 'modal', title: 'Add Member' }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
