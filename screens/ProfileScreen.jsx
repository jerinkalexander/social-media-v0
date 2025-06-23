"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native"
import { supabase } from "../lib/supabase"
import { Ionicons } from "@expo/vector-icons"

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchUserPosts()
  }, [])

  async function fetchProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserPosts() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          likes (user_id),
          comments (id)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setUserPosts(data || [])
    } catch (error) {
      console.error("Error fetching user posts:", error)
    }
  }

  async function signOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut()
          if (error) Alert.alert("Error signing out:", error.message)
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri: profile?.avatar_url || "https://via.placeholder.com/100",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.fullName}>{profile?.full_name || "Anonymous User"}</Text>
        {profile?.username && <Text style={styles.username}>@{profile.username}</Text>}
        {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {userPosts.reduce((total, post) => total + (post.likes?.length || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Comments</Text>
        </View>
      </View>

      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Your Posts</Text>
        {userPosts.map((post) => (
          <View key={post.id} style={styles.postItem}>
            <Text style={styles.postContent} numberOfLines={2}>
              {post.content}
            </Text>
            <Text style={styles.postDate}>{new Date(post.created_at).toLocaleDateString()}</Text>
          </View>
        ))}
        {userPosts.length === 0 && <Text style={styles.noPostsText}>No posts yet</Text>}
      </View>
    </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  signOutButton: {
    padding: 5,
  },
  profileSection: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  statsSection: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    marginBottom: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1877f2",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  postsSection: {
    backgroundColor: "white",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  postItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  postDate: {
    fontSize: 12,
    color: "#666",
  },
  noPostsText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
})
