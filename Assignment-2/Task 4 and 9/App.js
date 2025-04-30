import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const categories = [
  { name: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80' },
  { name: 'Travel', image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1470&q=80' },
  { name: 'Entertainment', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=1376&q=80' },
  { name: 'Shopping', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1399&q=80' },
  { name: 'Bills', image: 'https://images.unsplash.com/photo-1604594849809-dfeddd827859?auto=format&fit=crop&w=1470&q=80' },
  { name: 'Other', image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=1528&q=80' },
];

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch('https://my-json-server.typicode.com/typicode/demo/posts') // Replace with actual API
      .then(response => response.json())
      .then(data => {
        const formattedExpenses = data.map(item => ({
          id: item.id?.toString() || Math.random().toString(),
          category: item.category || 'Other',
          amount: item.amount || 0, // Ensures amount is defined
          description: item.description || 'No description',
          date: item.date || new Date().toLocaleDateString(),
        }));
        setExpenses(formattedExpenses);
      })
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  const addExpense = () => {
    if (!amount || !description) {
      alert('Please enter amount and description.');
      return;
    }
    const newExpense = {
      id: Math.random().toString(),
      category: selectedCategory,
      amount: parseFloat(amount),
      description,
      date: new Date().toLocaleDateString(),
    };
    setExpenses([...expenses, newExpense]);
    setAmount('');
    setDescription('');
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Image
        source={{ uri: categories.find(cat => cat.name === item.category)?.image || 'https://via.placeholder.com/60' }}
        style={styles.expenseImage}
      />
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Text style={styles.expenseAmount}>${item.amount ? item.amount.toFixed(2) : '0.00'}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Manager</Text>

      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.name}
              style={[styles.categoryButton, selectedCategory === cat.name && styles.selectedCategory]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Image source={{ uri: cat.image }} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.formLabel}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.formLabel}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.addButton} onPress={addExpense}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.expenseHeader}>Your Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.expenseList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  formContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', elevation: 3 },
  formLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  categoryContainer: { flexDirection: 'row', marginBottom: 16 },
  categoryButton: { alignItems: 'center', marginRight: 8, borderRadius: 8, overflow: 'hidden', width: 100, backgroundColor: '#e0e0e0' },
  selectedCategory: { borderColor: '#ff6f61', borderWidth: 2 },
  categoryImage: { width: 100, height: 60 },
  categoryText: { fontSize: 14, color: '#333', padding: 8 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 16, backgroundColor: '#fff' },
  addButton: { backgroundColor: '#ff6f61', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  expenseHeader: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  expenseList: { paddingBottom: 16 },
  expenseItem: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', elevation: 3 },
  expenseImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  expenseDetails: { flex: 1 },
  expenseCategory: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  expenseDescription: { fontSize: 14, color: '#666', marginVertical: 4 },
  expenseAmount: { fontSize: 16, fontWeight: 'bold', color: '#ff6f61' },
  expenseDate: { fontSize: 12, color: '#999', marginTop: 4 },
});

export default App;
