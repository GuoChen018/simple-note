import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from 'expo-font';
import { FONTS } from '@/constants/fonts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/Toast';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { NotesProvider } from '@/context/NotesContext';

// Close any existing connections and reopen
const expo = openDatabaseSync('db.db');
export const db = drizzle(expo);

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FONTS);
  
  // Run migrations
  useEffect(() => {
    const runMigrations = async () => {
      try {
        console.log('Starting migrations...');
        await db.run('PRAGMA foreign_keys = ON;');
        
        // Create table if not exists
        await db.run(`CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT,
          content TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          is_deleted INTEGER DEFAULT 0 NOT NULL,
          last_synced_at INTEGER,
          is_dirty INTEGER DEFAULT 1 NOT NULL
        );`);

        console.log('Migrations completed successfully');
      } catch (error) {
        console.error('Migration error:', error);
      }
    };

    runMigrations();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Suspense fallback={<LoadingScreen/>}>
      <SQLiteProvider databaseName="db.db" useSuspense>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <NotesProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <Toast config={toastConfig} />
            </NotesProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ActivityIndicator 
          style={{ flex: 1 }}
          size="large"
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}




