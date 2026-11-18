# Welcome to Mobile2 App 👋

Praktikum Modul 10 & 11 - Pemrograman Mobile 2  
**Dibuat oleh:** Cindy Claudya Luahambowo (BP 2320002)

This is an Expo project created with `create-expo-app` and customized for minimarket management application with **Laravel 13 API backend integration**.

## 📱 Fitur Aplikasi

### **Modul 10: UI & Navigation**
- 🎨 Custom folder structure (`src/app/`)
- 🧭 File-based routing dengan Expo Router
- 🎯 Tab navigation (Home, Produk, Transaksi, Report, Profil)

### **Modul 11: Backend Integration (NEW!)**
- 🔐 **Authentication dengan Laravel Sanctum**
  - Register dengan validasi server-side
  - Login dengan token generation
  - Auto-login dengan AsyncStorage
  - Logout dengan token revocation
- 💾 **Persistent Storage dengan AsyncStorage**
- 🔄 **Real-time data dari database**
- ✅ **Protected routes & session management**
- 📡 **RESTful API integration**

## 🚀 Get started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup Laravel Backend (NEW - Modul 11)

#### A. Install Laravel API
```bash
# Di folder project ini sudah ada CindyClaudyaAppApi (ignored dari git)
# Jika belum ada, buat dengan:
composer create-project laravel/laravel:^13.0 CindyClaudyaAppApi
cd CindyClaudyaAppApi
composer require laravel/sanctum
php artisan migrate
```

#### B. Start Laravel Server
```bash
cd CindyClaudyaAppApi
php artisan serve --host=0.0.0.0 --port=8000
```

Server akan running di: `http://192.168.x.x:8000`

#### C. Update IP Address
Edit `src/config/api.ts` dan ganti IP sesuai laptop Anda:
```typescript
export const API_BASE_URL = "http://[YOUR_IP]:8000/api";
```

### 3. Start Expo App

```bash
npx expo start
```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) **(Recommended for testing)**

Pastikan HP dan laptop dalam **WiFi yang sama** untuk testing!

## 📂 Struktur Project

```
mobile2_2320002_20262/
├── src/
│   ├── app/                    # File-based routing (Expo Router)
│   │   ├── (tabs)/             # Tab navigation screens
│   │   │   ├── home.tsx        # Dashboard (load user dari API)
│   │   │   ├── produk.tsx
│   │   │   ├── profil.tsx      # User profile + logout
│   │   │   ├── report.tsx
│   │   │   └── transaksi.tsx
│   │   ├── index.tsx           # Splash + auto-login check
│   │   ├── login.tsx           # Login dengan API
│   │   ├── register.tsx        # Register dengan API
│   │   └── _layout.tsx
│   ├── config/                 # NEW - Modul 11
│   │   └── api.ts              # API endpoints configuration
│   ├── services/               # NEW - Modul 11
│   │   └── authService.ts      # API calls & AsyncStorage
│   └── styles/
│       ├── homeStyles.ts
│       ├── tabStyles.ts
│       └── authStyles.ts       # NEW - Loading states
├── assets/                     # Images, fonts
├── CindyClaudyaAppApi/        # Laravel 13 Backend (gitignored)
└── README.md
```

## 🔄 Authentication Flow (Modul 11)

### **1. Register Flow**
```
User → Fill Form (nama, email, no_hp, password)
     → POST /api/register
     → Laravel validate & create user
     → Generate Sanctum token
     → Save token + user to AsyncStorage
     → Redirect to Home
```

### **2. Login Flow**
```
User → Enter credentials
     → POST /api/login
     → Laravel validate & generate token
     → Save token + user to AsyncStorage
     → Redirect to Home
```

### **3. Auto-Login (Splash Screen)**
```
App Launch → Check AsyncStorage for token
           → If token exists → Redirect to Home
           → If not → Redirect to Login
```

### **4. Logout Flow**
```
User → Click Logout
     → POST /api/logout (revoke token)
     → Clear AsyncStorage
     → Redirect to Login
```

## 🛠️ Teknologi yang Digunakan

### **Frontend:**
- **React Native** 0.88.1
- **Expo SDK** 58
- **TypeScript** 6.0.3
- **Expo Router** - File-based navigation
- **AsyncStorage** 2.2.0 - Persistent storage (NEW)
- **React** 19.3.0

### **Backend (NEW - Modul 11):**
- **Laravel** 13.43.0
- **Laravel Sanctum** 4.5.0 - API Authentication
- **PHP** 8.3.30
- **SQLite** - Database

## 🔌 API Endpoints

Base URL: `http://[YOUR_IP]:8000/api`

### **Public Routes:**
- `POST /register` - Create new user account
- `POST /login` - Authenticate user & get token

### **Protected Routes (requires Bearer token):**
- `GET /profile` - Get authenticated user data
- `POST /logout` - Revoke user token

## 📸 Screenshot

Screenshot aplikasi tersimpan di folder `screenshot/`

## 🧪 Testing Guide

### **1. Test dengan Smartphone**
1. Install **Expo Go** di HP
2. Pastikan HP dan laptop dalam **WiFi yang sama**
3. Start Laravel server: `php artisan serve --host=0.0.0.0`
4. Start Expo: `npx expo start`
5. Scan QR code dengan Expo Go
6. Test flow: Register → Login → Home → Logout

### **2. Test API dengan Postman/Thunder Client**

#### Register:
```json
POST http://192.168.x.x:8000/api/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "no_hp": "081234567890",
  "password": "123456",
  "password_confirmation": "123456"
}
```

#### Login:
```json
POST http://192.168.x.x:8000/api/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

#### Profile:
```
GET http://192.168.x.x:8000/api/profile
Authorization: Bearer [your-token]
```

## 🔧 Troubleshooting

### **Error: "Tidak dapat terhubung ke server Laravel"**
**Solution:**
1. Pastikan Laravel server running: `php artisan serve --host=0.0.0.0`
2. Pastikan HP & laptop dalam WiFi yang **sama**
3. Update IP di `src/config/api.ts` sesuai IP laptop Anda
4. Test API dengan browser: `http://[YOUR_IP]:8000/api/profile`

### **Error: "Email sudah terdaftar"**
**Solution:**
- Normal! Email memang sudah digunakan
- Gunakan email lain atau login dengan email yang sudah terdaftar

### **App stuck di Splash Screen**
**Solution:**
1. Clear cache: Uninstall app dari HP, install ulang
2. Restart Expo server: `npx expo start --clear`
3. Check console log untuk error detail

### **Error bundling: "Cannot resolve @/components"**
**Solution:**
- Sudah fixed! File `_layout.tsx` dan `+not-found.tsx` sudah diupdate
- Restart dengan `npx expo start --clear`

## 🔧 Other setup steps

- To set up **ESLint** for linting, run `npx expo lint`, or follow the [ESLint guide](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up **unit testing**, follow the [Jest testing guide](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the [TypeScript setup](https://docs.expo.dev/guides/typescript/)

## 📚 Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Laravel Sanctum Docs](https://laravel.com/docs/11.x/sanctum): API Authentication with tokens

## 🤝 Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

---

## 📊 Perbedaan Modul 10 vs Modul 11

| Fitur | Modul 10 | Modul 11 |
|-------|----------|----------|
| **Backend** | ❌ UI Only | ✅ Laravel 13 + Sanctum |
| **Database** | ❌ Tidak ada | ✅ SQLite with users |
| **Authentication** | UI saja | ✅ Real API validation |
| **Login** | Hardcoded redirect | ✅ Token-based auth |
| **Register** | Form only | ✅ Save to database |
| **Logout** | Simple redirect | ✅ Token revocation |
| **User Data** | From params | ✅ From database |
| **Persistence** | ❌ Tidak ada | ✅ AsyncStorage |
| **Auto Login** | ❌ Tidak ada | ✅ Check token on launch |

---

**Project Information:**
- Nama: Cindy Claudya Luahambowo
- No BP: 2320002
- Mata Kuliah: Pemrograman Mobile 2
- Modul: 10 (UI/Navigation) + 11 (Laravel API Integration)
- Repository: https://github.com/cindyclaudyaluahambowo/mobile2_2320002_20262
