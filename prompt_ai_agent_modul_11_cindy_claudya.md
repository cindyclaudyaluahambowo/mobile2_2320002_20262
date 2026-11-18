# Tugas AI Agent: Implementasi Modul 11 React Native Expo & Laravel 13

Tugas Anda sebagai Senior Full-Stack Developer adalah mengimplementasikan "Modul 11", yang menghubungkan aplikasi React Native Expo ke backend Laravel 13 menggunakan Laravel Sanctum dan AsyncStorage.

Ikuti instruksi ini secara berurutan dan tulis kodenya dengan sempurna. 

## BAGIAN 1: SISI BACKEND (LARAVEL 13)

Asumsi: Proyek Laravel sudah diinisialisasi di folder `CindyClaudyaAppApi` sejajar dengan proyek mobile. Jika belum, instruksikan pengguna untuk menjalankan `composer create-project laravel/laravel:^13.0 CindyClaudyaAppApi` terlebih dahulu.

### Langkah 1.1: Perbarui Migrasi Tabel Users
Buka file migrasi `database/migrations/0001_01_01_000000_create_users_table.php`.
Sisipkan kolom `no_hp` dan `foto` di antara `email` dan `email_verified_at`:

```php
$table->string('no_hp', 20)->nullable();
$table->string('foto')->nullable();
```

### Langkah 1.2: Perbarui Model User (`app/Models/User.php`)
Tambahkan `HasApiTokens` dan perbarui array `#[Fillable]`:

```php
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'no_hp', 'foto', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    // ... sisa kode tetap sama
}
```

### Langkah 1.3: Buat `AuthController` (`app/Http/Controllers/Api/AuthController.php`)
Buat file ini dan isi dengan fungsi register, login, profile, dan logout persis seperti berikut:

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'no_hp' => 'required|string|max:20',
            'foto' => 'nullable|string|max:255',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar, silakan gunakan email lain.',
            'no_hp.required' => 'Nomor HP wajib diisi.',
            'password.min' => 'Kata sandi minimal terdiri dari 6 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'no_hp' => $validated['no_hp'],
            'foto' => $validated['foto'] ?? null,
            'password' => $validated['password'],
        ]);

        $token = $user->createToken('mobile-app-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi akun berhasil.',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi yang Anda masukkan salah.',
            ], 401);
        }

        $user->tokens()->delete();
        $token = $user->createToken('mobile-app-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar dan token telah dihapus dari server.',
        ], 200);
    }
}
```

### Langkah 1.4: Daftarkan Rute API (`routes/api.php`)

```php
<?php
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

---

## BAGIAN 2: SISI FRONTEND (REACT NATIVE EXPO)

Asumsi: Berada di folder `CindyClaudyaApp`. Pustaka `@react-native-async-storage/async-storage` harus sudah diinstal.

### Langkah 2.1: Buat `src/config/api.ts`

```typescript
// Ganti alamat IP ini dengan IPv4 laptop Anda saat uji coba di HP fisik
export const API_BASE_URL = "http://192.168.1.15:8000/api";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  PROFILE: `${API_BASE_URL}/profile`,
  LOGOUT: `${API_BASE_URL}/logout`,
};
```

### Langkah 2.2: Buat `src/services/authService.ts`

```typescript
import { API_ENDPOINTS } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@cindyclaudyaapp_token";
const AUTH_USER_KEY = "@cindyclaudyaapp_user";

export interface UserData {
  id: number;
  name: string;
  email: string;
  no_hp: string | null;
  foto: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserData;
}

export interface AuthSession {
  token: string;
  user: UserData;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  no_hp: string;
  password: string;
  password_confirmation: string;
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      const firstMsg = data.errors[firstKey]?.[0];
      if (firstMsg) {
        throw new Error(firstMsg);
      }
    }
    throw new Error(data?.message || `Permintaan gagal dengan status HTTP ${response.status}.`);
  }
  return data as T;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse<AuthResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Tidak dapat terhubung ke server Laravel. Pastikan server berjalan dan IP Wi-Fi sesuai.");
    throw error;
  }
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse<AuthResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Tidak dapat terhubung ke server Laravel. Periksa koneksi Wi-Fi dan alamat API_BASE_URL.");
    throw error;
  }
}

export async function logoutApi(token: string): Promise<void> {
  try {
    await fetch(API_ENDPOINTS.LOGOUT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  } catch {}
}

export async function saveAuthSession(user: UserData, token: string): Promise<void> {
  await AsyncStorage.multiSet([[AUTH_TOKEN_KEY, token], [AUTH_USER_KEY, JSON.stringify(user)]]);
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const values = await AsyncStorage.multiGet([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
  const token = values[0]?.[1];
  const userJson = values[1]?.[1];
  if (!token || !userJson) return null;
  try {
    return { token, user: JSON.parse(userJson) as UserData };
  } catch {
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
}
```

### Langkah 2.3: Tambah Style Loading di `src/styles/authStyles.ts`
Pastikan objek style ini ditambahkan di dalam `StyleSheet.create({ ... })`:

```typescript
  primaryButtonDisabled: { opacity: 0.65 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" },
```

### Langkah 2.4: Integrasi di Layar (`index.tsx`, `login.tsx`, `register.tsx`, `home.tsx`, `profil.tsx`)
Instruksikan AI untuk membaca file layar yang ada, mengimpor fungsi dari `src/services/authService.ts`, serta merombak fungsi `handleLogin`, `handleRegister`, dan `handleLogout` menggunakan `try-catch` dan `setLoading` persis seperti instruksi Modul 11.