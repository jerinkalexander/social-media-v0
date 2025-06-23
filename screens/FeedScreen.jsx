"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Image } from "react-native"
import { supabase } from "../lib/supabase"
import { Ionicons } from "@expo/vector-icons"

export default function FeedScreen() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          ),
          likes (
            user_id
          ),
          comments (
            id
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  async function toggleLike(postId, isLiked) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isLiked) {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id)
      } else {
        await supabase.from("likes").insert({ post_id: postId, user_id: user.id })
      }

      fetchPosts()
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  function renderPost({ item }) {
    const {
      data: { user },
    } = supabase.auth.getUser()
    const isLiked = item.likes?.some((like) => like.user_id === user?.id)
    const likesCount = item.likes?.length || 0
    const commentsCount = item.comments?.length || 0

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image
            source={{
              uri: item.profiles?.avatar_url || "https://via.placeholder.com/40",
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{item.profiles?.full_name || item.profiles?.username || "Anonymous"}</Text>
            <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        {item.image_url && <Image source={{ uri: item.image_url }} style={styles.postImage} />}

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id, isLiked)}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "#e74c3c" : "#666"} />
            <Text style={styles.actionText}>{likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#666" />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Feed</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1877f2",
    padding: 15,
    paddingTop: 50,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  postContainer: {
    backgroundColor: "white",
    marginVertical: 5,
    padding: 15,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    color: "#666",
  },
})
