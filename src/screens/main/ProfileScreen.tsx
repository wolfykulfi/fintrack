import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Card, Switch, Button, Divider, List, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toggleTheme } from '../../store/slices/themeSlice';
import useAuth from '../../hooks/useAuth';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.theme);
  const paperTheme = useTheme();
  const { logOut } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logOut();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.avatarText}>
                  {user?.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.displayName || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.text }]}>{user?.email}</Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </View>

        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferences</Text>
            <List.Item
              title="Dark Mode"
              titleStyle={{ color: theme.colors.text }}
              right={() => (
                <Switch
                  value={theme.isDark}
                  onValueChange={() => dispatch(toggleTheme())}
                  color={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Notifications"
              titleStyle={{ color: theme.colors.text }}
              right={() => <Switch value={true} color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title="Biometric Authentication"
              titleStyle={{ color: theme.colors.text }}
              right={() => <Switch value={false} color={theme.colors.primary} />}
            />
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>AI Features</Text>
            <List.Item
              title="AI-Powered Categorization"
              titleStyle={{ color: theme.colors.text }}
              description="Automatically categorize your transactions"
              descriptionStyle={{ color: theme.colors.text, opacity: 0.7 }}
              right={() => <Switch value={true} color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title="Budget Recommendations"
              titleStyle={{ color: theme.colors.text }}
              description="Get AI-powered budget suggestions"
              descriptionStyle={{ color: theme.colors.text, opacity: 0.7 }}
              right={() => <Switch value={true} color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title="Fraud Detection"
              titleStyle={{ color: theme.colors.text }}
              description="Get alerts for suspicious transactions"
              descriptionStyle={{ color: theme.colors.text, opacity: 0.7 }}
              right={() => <Switch value={true} color={theme.colors.primary} />}
            />
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
            <TouchableOpacity style={styles.supportItem}>
              <MaterialCommunityIcons name="help-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.supportText, { color: theme.colors.text }]}>Help Center</Text>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity style={styles.supportItem}>
              <MaterialCommunityIcons name="email" size={24} color={theme.colors.primary} />
              <Text style={[styles.supportText, { color: theme.colors.text }]}>Contact Support</Text>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity style={styles.supportItem}>
              <MaterialCommunityIcons name="star" size={24} color={theme.colors.primary} />
              <Text style={[styles.supportText, { color: theme.colors.text }]}>Rate the App</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          color="red"
        >
          Logout
        </Button>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 15,
    opacity: 0.7,
  },
  editButton: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  supportText: {
    marginLeft: 15,
    fontSize: 16,
  },
  divider: {
    height: 1,
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  versionText: {
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: 20,
  },
});

export default ProfileScreen; 