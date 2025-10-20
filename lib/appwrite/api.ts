import { ID, Query } from 'appwrite';
import { appwriteConfig, account, databases } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type INewExpense = {
  desc: string;
  paidBy: string;
  group: string;
  Time: string;
  splitMember: string[];
  amount: string;
};

export type INewGroup = {
  userId: string;
  groupName: string;
  members: string[];
};

export type ISettlement = {
  payerId: string;
  receiverId: string;
  amount: number;
};

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error('Failed to create account');
    
    const newUser = await saveUserToDB({
      UserName: user.username,
      email: newAccount.email,
      accountId: newAccount.$id,
      name: newAccount.name,
    });

    return newUser;
  } catch (error) {
    console.error('Create account error:', error);
    throw error;
  }
}

export async function saveUserToDB(user: {
  UserName?: string;
  email: string;
  accountId: string;
  name: string;
}) {
  try {
    const uniqueID = ID.unique();
    console.log('Creating user with ID:', uniqueID);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      uniqueID,
      user
    );

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.friendsCollectionId,
      ID.unique(),
      {
        CollectionId: newUser.$id,
      }
    );

    return newUser;
  } catch (error) {
    console.error('Save user error:', error);
    throw error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    await AsyncStorage.setItem('cookieFallback', JSON.stringify([session]));
    return session;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.error('Get account error:', error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error('No account found');
    
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      throw Error('User not found');
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    await account.deleteSession('current');
    await AsyncStorage.removeItem('cookieFallback');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function createGroup(group: INewGroup) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.groupsCollectionId,
      ID.unique(),
      {
        Creator: group.userId,
        groupName: group.groupName,
        Members: group.members,
      }
    );
    return newPost;
  } catch (error) {
    console.error('Create group error:', error);
    throw error;
  }
}

export async function createExpense(expense: INewExpense) {
  if (!expense.desc) throw new Error('Description is required.');
  if (!expense.paidBy) throw new Error('PaidBy is required.');
  if (!expense.group) throw new Error('Group is required.');
  if (!expense.splitMember || !Array.isArray(expense.splitMember) || expense.splitMember.length === 0) {
    throw new Error('SplitMember is required and should be a non-empty array.');
  }
  if (!expense.amount) throw new Error('Amount is required.');

  try {
    const newExpense = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.activityCollectionId,
      ID.unique(),
      {
        Desc: expense.desc,
        PaidBy: expense.paidBy,
        Group: expense.group,
        Time: new Date().toISOString(),
        splitMember: expense.splitMember,
        Amout: expense.amount,
      }
    );
    return newExpense;
  } catch (error) {
    console.error('Create expense error:', error);
    throw error;
  }
}

export async function getsettlement(userId?: string, receiverId?: string) {
  const queryArray = [];
  if (userId) queryArray.push(Query.equal('payerId', userId));
  if (receiverId) queryArray.push(Query.equal('receiverId', receiverId));

  try {
    const settlementData = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.TransactionCollectionId,
      queryArray
    );
    return settlementData;
  } catch (error) {
    console.error('Get settlement error:', error);
    throw error;
  }
}

export async function makeSettlement(settle: ISettlement) {
  try {
    const newSettlement = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.TransactionCollectionId,
      ID.unique(),
      {
        payerId: settle.payerId,
        receiverId: settle.receiverId,
        Amount: settle.amount.toString(),
        Time: new Date().toISOString(),
      }
    );
    return newSettlement;
  } catch (error) {
    console.error('Make settlement error:', error);
    throw error;
  }
}

export async function deleteActivity(activityId?: string) {
  if (!activityId) throw new Error('Activity ID is required');
  
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.activityCollectionId,
      activityId
    );
    return { status: 'Ok' };
  } catch (error) {
    console.error('Delete activity error:', error);
    throw error;
  }
}

export async function deleteGroup(groupId?: string) {
  if (!groupId) throw new Error('Group ID is required');
  
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.groupsCollectionId,
      groupId
    );
    return { status: 'Ok' };
  } catch (error) {
    console.error('Delete group error:', error);
    throw error;
  }
}

export async function getGroups() {
  try {
    const groups = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.groupsCollectionId,
      [Query.orderDesc('$createdAt')]
    );
    return groups;
  } catch (error) {
    console.error('Get groups error:', error);
    throw error;
  }
}

export async function getFriends(userId?: string) {
  if (!userId) return null;
  
  try {
    const friendsData = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.friendsCollectionId,
      [Query.equal('CollectionId', userId)]
    );
    return friendsData;
  } catch (error) {
    console.error('Get friends error:', error);
    throw error;
  }
}

export async function getActivity() {
  try {
    const activity = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.activityCollectionId,
      [Query.orderDesc('$createdAt')]
    );
    return activity;
  } catch (error) {
    console.error('Get activity error:', error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.friendsCollectionId
    );
    return users;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    return user;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
}

export async function getGroupById(groupId: string) {
  try {
    const group = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.groupsCollectionId,
      groupId
    );
    return group;
  } catch (error) {
    console.error('Get group by ID error:', error);
    throw error;
  }
}

export async function getGroupsActivityById(groups: string[]) {
  try {
    const groupActivities = await Promise.all(
      groups.map(async (group: any) => {
        const groupData = await getGroupById(group.$id);
        if (groupData) {
          groupData.activity.forEach((obj: { [key: string]: any }) => {
            obj['Group'] = group;
          });
          return groupData.activity;
        }
        return [];
      })
    );
    return groupActivities.flat();
  } catch (error) {
    console.error('Get groups activity error:', error);
    return [];
  }
}

export async function getUserGroupsById(groups: string[]) {
  try {
    const groupActivities = await Promise.all(
      groups.map(async (group: any) => {
        const groupData = await getGroupById(group.$id);
        return groupData || [];
      })
    );
    return groupActivities.flat();
  } catch (error) {
    console.error('Get user groups error:', error);
    return [];
  }
}

export async function geByUsername(username: string) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('UserName', username)]
    );
    
    if (!users.documents || users.documents.length === 0) {
      throw new Error('User not found');
    }
    
    return users.documents[0];
  } catch (error) {
    console.error('Get by username error:', error);
    throw error;
  }
}
