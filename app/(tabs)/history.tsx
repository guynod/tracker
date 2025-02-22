import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

type WorkoutEntry = {
  id: string;
  exercise: string;
  date: string;
};

export default function HistoryScreen() {
  // Placeholder data - will be replaced with Firebase data
  const history: WorkoutEntry[] = [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Workout History</Text>
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.exerciseName}>{item.exercise}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No workout history yet. Start logging your workouts!</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyItem: {
    padding: 15,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 20,
  },
}); 