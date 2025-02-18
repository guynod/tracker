import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type WorkoutEntry = {
  id: string;
  exercise: string;
  date: string;
};

// For demo purposes, showing some sample data
const sampleHistory: WorkoutEntry[] = [
  { id: '1', exercise: 'Push-ups', date: '2024-02-18' },
  { id: '2', exercise: 'Squats', date: '2024-02-17' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={sampleHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.exerciseName}>{item.exercise}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No workout history yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  historyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
}); 