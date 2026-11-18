// Ganti alamat IP ini dengan IPv4 laptop Anda saat uji coba di HP fisik
export const API_BASE_URL = "http://192.168.56.1:8000/api";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  PROFILE: `${API_BASE_URL}/profile`,
  LOGOUT: `${API_BASE_URL}/logout`,
};
