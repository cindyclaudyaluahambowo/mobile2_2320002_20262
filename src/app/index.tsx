import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { getAuthSession } from "@/src/services/authService";

export default function IndexScreen() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const session = await getAuthSession();
      
      // Simulate splash screen delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (session?.token && session?.user) {
        // User sudah login, langsung ke home
        router.replace("/(tabs)/home");
      } else {
        // User belum login, ke login screen
        router.replace("/login");
      }
    } catch (error) {
      // Jika error, tetap ke login
      router.replace("/login");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile 2</Text>
      <Text style={styles.subtitle}>Minimarket App</Text>
      <Text style={styles.author}>Cindy Claudya Luahambowo</Text>
      <Text style={styles.bp}>BP 2320002</Text>
      <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },
  bp: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});
