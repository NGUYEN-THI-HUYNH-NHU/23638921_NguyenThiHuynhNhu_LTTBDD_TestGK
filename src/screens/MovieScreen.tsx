import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MovieCard, { Movie } from "../components/MovieCard";

const API = "https://6aba238f5b549d818d6200ef.mockapi.io/api/movies";
const LIMIT = 10;

const MovieScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isTile, setIsTile] = useState<boolean>(false);

  // Các state hỗ trợ phân trang
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Ref làm cờ chặn gọi request trùng lắp khi cuộn nhanh
  const isFetchingRef = useRef<boolean>(false);

  const numCols = isTile ? 2 : 1;

  const fetchMoviesByPage = useCallback(
    async (pageNumber: number, isRefresh = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsError(false);

      try {
        const res = await fetch(`${API}?page=${pageNumber}&limit=${LIMIT}`);
        if (!res.ok) throw new Error("Fetch failed");

        const data: Movie[] = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (data.length < LIMIT) setHasMore(false);

        setMovies((prev) => {
          if (isRefresh || pageNumber === 1) return data;
          const existingIds = new Set(prev.map((m) => m.id));
          const newItems = data.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newItems];
        });
      } catch (error) {
        console.log("Error fetching movies: ", error);
        setIsError(true);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    setLoading(true);
    fetchMoviesByPage(1);
  }, [fetchMoviesByPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchMoviesByPage(1, true);
  }, [fetchMoviesByPage]);

  const handleLoadMore = useCallback(() => {
    // Chặn gọi nếu đang tải, đã hết dữ liệu, đang bị lỗi hoặc cờ fetching đang bật
    if (loadingMore || !hasMore || isError || isFetchingRef.current) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchMoviesByPage(nextPage);
  }, [page, loadingMore, hasMore, isError, fetchMoviesByPage]);

  const handleRetry = useCallback(() => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    fetchMoviesByPage(page);
  }, [page, fetchMoviesByPage]);

  const handleSelect = useCallback(
    (id: string) => {
      const movie = movies.find((m) => m.id === id);
      if (movie) {
        Alert.alert(`${movie.title} - ${movie.year}`);
        window.alert(`${movie.title} - ${movie.year}`);
      }
    },
    [movies],
  );

  const renderFooter = () => {
    if (loadingMore)
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" />
          <Text style={styles.footerText}>Loading more movies...</Text>
        </View>
      );

    if (isError)
      return (
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: "red" }]}>
            Loading failed
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      );

    if (!hasMore && movies.length > 0)
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>All movies has been loaded</Text>
        </View>
      );

    return null;
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading data...</Text>
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
        // Các prop phục vụ phân trang
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modeContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  footerContainer: {
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  retryBtn: {
    borderRadius: 4,
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 8,
  },
});
