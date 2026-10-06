import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type Movie = {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  isWatched: boolean;
};

interface MovieCardProps {
  item: Movie;
  layout: "tile" | "row";
  onSelect: (id: string) => void;
}

const MovieCard = ({ item, layout = "row", onSelect }: MovieCardProps) => {
  const isTile = layout === "tile";

  const normalizeRating = (rating: number) => {
    return rating % 10;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isTile && styles.cardTile]}
      onPress={() => onSelect(item.id)}
    >
      <Image
        source={{ uri: item.poster }}
        style={[styles.img, isTile && styles.imgTile]}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {!isTile && (
          <Text style={styles.genre}>
            {item.genre} - {item.year}
          </Text>
        )}
        <View style={styles.statusContainer}>
          {!isTile && <Text>⭐{normalizeRating(item.rating).toFixed(1)}</Text>}
          {item.isWatched ? <Text>✅</Text> : <Text>⏳</Text>}
        </View>
      </View>
      {isTile && (
        <View style={styles.badge}>
          <Text style={{ color: "#fff" }}>
            ⭐{normalizeRating(item.rating).toFixed(1)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(MovieCard);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 6,
    padding: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 10,
  },
  cardTile: {
    flexDirection: "column",
    width: "48%",
  },
  img: {
    width: 70,
    height: 100,
    resizeMode: "cover",
  },
  imgTile: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  genre: {
    fontSize: 16,
    fontStyle: "italic",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 4,
    paddingHorizontal: 3,
  },
});
