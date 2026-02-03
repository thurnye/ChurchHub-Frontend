import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import { MediaPlayerScreen } from "@/features/media-player/screens/MediaPlayerScreen";

export default function MediaPlayerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <MediaPlayerScreen
      // id={String(id)}
      // onBack={() => router.back()}
    />
  );
}
