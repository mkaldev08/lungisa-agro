import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type LocationSearchBarProps = {
  searchText: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  isSearching: boolean;
};

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  searchText,
  onChangeText,
  onSearch,
  isSearching,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Pesquisar local (ex: Luanda, Huambo...)"
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          editable={!isSearching}
        />
        {searchText.length > 0 && !isSearching && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText('')}
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
        onPress={onSearch}
        disabled={isSearching}
      >
        {isSearching ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: '#166534',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
});
