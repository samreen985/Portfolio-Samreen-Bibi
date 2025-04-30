import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "https://api.sampleapis.com/movies/animation";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
    loadLikedMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const updatedMovies = data.map(movie => ({
        ...movie,
        description: movie.description || `${movie.title} is a must-watch animated classic.`,
        rating: movie.rating || "N/A", // Add rating field (if missing)
      }));
      setMovies(updatedMovies);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  const loadLikedMovies = async () => {
    try {
      const storedLikes = await AsyncStorage.getItem("likedMovies");
      if (storedLikes) {
        setLikedMovies(JSON.parse(storedLikes));
      }
    } catch (error) {
      console.error("Error loading liked movies:", error);
    }
  };

  const toggleLike = async (id) => {
    const updatedLikes = { ...likedMovies, [id]: !likedMovies[id] };
    setLikedMovies(updatedLikes);
    await AsyncStorage.setItem("likedMovies", JSON.stringify(updatedLikes));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Disney Movies 🎥</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedMovie(item)} style={styles.cardContainer}>
              <Image source={{ uri: item.posterURL }} style={styles.image} />
              <View style={styles.detailsContainer}>
                <Text style={styles.movieTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeButton}>
                  <Ionicons
                    name={likedMovies[item.id] ? "heart" : "heart-outline"}
                    size={24}
                    color={likedMovies[item.id] ? "#E63946" : "#F1FAEE"}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal for Movie Details */}
      <Modal visible={!!selectedMovie} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedMovie && (
              <>
                <Image source={{ uri: selectedMovie.posterURL }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                <Text style={styles.modalDescription}>{selectedMovie.description}</Text>
                
                {/* Movie Rating */}
                <Text style={styles.ratingText}>⭐ Rating: {selectedMovie.rating !== "N/A" ? selectedMovie.rating : "Not available"}</Text>
                
                <TouchableOpacity onPress={() => setSelectedMovie(null)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E63946",
    textAlign: "center",
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: "#34495E",
    padding: 10,
    borderRadius: 15,
    margin: 8,
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 140,
    height: 200,
    borderRadius: 10,
  },
  detailsContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F1FAEE",
  },
  likeButton: {
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(44,62,80,0.9)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1F2833",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF5733",
    marginVertical: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#F1FAEE",
    textAlign: "center",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#FF5733",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#1F2833",
    fontWeight: "bold",
    textAlign: "center",
  },
});
