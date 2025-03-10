import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Button, FAB, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Transaction, Budget, FinancialInsight } from '../../types';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.theme);
  const paperTheme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
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
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      userId: user?.id || '',
      category: 'Food',
      limit: 300,
      spent: 120,
      period: 'monthly',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    },
    {
      id: '2',
      userId: user?.id || '',
      category: 'Entertainment',
      limit: 100,
      spent: 45,
      period: 'monthly',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    },
  ]);

  const [insights, setInsights] = useState<FinancialInsight[]>([
    {
      id: '1',
      userId: user?.id || '',
      type: 'spending',
      title: 'Unusual spending detected',
      description: 'Your food expenses are 30% higher than last month.',
      date: new Date().toISOString(),
      severity: 'medium',
      isRead: false,
    },
    {
      id: '2',
      userId: user?.id || '',
      type: 'saving',
      title: 'Saving opportunity',
      description: 'You could save $50 by reducing your entertainment expenses.',
      date: new Date().toISOString(),
      severity: 'low',
      isRead: false,
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Chart data
  const spendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [500, 450, 600, 550, 700, 650],
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
    legend: ['Monthly Spending'],
  };

  const categoryData = [
    {
      name: 'Food',
      population: 120,
      color: '#FF6384',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Entertainment',
      population: 45,
      color: '#36A2EB',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Transport',
      population: 80,
      color: '#FFCE56',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Shopping',
      population: 100,
      color: '#4BC0C0',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.text,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Balance Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Current Balance</Text>
            <Text style={[styles.balanceText, { color: theme.colors.primary }]}>$2,345.67</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={{ color: theme.colors.text }}>Income</Text>
                <Text style={{ color: 'green' }}>+$3,500.00</Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={{ color: theme.colors.text }}>Expenses</Text>
                <Text style={{ color: 'red' }}>-$1,154.33</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Spending Chart */}
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Monthly Spending</Text>
            <LineChart
              data={spendingData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Category Breakdown */}
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Spending by Category</Text>
            <PieChart
              data={categoryData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        {/* Recent Transactions */}
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                <Text style={{ color: theme.colors.primary }}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <MaterialCommunityIcons
                    name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}
                    size={24}
                    color={transaction.type === 'income' ? 'green' : 'red'}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={{ color: theme.colors.text }}>{transaction.description}</Text>
                  <Text style={{ color: theme.colors.text, opacity: 0.7 }}>{transaction.category}</Text>
                </View>
                <Text
                  style={{
                    color: transaction.type === 'income' ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Budget Progress */}
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Budget Progress</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Budget')}>
                <Text style={{ color: theme.colors.primary }}>See All</Text>
              </TouchableOpacity>
            </View>
            {budgets.map((budget) => (
              <View key={budget.id} style={styles.budgetItem}>
                <View style={styles.budgetHeader}>
                  <Text style={{ color: theme.colors.text }}>{budget.category}</Text>
                  <Text style={{ color: theme.colors.text }}>
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${(budget.spent / budget.limit) * 100}%`,
                        backgroundColor:
                          budget.spent / budget.limit > 0.9
                            ? 'red'
                            : budget.spent / budget.limit > 0.7
                            ? 'orange'
                            : theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* AI Insights */}
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>AI Insights</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Insights')}>
                <Text style={{ color: theme.colors.primary }}>See All</Text>
              </TouchableOpacity>
            </View>
            {insights.map((insight) => (
              <View key={insight.id} style={styles.insightItem}>
                <View
                  style={[
                    styles.insightSeverity,
                    {
                      backgroundColor:
                        insight.severity === 'high'
                          ? 'red'
                          : insight.severity === 'medium'
                          ? 'orange'
                          : 'green',
                    },
                  ]}
                />
                <View style={styles.insightContent}>
                  <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                    {insight.title}
                  </Text>
                  <Text style={{ color: theme.colors.text, opacity: 0.7 }}>
                    {insight.description}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('Transactions', { screen: 'AddTransaction' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  balanceItem: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
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
  budgetItem: {
    marginBottom: 15,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  insightSeverity: {
    width: 4,
    borderRadius: 2,
    marginRight: 10,
  },
  insightContent: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen; 