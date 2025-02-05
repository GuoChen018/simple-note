import { View, TextInput, SafeAreaView, Dimensions, Pressable, Text, StyleSheet } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { useTheme } from "@/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { COLORS } from "@/constants/Theme";
import { NoteCard } from "@/components/NoteCard";
import { SearchIcon, CloseIcon, PlusIcon } from "@/components/icons";
import { useState, useRef, useEffect, useCallback } from 'react';
import { FAB } from '@/components/FAB';
import { notesService, type Note } from '@/services/notes';
import { useRouter } from 'expo-router';
import { useNotes } from '@/context/NotesContext';
import { FlashList } from '@shopify/flash-list';

const { width } = Dimensions.get('window');

export default function Index() {
  const { theme } = useTheme();
  const colors = COLORS[theme];
  const styles = useThemedStyles();
  const router = useRouter();
  const { notes, isLoading, createNote } = useNotes();

  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  // DataProvider setup
  const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(notes);

  // LayoutProvider setup
  const layoutProvider = new LayoutProvider(
    () => 0,
    (type, dim) => {
      dim.width = dimensions.width;
      dim.height = 110; // or whatever height you want for note items
    }
  );

  // Render function
  const rowRenderer = (type: any, data: any) => (
    <NoteCard 
      id={data.id} 
      title={data.title} 
      content={data.content}
    />
  );
  const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
  };

  const handleNewNote = async () => {
    try {
      const newNote = await createNote();
      router.push({
        pathname: "/note/[id]",
        params: { id: newNote.id }
      });
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <SearchIcon />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText !== '' && (
            <Pressable onPress={handleClear}>
              <CloseIcon />
            </Pressable>
          )}
        </View>
      </View>
      {notes.length > 0 ? (
        <FlashList
          data={notes}
          renderItem={({ item }) => (
            <NoteCard
              id={item.id}
              title={item.title}
              content={item.content}
            />
          )}
          estimatedItemSize={100}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notes yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create one</Text>
        </View>
      )}
      <FAB onPress={handleNewNote}>
        <PlusIcon />
      </FAB>
    </SafeAreaView>
  );
}


