import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function WeatherApp() {
  const city = "Islamabad";
  const temperature = "22°C";
  const weather = "Sunny";

  const weatherIcons = {
    Sunny: "weather-sunny",
    Cloudy: "weather-cloudy",
    Rainy: "weather-rainy",
  };

  return (
    <ImageBackground 
      source={{ uri: "https://source.unsplash.com/1600x900/?nature,sky" }} 
      style={styles.background}
    >
      <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]} style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.city}>{city}</Text>
            <Text style={styles.temperature}>{temperature}</Text>
            <Text style={styles.weather}>{weather}</Text>
            <MaterialCommunityIcons name={weatherIcons[weather]} size={160} color="#FFD700" style={styles.icon} />
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    padding: 30,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
    backdropFilter: "blur(15px)",
  },
  city: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
  },
  temperature: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
  },
  weather: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 5,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
  },
  icon: {
    marginVertical: 20,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 12,
  },
});