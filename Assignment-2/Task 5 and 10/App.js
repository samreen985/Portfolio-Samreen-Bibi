import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const API_URL = 'https://jsonplaceholder.typicode.com/users'; 
const ORDER_HISTORY_API = 'https://jsonplaceholder.typicode.com/posts'; 

// Home Screen Component
const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [cuisineFilter, setCuisineFilter] = useState('');

  useEffect(() => {
    fetchRestaurants();
    fetchOrderHistory();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch(ORDER_HISTORY_API);
      const data = await response.json();
      setOrderHistory(data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const filterByCuisine = (text) => {
    setCuisineFilter(text);
    if (text === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter((restaurant) => 
        restaurant.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Delivery</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Filter by cuisine..."
        value={cuisineFilter}
        onChangeText={filterByCuisine}
      />

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantCuisine}>{item.username}</Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.orderHistoryButton} 
        onPress={() => navigation.navigate('OrderHistory', { orders: orderHistory })}
      >
        <Text style={styles.orderHistoryText}>View Order History</Text>
      </TouchableOpacity>
    </View>
  );
};

// Order History Screen Component
const OrderHistoryScreen = ({ route }) => {
  const { orders } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <Text style={styles.restaurantName}>Order ID: {item.id}</Text>
            <Text style={styles.restaurantCuisine}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

// Main App with Navigation
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#2d3436' },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  searchBar: { padding: 10, backgroundColor: '#333', borderRadius: 10, fontSize: 16, color: '#fff', marginBottom: 10 },
  restaurantItem: { backgroundColor: '#34495e', padding: 15, marginBottom: 10, borderRadius: 10 },
  restaurantName: { fontSize: 18, color: '#ecf0f1', fontWeight: 'bold' },
  restaurantCuisine: { fontSize: 16, color: '#95a5a6' },
  orderHistoryButton: { backgroundColor: '#d63031', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  orderHistoryText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default App;
