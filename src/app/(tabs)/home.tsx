import { homeStyles } from "@/src/styles/homeStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuthSession, UserData } from "@/src/services/authService";

export default function HomeScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const session = await getAuthSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        // Jika tidak ada session, redirect ke login
        router.replace("/login");
      }
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = (menuName: string, targetRoute?: string) => {
    if (targetRoute) {
      router.push(targetRoute as never);
    } else {
      Alert.alert(
        menuName,
        `Fitur ${menuName} siap dikembangkan pada tahapan modul berikutnya.`
      );
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={homeStyles.safeArea} edges={[]}>
      <ScrollView
        style={homeStyles.scrollContainer}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={homeStyles.welcomeCard}>
          <View style={homeStyles.statusBadge}>
            <Ionicons name="checkmark-circle" size={15} color="#059669" />
            <Text style={homeStyles.statusBadgeText}>Terhubung ke API Laravel</Text>
          </View>
          <Text style={homeStyles.greetingTitle}>Halo, {user?.name || "Pengguna"}!</Text>
          <Text style={homeStyles.greetingEmail}>{user?.email || "user@example.com"}</Text>
        </View>

        <View style={homeStyles.menuCard}>
          <View style={homeStyles.menuHeader}>
            <Text style={homeStyles.menuSectionTitle}>Layanan & Menu Utama</Text>
            <Text style={homeStyles.menuSectionSubtitle}>
              Pintasan cepat pengelolaan operasional minimarket
            </Text>
          </View>

          <View style={homeStyles.menuGrid}>
            <TouchableOpacity style={homeStyles.menuItem} activeOpacity={0.75} onPress={() => handleMenuPress("Produk", "/produk")}>
              <View style={[homeStyles.menuIconWrapper, homeStyles.iconBgBlue]}>
                <Ionicons name="cube" size={26} color="#2563EB" />
              </View>
              <Text style={homeStyles.menuLabel}>Produk</Text>
            </TouchableOpacity>

            <TouchableOpacity style={homeStyles.menuItem} activeOpacity={0.75} onPress={() => handleMenuPress("Pelanggan")}>
              <View style={[homeStyles.menuIconWrapper, homeStyles.iconBgGreen]}>
                <Ionicons name="people" size={26} color="#059669" />
              </View>
              <Text style={homeStyles.menuLabel}>Pelanggan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={homeStyles.menuItem} activeOpacity={0.75} onPress={() => handleMenuPress("Supplier")}>
              <View style={[homeStyles.menuIconWrapper, homeStyles.iconBgAmber]}>
                <Ionicons name="business" size={26} color="#D97706" />
              </View>
              <Text style={homeStyles.menuLabel}>Supplier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={homeStyles.menuItem} activeOpacity={0.75} onPress={() => handleMenuPress("Barang Masuk")}>
              <View style={[homeStyles.menuIconWrapper, homeStyles.iconBgTeal]}>
                <Ionicons name="download" size={26} color="#0D9488" />
              </View>
              <Text style={homeStyles.menuLabel}>Barang Masuk</Text>
            </TouchableOpacity>

            <TouchableOpacity style={homeStyles.menuItem} activeOpacity={0.75} onPress={() => handleMenuPress("Barang Keluar")}>
              <View style={[homeStyles.menuIconWrapper, homeStyles.iconBgRose]}>
                <Ionicons name="share" size={26} color="#E11D48" />
              </View>
              <Text style={homeStyles.menuLabel}>Barang Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
