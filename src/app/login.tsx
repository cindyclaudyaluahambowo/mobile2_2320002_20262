import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "@/src/styles/authStyles";
import { loginApi, saveAuthSession } from "@/src/services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password tidak boleh kosong!");
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi({ email, password });
      
      if (response.success && response.token && response.user) {
        await saveAuthSession(response.user, response.token);
        Alert.alert("Sukses", response.message || "Login berhasil!");
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      Alert.alert("Login Gagal", error instanceof Error ? error.message : "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.container}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.header}>
            <Ionicons name="lock-closed" size={48} color="#2563EB" />
            <Text style={authStyles.title}>Masuk ke Mobile 2</Text>
            <Text style={authStyles.subtitle}>Aplikasi Manajemen Minimarket - BP 2320002</Text>
          </View>

          <View style={authStyles.formContainer}>
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Email</Text>
              <TextInput
                style={authStyles.input}
                placeholder="mahasiswa@kampus.ac.id"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Password</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Masukkan password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[authStyles.primaryButton, loading && authStyles.primaryButtonDisabled]} 
              onPress={handleLogin} 
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
              <Text style={authStyles.primaryButtonText}>{loading ? "Memproses..." : "Masuk"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={authStyles.linkButton}
              onPress={() => router.push("/register")}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={authStyles.linkText}>
                Belum punya akun? <Text style={authStyles.linkBold}>Daftar</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
