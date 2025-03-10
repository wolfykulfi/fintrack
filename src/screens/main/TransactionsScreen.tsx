import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, Searchbar, Chip, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Transaction } from '../../types';

const TransactionsScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.theme);
  const paperTheme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  // Mock data for demonstration
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      userId: user?.id || '',
      amount: 45.99,
      category: 'Food',
      description: 'Grocery shopping',
      date: new Date().toISOString(),
      type: 'expense',
      isRecurring: false,
    },
    {
      id: '2',
      userId: user?.id || '',
      amount: 9.99,
      category: 'Entertainment',
      description: 'Netflix subscription',
      date: new Date().toISOString(),
      type: 'expense',
      isRecurring: true,
      recurringFrequency: 'monthly',
    },
    {
      id: '3',
      userId: user?.id || '',
      amount: 2500,
      category: 'Income',
      description: 'Salary',
      date: new Date().toISOString(),
      type: 'income',
      isRecurring: true,
      recurringFrequency: 'monthly',
    },
    {
      id: '4',
      userId: user?.id || '',
      amount: 35.50,
      category: 'Transport',
      description: 'Uber ride',
      date: new Date().toISOString(),
      type: 'expense',
      isRecurring: false,
    },
    {
      id: '5',
      userId: user?.id || '',
      amount: 120.75,
      category: 'Shopping',
      description: 'New clothes',
      date: new Date().toISOString(),
      type: 'expense',
      isRecurring: false,
    },
  ]);

  const filteredTransactions = transactions.filter(transaction => {
    // Apply search filter
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter
    const matchesType = selectedFilter === 'all' || transaction.type === selectedFilter;
    
    return matchesSearch && matchesType;
  });

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}>
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]} mode="outlined">
        <Card.Content style={styles.cardContent}>
          <View style={styles.transactionIcon}>
            <MaterialCommunityIcons
              name={item.type === 'income' ? 'arrow-down' : 'arrow-up'}
              size={24}
              color={item.type === 'income' ? 'green' : 'red'}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>{item.description}</Text>
            <Text style={{ color: theme.colors.text, opacity: 0.7 }}>{item.category}</Text>
            <Text style={{ color: theme.colors.text, opacity: 0.5 }}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text
              style={{
                color: item.type === 'income' ? 'green' : 'red',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
            {item.isRecurring && (
              <MaterialCommunityIcons name="refresh" size={16} color={theme.colors.text} />
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search transactions"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => setSelectedFilter('all')}
          style={styles.filterChip}
        >
          All
        </Chip>
        <Chip
          selected={selectedFilter === 'income'}
          onPress={() => setSelectedFilter('income')}
          style={styles.filterChip}
        >
          Income
        </Chip>
        <Chip
          selected={selectedFilter === 'expense'}
          onPress={() => setSelectedFilter('expense')}
          style={styles.filterChip}
        >
          Expenses
        </Chip>
      </View>
      
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddTransaction')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TransactionsScreen; 