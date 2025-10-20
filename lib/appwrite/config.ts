import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appwriteConfig = {
  url: process.env.EXPO_PUBLIC_APPWRITE_URL || '',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '',
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || '',
  groupsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GROUPS_COLLECTION_ID || '',
  activityCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID || '',
  friendsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_FRIENDS_COLLECTION_ID || '',
  TransactionCollectionId: process.env.EXPO_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID || '',
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
