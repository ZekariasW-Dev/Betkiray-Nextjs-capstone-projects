'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const HASH_ITERATIONS = 120_000;

const initialUsers = [
  {
    id: 'demo-landlord',
    name: 'Demo Landlord',
    email: 'landlord@test.com',
    role: 'landlord',
    passwordSalt: 'betkiray-demo-landlord-v1',
    passwordHash: '46d48b0aaab1e8a1c483d767b6fb4ee1ac22a66f73f70d8b265916557878bc9a'
  },
  {
    id: 'demo-tenant',
    name: 'Demo Tenant',
    email: 'tenant@test.com',
    role: 'tenant',
    passwordSalt: 'betkiray-demo-tenant-v1',
    passwordHash: '1e41fad8a7f2d87df99ca9b43d688d737289adc2932c7fe494a266da374926ca'
  }
];

function saltBytes(hex) {
  if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) return new TextEncoder().encode(hex);
  return Uint8Array.from(hex.match(/.{2}/g), byte => Number.parseInt(byte, 16));
}

function bytesToHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const result = await globalThis.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: saltBytes(salt),
    iterations: HASH_ITERATIONS,
    hash: 'SHA-256'
  }, key, 256);

  return bytesToHex(new Uint8Array(result));
}

function publicUser(user) {
  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

function validateCredentials(email, password) {
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    throw new Error('Enter your email address and password.');
  }
}

export const useAuthStore = create(persist((set, get) => ({
  currentUser: null,
  allUsers: initialUsers,
  isAuthenticated: false,
  hasHydrated: false,

  setHasHydrated: hasHydrated => set({ hasHydrated }),

  async login(email, password) {
    validateCredentials(email, password);
    const user = get().allUsers.find(account => account.email === email.trim().toLowerCase());
    if (!user || await hashPassword(password, user.passwordSalt) !== user.passwordHash) {
      throw new Error('The email or password is incorrect.');
    }

    const currentUser = publicUser(user);
    set({ currentUser, isAuthenticated: true });
    return currentUser;
  },

  async register(name, email, password, role) {
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (cleanName.length < 2) throw new Error('Enter a name with at least 2 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Enter a valid email address.');
    if (typeof password !== 'string' || password.length < 8) throw new Error('Use a password with at least 8 characters.');
    if (role !== 'landlord' && role !== 'tenant') throw new Error('Choose landlord or tenant to continue.');
    if (get().allUsers.some(user => user.email === cleanEmail)) throw new Error('An account with this email already exists.');

    const salt = bytesToHex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
    const user = {
      id: globalThis.crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      role,
      passwordSalt: salt,
      passwordHash: await hashPassword(password, salt)
    };
    const currentUser = publicUser(user);
    set(state => ({
      allUsers: [...state.allUsers, user],
      currentUser,
      isAuthenticated: true
    }));
    return currentUser;
  },

  logout() {
    set({ currentUser: null, isAuthenticated: false });
  }
}), {
  name: 'betkiray-local-auth',
  storage: createJSONStorage(() => localStorage),
  skipHydration: true,
  partialize: state => ({
    currentUser: state.currentUser,
    allUsers: state.allUsers,
    isAuthenticated: state.isAuthenticated
  }),
  onRehydrateStorage: () => (state, error) => {
    if (error) console.error('Unable to restore the local demo auth state.', error);
    state?.setHasHydrated(true);
  }
}));
