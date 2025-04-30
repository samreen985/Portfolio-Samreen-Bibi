import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

const ProductScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(err => {
        setError('Failed to fetch categories.');
      });
  }, []);

  const filterProducts = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#8e44ad" style={styles.loader} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>E-Commerce App</Text>
      </View>
      
      <View style={styles.categories}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={() => filterProducts('all')} style={styles.categoryCard}>
            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} onPress={() => filterProducts(category)} style={styles.categoryCard}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.products}>
        <Text style={styles.sectionTitle}>Products</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredProducts.map(product => (
            <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => navigation.navigate('ProductDetails', { product })}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;

  const addToCart = async () => {
    try {
      let cart = await AsyncStorage.getItem('cart');
      cart = cart ? JSON.parse(cart) : [];
      cart.push(product);
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Could not add product to cart.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.detailImage} />
      <Text style={styles.detailTitle}>{product.title}</Text>
      <Text style={styles.detailPrice}>${product.price}</Text>
      <Text style={styles.detailDescription}>{product.description}</Text>
      <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductScreen">
        <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ title: 'Products' }} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  header: { backgroundColor: '#8e44ad', padding: 20, alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  categories: { padding: 10 },
  categoryCard: { backgroundColor: '#fff', padding: 15, marginRight: 10, borderRadius: 8, shadowOpacity: 0.2, elevation: 3, alignItems: 'center' },
  categoryText: { fontSize: 16, fontWeight: '500', color: '#8e44ad' },
  products: { padding: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#8e44ad' },
  productCard: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 15, alignItems: 'center', shadowOpacity: 0.2, elevation: 3 },
  productImage: { width: 150, height: 150, borderRadius: 8 },
  productTitle: { marginTop: 10, fontSize: 16, fontWeight: '500', color: '#333' },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#8e44ad', marginTop: 5 },
  detailImage: { width: '100%', height: 300, resizeMode: 'contain' },
  detailTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  detailPrice: { fontSize: 20, fontWeight: 'bold', color: '#8e44ad', textAlign: 'center' },
  detailDescription: { fontSize: 16, padding: 10, textAlign: 'center' },
  addToCartButton: { backgroundColor: '#8e44ad', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', color: 'red', marginTop: 20, fontSize: 16 },
});

export default App;