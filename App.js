import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Button as BootstrapButton } from 'react-bootstrap';

const NASA_API_KEY = "5e2heoSXfSoyApKcabhzRdUHLa5XeLL6nA0lsUEU"; // Replace with your NASA API key

export default function App() {
  const [asteroidId, setAsteroidId] = useState("");
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAsteroidData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${NASA_API_KEY}`
      );
      const data = await response.json();
      if (data.code === 404) {
        setAsteroidData(null); // Set to null if not found
      } else {
        setAsteroidData({
          name: data.name,
          url: data.nasa_jpl_url,
          isHazardous: data.is_potentially_hazardous_asteroid,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch asteroid data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomAsteroid = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${NASA_API_KEY}`
      );
      const data = await response.json();
      const randomAsteroid =
        data.near_earth_objects[
          Math.floor(Math.random() * data.near_earth_objects.length)
        ];
      fetchAsteroidData(randomAsteroid.id);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch random asteroid");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (asteroidId) fetchAsteroidData(asteroidId);
  };

  const sampleAsteroids = [
    { name: "433 Eros", id: "2000433" },
    { name: "1862 Apollo", id: "2001862" },
    { name: "1221 Amor", id: "2001221" },
    { name: "2062 Aten", id: "2002062" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Asteroid Lookup</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Here"
        value={asteroidId}
        onChangeText={setAsteroidId}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Submit"
          onPress={handleSearchSubmit}
          disabled={!asteroidId}
        />
        <Button title="Random Asteroid" onPress={fetchRandomAsteroid} />
      </View>

      {/* Sample IDs Section */}
      <View style={styles.sampleContainer}>
        <Text style={styles.sampleHeader}>Example IDs:</Text>
        {sampleAsteroids.map((asteroid) => (
          <Button
            key={asteroid.id}
            title={asteroid.name}
            onPress={() => setAsteroidId(asteroid.id)}
            style={styles.sampleButton}
          />
        ))}
        <Text style={styles.note}>
          Click an example ID to autofill the search bar.
        </Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {asteroidData ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>Asteroid Details</Text>
          <Text style={styles.resultText}>
            Name: <Text style={styles.resultValue}>{asteroidData.name}</Text>
          </Text>
          <Text style={styles.resultText}>
            URL: <Text style={styles.resultValue}>{asteroidData.url}</Text>
          </Text>
          <Text style={styles.resultText}>
            Potentially Hazardous:{" "}
            <Text style={styles.resultValue}>
              {asteroidData.isHazardous ? "Yes" : "No"}
            </Text>
          </Text>
        </View>
      ) : (
        !loading && (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>Not Found</Text>
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28, // Increase the font size for prominence
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15, // Reduce margin to move it closer
    color: "#003366", // Darker blue color
    fontFamily: "sans-serif", // Adjust to a preferred font family (e.g., 'sans-serif', 'serif', or a custom font)
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sampleContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  sampleHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  resultCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e6f7ff",
    borderRadius: 10,
    elevation: 3, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultHeader: {
    fontSize: 24, // Slightly increase the size for emphasis
    fontWeight: "bold",
    marginBottom: 10,
    color: "#003366", // Use the same darker blue for consistency
    fontFamily: "sans-serif", // Adjust font family if needed
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "sans-serif", // Ensure consistency in font family
  },
  resultValue: {
    fontWeight: "600",
    color: "#00509e", // Darker blue for values
    fontFamily: "sans-serif",
  },
});
