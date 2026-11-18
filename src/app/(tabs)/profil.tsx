import { tabStyles } from "@/src/styles/tabStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getAuthSession, logoutApi, clearAuthSession, UserData } from "@/src/services/authService";

export default function ProfilScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const session = await getAuthSession();
      if (session?.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar dari akun?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Keluar",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            try {
              const session = await getAuthSession();
              if (session?.token) {
                await logoutApi(session.token);
              }
              await clearAuthSession();
              router.replace("/login");
            } catch (error) {
              Alert.alert("Error", "Gagal logout. Silakan coba lagi.");
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={tabStyles.screenContainer} contentContainerStyle={tabStyles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={tabStyles.card}>
        <View style={tabStyles.profileAvatar}>
          <Ionicons name="person" size={30} color="#2563EB" />
        </View>
        <Text style={tabStyles.sectionTitle}>{user?.name || "Nama Pengguna"}</Text>
        <Text style={tabStyles.sectionSubtitle}>{user?.email || "email@example.com"}</Text>
        {user?.no_hp && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Ionicons name="call-outline" size={14} color="#64748B" />
            <Text style={{ fontSize: 13, color: "#64748B" }}>{user.no_hp}</Text>
          </View>
        )}
      </View>

      <View style={tabStyles.card}>
        <Text style={[tabStyles.sectionTitle, { fontSize: 16, marginBottom: 8 }]}>Informasi Mahasiswa</Text>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: "#64748B" }}>Nama Mahasiswa:</Text>
            <Text style={{ fontSize: 13, color: "#0F172A", fontWeight: "600" }}>Cindy Claudya Luahambowo</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: "#64748B" }}>No BP:</Text>
            <Text style={{ fontSize: 13, color: "#0F172A", fontWeight: "600" }}>2320002</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: "#64748B" }}>Modul:</Text>
            <Text style={{ fontSize: 13, color: "#0F172A", fontWeight: "600" }}>11 - Laravel API Integration</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[tabStyles.logoutButton, loggingOut && { opacity: 0.6 }]} 
        activeOpacity={0.8} 
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator size="small" color="#DC2626" />
        ) : (
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        )}
        <Text style={tabStyles.logoutButtonText}>{loggingOut ? "Memproses..." : "Keluar dari Akun"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
