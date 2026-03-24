// WebAuthn biometric registration & authentication
// Stores up to 2 credential IDs per user in Supabase (tabla usuarios, columna biometric_credentials)

import { supabase } from './supabase'

export interface BiometricCredential {
  id: string          // base64url credential id
  deviceName: string  // e.g. "iPhone de Felipe", "MacBook"
  createdAt: string   // ISO date
}

// ── HELPERS ────────────────────────────────────────────────────

function bufToBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64ToBuf(b64: string): Uint8Array {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    b64.length + (4 - b64.length % 4) % 4, '='
  )
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0))
}

export function isBiometricSupported(): boolean {
  return typeof window !== 'undefined' &&
    !!window.PublicKeyCredential &&
    typeof navigator.credentials?.create === 'function'
}

// Detect approximate device name
export function getDeviceName(): string {
  const ua = navigator.userAgent
  if (/iPhone/.test(ua)) return 'iPhone'
  if (/iPad/.test(ua)) return 'iPad'
  if (/Android/.test(ua)) return 'Android'
  if (/Mac/.test(ua)) return 'Mac'
  if (/Windows/.test(ua)) return 'Windows PC'
  return 'Dispositivo'
}

// ── SUPABASE CRUD ──────────────────────────────────────────────

export async function getCredentials(userId: string): Promise<BiometricCredential[]> {
  const { data } = await supabase
    .from('usuarios')
    .select('biometric_credentials')
    .eq('id', userId)
    .single()
  if (!data?.biometric_credentials) return []
  try {
    return JSON.parse(data.biometric_credentials) as BiometricCredential[]
  } catch {
    return []
  }
}

async function saveCredentials(userId: string, creds: BiometricCredential[]): Promise<void> {
  const { error } = await supabase
    .from('usuarios')
    .update({ biometric_credentials: JSON.stringify(creds) })
    .eq('id', userId)
  if (error) throw error
}

// ── REGISTRATION ───────────────────────────────────────────────

export async function registerBiometric(
  userId: string,
  userName: string,
  deviceName: string
): Promise<BiometricCredential> {
  const challenge = crypto.getRandomValues(new Uint8Array(32))

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'CMMX CRM', id: window.location.hostname },
      user: {
        id: new TextEncoder().encode(userId),
        name: userName,
        displayName: userName,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },   // ES256
        { type: 'public-key', alg: -257 },  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'none',
    },
  }) as PublicKeyCredential

  const credId = bufToBase64(credential.rawId)
  const existing = await getCredentials(userId)

  if (existing.length >= 2) {
    throw new Error('Ya tienes 2 dispositivos registrados. Elimina uno antes de agregar otro.')
  }

  const newCred: BiometricCredential = {
    id: credId,
    deviceName,
    createdAt: new Date().toISOString(),
  }

  await saveCredentials(userId, [...existing, newCred])
  return newCred
}

// ── AUTHENTICATION ─────────────────────────────────────────────

export async function authenticateWithBiometric(
  userId: string
): Promise<boolean> {
  const creds = await getCredentials(userId)
  if (creds.length === 0) return false

  const challenge = crypto.getRandomValues(new Uint8Array(32))

  try {
    await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: creds.map(c => ({
          type: 'public-key' as const,
          id: base64ToBuf(c.id).buffer as ArrayBuffer,
          transports: ['internal'] as AuthenticatorTransport[],
        })),
        userVerification: 'required',
        timeout: 60000,
      },
    })
    return true
  } catch {
    return false
  }
}

// ── DELETE ─────────────────────────────────────────────────────

export async function removeCredential(userId: string, credId: string): Promise<void> {
  const existing = await getCredentials(userId)
  await saveCredentials(userId, existing.filter(c => c.id !== credId))
}

// ── DEVICE ALREADY REGISTERED CHECK ───────────────────────────
// We can't directly check if THIS device is registered without calling get(),
// so we store a localStorage flag per user+device after a successful registration.

const BIOMETRIC_FLAG_KEY = (userId: string) => `cmmx_bio_registered_${userId}`

export function isDeviceRegisteredLocally(userId: string): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(BIOMETRIC_FLAG_KEY(userId)) === '1'
}

export function markDeviceRegisteredLocally(userId: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(BIOMETRIC_FLAG_KEY(userId), '1')
}
