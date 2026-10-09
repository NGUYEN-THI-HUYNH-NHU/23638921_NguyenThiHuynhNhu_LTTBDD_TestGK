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
      <View style={isTile ? styles.posterWrapper : undefined}>
        <Image
          source={{ uri: item.poster }}
          style={[styles.img, isTile && styles.imgTile]}
        />
        {isTile && (
          <View style={styles.badge}>
            <Text style={{ color: "#fff" }}>
              ⭐{normalizeRating(item.rating).toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {!isTile && (
          <Text style={styles.genre}>
            {item.genre} - {item.year + 1900}
          </Text>
        )}
        <View style={styles.statusContainer}>
          {!isTile && <Text>⭐{normalizeRating(item.rating).toFixed(1)}</Text>}
          <Text>{item.isWatched ? "✅" : "⏳"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MovieCard);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 10,
  },
  cardTile: {
    flexDirection: "column",
    width: "48%",
  },
  posterWrapper: {
    position: "relative",
  },
  img: {
    width: 70,
    height: 100,
    borderRadius: 4,
    resizeMode: "cover",
  },
  imgTile: {
    width: "100%",
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
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
