import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// TMDB API Key (Replace with your own)
const API_KEY = 'YOUR_TMDB_API_KEY';
const MOVIE_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

// Event & Travel Data with Faster-Loading Images
const eventData = [
  { id: '101', title: 'Music Festival 🎵', poster: 'https://source.unsplash.com/300x200/?music', date: '2025-05-01', type: 'Event' },
  { id: '102', title: 'Tech Conference 💻', poster: 'https://source.unsplash.com/300x200/?tech', date: '2025-06-10', type: 'Event' },
  { id: '103', title: 'Food Expo 🍔', poster: 'https://source.unsplash.com/300x200/?food', date: '2025-07-15', type: 'Event' },
  { id: '104', title: 'Art Exhibition 🎨', poster: 'https://source.unsplash.com/300x200/?art', date: '2025-08-20', type: 'Event' },
  { id: '105', title: 'Car Show 🚗', poster: 'https://source.unsplash.com/300x200/?car', date: '2025-09-05', type: 'Event' },
];

const travelData = [
  { id: '201', title: 'Trip to Paris 🗼', poster: 'https://source.unsplash.com/300x200/?paris', date: 'Anytime', type: 'Travel' },
  { id: '202', title: 'Mountain Trekking 🏔️', poster: 'https://source.unsplash.com/300x200/?mountain', date: 'Seasonal', type: 'Travel' },
  { id: '203', title: 'Beach Vacation 🌴', poster: 'https://source.unsplash.com/300x200/?beach', date: 'Summer 2025', type: 'Travel' },
  { id: '204', title: 'Jungle Safari 🦁', poster: 'https://source.unsplash.com/300x200/?jungle', date: 'Anytime', type: 'Travel' },
  { id: '205', title: 'Skiing Adventure 🎿', poster: 'https://source.unsplash.com/300x200/?skiing', date: 'Winter 2025', type: 'Travel' },
];

// Home Screen
const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(MOVIE_API_URL);
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Merge all data (Movies, Events, Travel)
  const allData = [
    ...movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`, // Smaller image size for faster loading
      date: movie.release_date,
      type: 'Movie',
    })),
    ...eventData,
    ...travelData,
  ];

  // Filter data based on search query
  const filteredData = allData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Movies, Events, Travel..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ff6f61" />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Details', { item })}>
              <Image
                source={{ uri: item.poster }}
                style={styles.image}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
              {imageLoading && <ActivityIndicator size="small" color="#ff6f61" />}
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>📅 {item.date}</Text>
              <Text style={styles.type}>Category: {item.type}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

// Details Screen
const DetailsScreen = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.poster }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>📅 {item.date}</Text>
      <Text style={styles.type}>Category: {item.type}</Text>
    </View>
  );
};

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ff6f61',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  type: {
    fontSize: 14,
    color: '#888',
  },
});