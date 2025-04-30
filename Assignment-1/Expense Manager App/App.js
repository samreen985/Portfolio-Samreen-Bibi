import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Picker, Image } from 'react-native';

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [imageUri, setImageUri] = useState(''); // State for image URI

  const addExpense = () => {
    if (amount && category && description) {
      const newExpense = {
        id: Math.random().toString(),
        amount: parseFloat(amount),
        category,
        description,
        image: imageUri || 'https://via.placeholder.com/100', // Default placeholder if no image
      };
      setExpenses([...expenses, newExpense]);
      setAmount('');
      setCategory('');
      setDescription('');
      setImageUri('');
      setShowModal(false);
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2);

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Image source={{ uri: item.image }} style={styles.expenseImage} />
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseText}>{item.description}</Text>
        <Text style={styles.expenseText}>{item.category}</Text>
      </View>
      <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Expense Manager</Text>
        <Text style={styles.totalText}>Total: ${totalExpenses}</Text>
      </View>

      {/* Expense List */}
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
      />

      {/* Removed Images Section */}

      {/* Add Expense Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Expense</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Transport" value="Transport" />
              <Picker.Item label="Entertainment" value="Entertainment" />
              <Picker.Item label="Bills" value="Bills" />
              <Picker.Item label="Shopping" value="Shopping" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#aaa"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL (Optional)"
              placeholderTextColor="#aaa"
              value={imageUri}
              onChangeText={setImageUri}
            />
            <TouchableOpacity style={styles.modalButton} onPress={addExpense}>
              <Text style={styles.modalButtonText}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeModalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background for light theme
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#e0f7fa', // Light teal background
    paddingVertical: 20,
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: '#000',
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b', // Dark teal for the header text
  },
  totalText: {
    fontSize: 18,
    color: '#00796b', // Dark teal for total
    marginTop: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa', // Light gray background for each item
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  expenseImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseText: {
    fontSize: 16,
    color: '#333', // Dark text for description and category
  },
  expenseAmount: {
    fontSize: 16,
    color: '#388E3C', // Green color for amount to indicate money
  },
  addButton: {
    backgroundColor: '#81c784', // Soft green for the add button
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff', // White text on the button
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff', // White background for the modal
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#333', // Dark text for title
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0', // Light gray background for inputs
    color: '#333', // Dark text inside input fields
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#f0f0f0', // Light gray background for picker
    color: '#333', // Dark text for picker options
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#81c784', // Soft green button for modal action
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff', // White text for modal button
    fontWeight: 'bold',
  },
  closeModalButton: {
    backgroundColor: '#888',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;

