import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import MovieCard, { Movie } from "../components/MovieCard";

const API = "https://6aba238f5b549d818d6200ef.mockapi.io/api/movies";

const MovieScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTile, setIsTile] = useState<boolean>(false);
  const numCols = isTile ? 2 : 1;
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchMovies = useCallback(async () => {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Error ocur");
    const data: Movie[] = await res.json();
    setMovies(data);
  }, []);

  useEffect(() => {
    setLoading(true);
    try {
      fetchMovies();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchMovies();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchMovies]);

  const handleSelect = useCallback(
    (id: string) => {
      const movie = movies.find((m) => m.id === id);
      if (movie) {
        Alert.alert(`${movie.title} - ${movie.year}`);
        window.alert(`${movie.title} - ${movie.year}`);
      }
    },
    [movies]
  );

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading data..</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie App</Text>
      <View style={styles.modeContainer}>
        <Text>Tile mode:</Text>
        <Switch value={isTile} onValueChange={setIsTile} />
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            layout={isTile ? "tile" : "row"}
            onSelect={handleSelect}
          />
        )}
        key={String(numCols)}
        numColumns={numCols}
        columnWrapperStyle={
          numCols === 2 ? { justifyContent: "space-between" } : undefined
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
  },
  modeContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
});
