import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, Button, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FinancialInsight } from '../../types';

const InsightsScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.theme);
  const paperTheme = useTheme();
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'spending' | 'saving' | 'investment' | 'fraud'>('all');
  
  // Mock data for demonstration
  const [insights, setInsights] = useState<FinancialInsight[]>([
    {
      id: '1',
      userId: user?.id || '',
      type: 'spending',
      title: 'Unusual spending detected',
      description: 'Your food expenses are 30% higher than last month. Consider reviewing your eating habits or looking for more affordable options.',
      date: new Date().toISOString(),
      severity: 'medium',
      isRead: false,
    },
    {
      id: '2',
      userId: user?.id || '',
      type: 'saving',
      title: 'Saving opportunity',
      description: 'You could save $50 by reducing your entertainment expenses. Consider free alternatives for some activities.',
      date: new Date().toISOString(),
      severity: 'low',
      isRead: false,
    },
    {
      id: '3',
      userId: user?.id || '',
      type: 'fraud',
      title: 'Potential fraudulent transaction',
      description: 'We detected an unusual transaction of $199.99 at "Unknown Store" that doesn\'t match your spending pattern.',
      date: new Date().toISOString(),
      severity: 'high',
      isRead: false,
    },
    {
      id: '4',
      userId: user?.id || '',
      type: 'investment',
      title: 'Investment recommendation',
      description: 'Based on your savings rate, you could invest $200 monthly in a low-risk fund and potentially earn 5% annually.',
      date: new Date().toISOString(),
      severity: 'medium',
      isRead: false,
    },
    {
      id: '5',
      userId: user?.id || '',
      type: 'spending',
      title: 'Recurring subscription alert',
      description: 'You have 5 active subscriptions totaling $45.95 monthly. Consider reviewing if you need all of them.',
      date: new Date().toISOString(),
      severity: 'low',
      isRead: true,
    },
  ]);

  const filteredInsights = insights.filter(
    insight => selectedFilter === 'all' || insight.type === selectedFilter
  );

  const markAsRead = (id: string) => {
    setInsights(
      insights.map(insight =>
        insight.id === id ? { ...insight, isRead: true } : insight
      )
    );
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'spending':
        return 'cash';
      case 'saving':
        return 'piggy-bank';
      case 'investment':
        return 'chart-line';
      case 'fraud':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
            style={styles.filterChip}
          >
            All Insights
          </Chip>
          <Chip
            selected={selectedFilter === 'spending'}
            onPress={() => setSelectedFilter('spending')}
            style={styles.filterChip}
          >
            Spending
          </Chip>
          <Chip
            selected={selectedFilter === 'saving'}
            onPress={() => setSelectedFilter('saving')}
            style={styles.filterChip}
          >
            Saving
          </Chip>
          <Chip
            selected={selectedFilter === 'investment'}
            onPress={() => setSelectedFilter('investment')}
            style={styles.filterChip}
          >
            Investment
          </Chip>
          <Chip
            selected={selectedFilter === 'fraud'}
            onPress={() => setSelectedFilter('fraud')}
            style={styles.filterChip}
          >
            Fraud Alerts
          </Chip>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          AI-Powered Financial Insights
        </Text>
        
        {filteredInsights.length === 0 ? (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.card }]}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons name="information-outline" size={48} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text, textAlign: 'center', marginTop: 10 }}>
                No insights available for this category.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredInsights.map((insight) => (
            <Card
              key={insight.id}
              style={[
                styles.insightCard,
                { 
                  backgroundColor: theme.colors.card,
                  opacity: insight.isRead ? 0.7 : 1,
                }
              ]}
            >
              <Card.Content>
                <View style={styles.insightHeader}>
                  <View style={styles.insightTitleContainer}>
                    <MaterialCommunityIcons
                      name={getIconForType(insight.type)}
                      size={24}
                      color={getSeverityColor(insight.severity)}
                      style={styles.insightIcon}
                    />
                    <View>
                      <Text style={[styles.insightTitle, { color: theme.colors.text }]}>
                        {insight.title}
                      </Text>
                      <Text style={{ color: theme.colors.text, opacity: 0.6 }}>
                        {new Date(insight.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Chip
                    style={{
                      backgroundColor: getSeverityColor(insight.severity) + '20', // Add transparency
                    }}
                    textStyle={{ color: getSeverityColor(insight.severity) }}
                  >
                    {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                  </Chip>
                </View>
                <Text style={[styles.insightDescription, { color: theme.colors.text }]}>
                  {insight.description}
                </Text>
                {!insight.isRead && (
                  <Button
                    mode="text"
                    onPress={() => markAsRead(insight.id)}
                    style={styles.markReadButton}
                  >
                    Mark as Read
                  </Button>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    marginRight: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  insightCard: {
    marginBottom: 15,
    borderRadius: 10,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  insightIcon: {
    marginRight: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  insightDescription: {
    lineHeight: 20,
    marginVertical: 10,
  },
  markReadButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
});

export default InsightsScreen; 