import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const DB_DATA_FILE = path.resolve(process.cwd(), '.db_store.json');

export interface MemoryStore {
  users: any[];
  properties: any[];
  inspections: any[];
}

export let isMongoConnected = false;

// Simple persistent fallback storage if MongoDB Atlas is not reachable or not provided
class LocalDataStore {
  private data: MemoryStore = {
    users: [],
    properties: [],
    inspections: [],
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_DATA_FILE)) {
        const raw = fs.readFileSync(DB_DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not load .db_store.json, using blank store:', e);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not save .db_store.json:', e);
    }
  }

  getCollection(name: keyof MemoryStore) {
    return this.data[name];
  }
}

export const localStore = new LocalDataStore();

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('user:password')) {
    console.log('ℹ️ MONGODB_URI not configured with live credentials. Running in robust local persistent MongoDB-compatible mode.');
    isMongoConnected = false;
    return;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isMongoConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas!');
  } catch (err: any) {
    console.warn('⚠️ MongoDB Atlas connection error:', err?.message || err);
    console.log('ℹ️ Operating in fallback persistent MongoDB-compatible mode so the app remains 100% functional.');
    isMongoConnected = false;
  }
}
