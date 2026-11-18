import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Halaman tidak ditemukan</Text>
        <Text style={styles.subtitle}>Halaman yang Anda cari tidak tersedia.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Kembali ke halaman utama</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2563EB',
    borderRadius: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
