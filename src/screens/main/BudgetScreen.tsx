import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, ProgressBar, Button, FAB, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Budget, BudgetRecommendation } from '../../types';

const BudgetScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.theme);
  const paperTheme = useTheme();
  
  // Mock data for demonstration
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
    {
      id: '3',
      userId: user?.id || '',
      category: 'Transport',
      limit: 150,
      spent: 135,
      period: 'monthly',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    },
    {
      id: '4',
      userId: user?.id || '',
      category: 'Shopping',
      limit: 200,
      spent: 180,
      period: 'monthly',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    },
  ]);

  // Mock AI recommendations
  const [recommendations, setRecommendations] = useState<BudgetRecommendation[]>([
    {
      categoryId: '1',
      category: 'Food',
      recommendedAmount: 250,
      currentAmount: 300,
      period: 'monthly',
      reasoning: 'Based on your spending patterns, you could reduce your food budget by $50.',
    },
    {
      categoryId: '3',
      category: 'Transport',
      recommendedAmount: 180,
      currentAmount: 150,
      period: 'monthly',
      reasoning: 'Your transport expenses consistently exceed your budget. Consider increasing it by $30.',
    },
  ]);

  const getProgressColor = (spent: number, limit: number) => {
    const ratio = spent / limit;
    if (ratio > 0.9) return 'red';
    if (ratio > 0.7) return 'orange';
    return theme.colors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Monthly Budget Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={{ color: theme.colors.text }}>Total Budget</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                  ${budgets.reduce((sum, budget) => sum + budget.limit, 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={{ color: theme.colors.text }}>Total Spent</Text>
                <Text style={[styles.summaryValue, { color: 'red' }]}>
                  ${budgets.reduce((sum, budget) => sum + budget.spent, 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={{ color: theme.colors.text }}>Remaining</Text>
                <Text style={[styles.summaryValue, { color: 'green' }]}>
                  ${budgets
                    .reduce((sum, budget) => sum + (budget.limit - budget.spent), 0)
                    .toFixed(2)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Budgets</Text>

        {budgets.map((budget) => (
          <Card
            key={budget.id}
            style={[styles.budgetCard, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('BudgetDetail', { budget })}
          >
            <Card.Content>
              <View style={styles.budgetHeader}>
                <Text style={[styles.budgetCategory, { color: theme.colors.text }]}>
                  {budget.category}
                </Text>
                <Text style={{ color: theme.colors.text }}>
                  ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                </Text>
              </View>
              <ProgressBar
                progress={budget.spent / budget.limit}
                color={getProgressColor(budget.spent, budget.limit)}
                style={styles.progressBar}
              />
              <View style={styles.budgetFooter}>
                <Text style={{ color: theme.colors.text, opacity: 0.7 }}>
                  {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
                </Text>
                <Text
                  style={{
                    color:
                      budget.spent > budget.limit
                        ? 'red'
                        : budget.spent / budget.limit > 0.9
                        ? 'orange'
                        : 'green',
                  }}
                >
                  {budget.spent > budget.limit
                    ? `$${(budget.spent - budget.limit).toFixed(2)} over budget`
                    : `$${(budget.limit - budget.spent).toFixed(2)} left`}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>
          AI Budget Recommendations
        </Text>

        {recommendations.map((recommendation) => (
          <Card
            key={recommendation.categoryId}
            style={[styles.recommendationCard, { backgroundColor: theme.colors.card }]}
          >
            <Card.Content>
              <View style={styles.recommendationHeader}>
                <MaterialCommunityIcons name="lightbulb-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.recommendationTitle, { color: theme.colors.primary }]}>
                  {recommendation.category} Budget Recommendation
                </Text>
              </View>
              <Text style={{ color: theme.colors.text, marginVertical: 10 }}>
                {recommendation.reasoning}
              </Text>
              <View style={styles.recommendationDetails}>
                <View style={styles.recommendationItem}>
                  <Text style={{ color: theme.colors.text }}>Current</Text>
                  <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                    ${recommendation.currentAmount.toFixed(2)}
                  </Text>
                </View>
                <MaterialCommunityIcons name="arrow-right" size={24} color={theme.colors.text} />
                <View style={styles.recommendationItem}>
                  <Text style={{ color: theme.colors.text }}>Recommended</Text>
                  <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    ${recommendation.recommendedAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
              <Button
                mode="contained"
                onPress={() => {
                  // Apply recommendation logic
                  const updatedBudgets = budgets.map((budget) =>
                    budget.category === recommendation.category
                      ? { ...budget, limit: recommendation.recommendedAmount }
                      : budget
                  );
                  setBudgets(updatedBudgets);
                  // Remove the applied recommendation
                  setRecommendations(
                    recommendations.filter((rec) => rec.categoryId !== recommendation.categoryId)
                  );
                }}
                style={styles.applyButton}
              >
                Apply Recommendation
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddBudget')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  summaryCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  budgetCard: {
    marginBottom: 10,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  recommendationCard: {
    marginBottom: 15,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  recommendationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 15,
  },
  recommendationItem: {
    alignItems: 'center',
  },
  applyButton: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default BudgetScreen; 