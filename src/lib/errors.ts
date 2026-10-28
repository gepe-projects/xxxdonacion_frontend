import { FirebaseError } from 'firebase/app'
import { ApiError } from './api'

export const EMAIL_NOT_VERIFIED = 'auth-flow/email-not-verified'

/** Error alur auth yang bukan berasal langsung dari Firebase/API. */
export class AuthFlowError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'AuthFlowError'
    this.code = code
  }
}

const firebaseMessages: Record<string, string> = {
  'auth/invalid-credential': 'Email atau password salah.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/user-disabled': 'Akun ini dinonaktifkan.',
  'auth/user-not-found': 'Email atau password salah.',
  'auth/wrong-password': 'Email atau password salah.',
  'auth/email-already-in-use': 'Email ini sudah terdaftar.',
  'auth/weak-password': 'Password terlalu lemah. Minimal 6 karakter.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
  'auth/popup-closed-by-user': 'Login Google dibatalkan.',
  'auth/cancelled-popup-request': 'Login Google dibatalkan.',
  'auth/popup-blocked':
    'Popup login diblokir browser. Izinkan popup lalu coba lagi.',
  'auth/account-exists-with-different-credential':
    'Email ini sudah terdaftar dengan metode login lain.',
  'auth/operation-not-allowed':
    'Metode login ini belum diaktifkan di platform.',
  'auth/network-request-failed': 'Koneksi bermasalah. Coba lagi.',
  'auth/requires-recent-login': 'Silakan masuk ulang untuk melanjutkan.',
}

const apiMessages: Record<string, string> = {
  'email must be verified':
    'Email belum diverifikasi. Cek kotak masuk lalu verifikasi sebelum masuk.',
  'account is disabled': 'Akun kamu dinonaktifkan oleh admin.',
  'user is not provisioned; call sync first':
    'Akun belum tersinkron dengan server. Coba masuk ulang.',
  'email is already linked to another account':
    'Email ini sudah terhubung ke akun lain.',
  'email is already in use': 'Email ini sudah dipakai akun lain.',
  'email already exists': 'Email ini sudah terdaftar.',
  'invalid or expired token': 'Sesi login sudah tidak valid. Masuk ulang.',
  'missing bearer token': 'Kamu belum masuk.',
  'insufficient role': 'Kamu tidak punya akses ke fitur ini.',
  'too many requests': 'Terlalu banyak permintaan. Coba lagi sebentar.',
  'user not found': 'User tidak ditemukan.',
  'cannot change your own status': 'Kamu tidak bisa mengubah status sendiri.',
  'cannot change your own roles': 'Kamu tidak bisa mengubah role sendiri.',
  'cannot delete yourself': 'Kamu tidak bisa menghapus akun sendiri.',
  'SUPER_ADMIN cannot be modified via API':
    'SUPER_ADMIN tidak bisa diubah lewat aplikasi.',
  'only SUPER_ADMIN can manage ADMIN':
    'Hanya SUPER_ADMIN yang bisa mengelola ADMIN.',
  'only SUPER_ADMIN can grant ADMIN':
    'Hanya SUPER_ADMIN yang bisa memberikan role ADMIN.',
  'SUPER_ADMIN cannot be assigned via API':
    'Role SUPER_ADMIN tidak bisa diberikan lewat aplikasi.',
  'at least one role is required': 'Pilih minimal satu role.',
  'invalid role': 'Role tidak valid.',
  'status must be ACTIVE or DISABLED': 'Status tidak valid.',
  'password must be at least 12 characters':
    'Password minimal 12 karakter (atau kosongkan).',
  'invalid email': 'Format email tidak valid.',
  'invalid request body': 'Data yang dikirim tidak valid.',
  'invalid user id': 'ID user tidak valid.',
  'invalid cursor': 'Halaman data tidak valid. Muat ulang daftar.',
  'limit must be a positive integer': 'Limit harus angka positif.',
}

export function apiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return 'Sesi login sudah tidak valid. Silakan masuk ulang.'
    }
    if (error.status === 403) {
      return (
        apiMessages[error.message] ?? 'Kamu tidak punya akses ke fitur ini.'
      )
    }
    if (error.status === 429) {
      return error.retryAfter
        ? `Terlalu banyak permintaan. Coba lagi dalam ${error.retryAfter} detik.`
        : 'Terlalu banyak permintaan. Coba lagi sebentar.'
    }
    if (error.status >= 500) {
      return 'Server sedang bermasalah. Coba lagi nanti.'
    }
    return apiMessages[error.message] ?? error.message
  }

  if (error instanceof TypeError) {
    return 'Tidak dapat terhubung ke server. Pastikan backend berjalan.'
  }

  if (error instanceof Error && error.message) return error.message

  return 'Terjadi kesalahan. Coba lagi.'
}

export function authErrorMessage(error: unknown): string {
  if (error instanceof AuthFlowError) return error.message
  if (error instanceof FirebaseError) {
    return firebaseMessages[error.code] ?? apiErrorMessage(error)
  }
  return apiErrorMessage(error)
}
