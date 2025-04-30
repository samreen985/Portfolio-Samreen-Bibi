// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SeatSelectionScreen from './screens/SeatSelectionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Seats" component={SeatSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const API_KEY = 'YOUR_TMDB_API_KEY';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results);
        setFiltered(data.results);
      });
  }, []);

  useEffect(() => {
    setFiltered(
      movies.filter(movie =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Movies..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Seats')}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              style={styles.poster}
            />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.release_date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    padding: 8,
  },
  card: { flexDirection: 'row', marginBottom: 15 },
  poster: { width: 80, height: 120, marginRight: 10, borderRadius: 8 },
  title: { fontWeight: 'bold', fontSize: 16 },
  date: { color: 'gray' },
});

// screens/SeatSelectionScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SeatSelectionScreen() {
  const [seats, setSeats] = useState([]);
  const