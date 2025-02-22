import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, Firestore } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Constants from 'expo-constants';

type Exercise = {
  id: string;
  name: string;
  createdAt: Date;
};

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Verify Firebase Configuration
  useEffect(() => {
    const config = Constants.expoConfig?.extra;
    if (!config?.firebaseApiKey) {
      console.error('Firebase configuration is missing');
      Alert.alert('Configuration Error', 'Firebase configuration is not properly loaded.');
      return;
    }
    if (!(db instanceof Firestore)) {
      console.error('Firestore instance is invalid');
      Alert.alert('Database Error', 'Database connection is not properly initialized.');
      return;
    }
    setIsConnected(true);
  }, []);

  // Load exercises from Firebase
  useEffect(() => {
    if (!isConnected) return;

    console.log('Setting up Firebase listener...');
    try {
      const unsubscribe = onSnapshot(collection(db, 'exercises'), (snapshot) => {
        console.log(`Received ${snapshot.docs.length} exercises from Firebase`);
        const exerciseList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setExercises(exerciseList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      }, (error) => {
        console.error('Error loading exercises:', error);
        Alert.alert('Error', 'Failed to load exercises. Please check your connection.');
      });

      return () => {
        console.log('Cleaning up Firebase listener...');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up exercise listener:', error);
      Alert.alert('Error', 'Failed to connect to the database. Please try again later.');
    }
  }, [isConnected]);

  // Add exercise to Firebase
  const addExercise = async () => {
    if (!newExercise.trim()) return;
    if (!isConnected) {
      Alert.alert('Error', 'Not connected to Firebase');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Adding exercise:', newExercise.trim());
      const docRef = await addDoc(collection(db, 'exercises'), {
        name: newExercise.trim(),
        createdAt: serverTimestamp()
      });
      console.log('Exercise added successfully with ID:', docRef.id);
      setNewExercise('');
      Alert.alert('Success', 'Exercise added successfully!');
    } catch (error) {
      console.error('Error adding exercise:', error);
      Alert.alert('Error', 'Failed to add exercise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete exercise from Firebase
  const deleteExercise = async (id: string) => {
    if (!isConnected) {
      Alert.alert('Error', 'Not connected to Firebase');
      return;
    }

    if (isDeleting) {
      console.log('Already deleting an exercise, please wait...');
      return;
    }

    setIsDeleting(id);
    try {
      console.log('Starting delete operation for exercise:', id);
      const exerciseRef = doc(db, 'exercises', id);
      console.log('Created reference to document:', exerciseRef.path);
      await deleteDoc(exerciseRef);
      console.log('Exercise deleted successfully');
      Alert.alert('Success', 'Exercise deleted successfully!');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      Alert.alert(
        'Error',
        'Failed to delete exercise. Please check your connection and try again.'
      );
    } finally {
      setIsDeleting(null);
    }
  };

  // Confirm delete
  const confirmDelete = (id: string, name: string) => {
    if (isDeleting) {
      Alert.alert('Please wait', 'Currently processing another delete operation.');
      return;
    }

    Alert.alert(
      'Delete Exercise',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete confirmed for exercise:', id);
            deleteExercise(id);
          }
        }
      ]
    );
  };

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Connecting to Firebase...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Exercises</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newExercise}
            onChangeText={setNewExercise}
            placeholder="Add new exercise"
            placeholderTextColor="#666"
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[styles.addButton, isLoading && styles.addButtonDisabled]} 
            onPress={addExercise}
            disabled={isLoading}
          >
            <Text style={styles.addButtonText}>{isLoading ? 'Adding...' : 'Add'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.exerciseItem}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseDate}>
                  {item.createdAt.toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => confirmDelete(item.id, item.name)}
                disabled={isDeleting === item.id}
              >
                <FontAwesome 
                  name="trash-o" 
                  size={24} 
                  color={isDeleting === item.id ? '#ccc' : 'red'} 
                />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No exercises added yet. Add your first exercise above!</Text>
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
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
  },
  exerciseDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    color: 'red',
    fontSize: 16,
  },
}); 