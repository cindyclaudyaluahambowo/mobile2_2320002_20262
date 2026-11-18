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
import { registerApi, saveAuthSession } from "@/src/services/authService";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !noHp || !password || !confirmPassword) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak cocok!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter!");
      return;
    }

    setLoading(true);
    try {
      const response = await registerApi({
        name,
        email,
        no_hp: noHp,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.success && response.token && response.user) {
        await saveAuthSession(response.user, response.token);
        Alert.alert("Sukses", response.message || "Registrasi berhasil!", [
          { text: "OK", onPress: () => router.replace("/(tabs)/home") },
        ]);
      }
    } catch (error) {
      Alert.alert("Registrasi Gagal", error instanceof Error ? error.message : "Terjadi kesalahan saat registrasi.");
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
          <TouchableOpacity 
            style={authStyles.backButton} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={authStyles.headerRegister}>
            <Ionicons name="person-add" size={48} color="#2563EB" />
            <Text style={authStyles.title}>Daftar Akun Baru</Text>
            <Text style={authStyles.subtitle}>Cindy Claudya L. - BP 2320002</Text>
          </View>

          <View style={authStyles.formContainer}>
            <View style={authStyles.inputGroupRegister}>
              <Text style={authStyles.label}>Nama Lengkap</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Masukkan nama lengkap"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            <View style={authStyles.inputGroupRegister}>
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

            <View style={authStyles.inputGroupRegister}>
              <Text style={authStyles.label}>Nomor HP</Text>
              <TextInput
                style={authStyles.input}
                placeholder="08123456789"
                value={noHp}
                onChangeText={setNoHp}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View style={authStyles.inputGroupRegister}>
              <Text style={authStyles.label}>Password</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Minimal 6 karakter"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={authStyles.inputGroupRegister}>
              <Text style={authStyles.label}>Konfirmasi Password</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Ulangi password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[authStyles.primaryButton, loading && authStyles.primaryButtonDisabled]} 
              onPress={handleRegister} 
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
              <Text style={authStyles.primaryButtonText}>{loading ? "Memproses..." : "Daftar"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={authStyles.linkButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={authStyles.linkText}>
                Sudah punya akun? <Text style={authStyles.linkBold}>Masuk</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
