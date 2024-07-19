import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { collection, getDoc, setDoc, addDoc } from "firebase/firestore";
import {db} from "../firebase.js"


import FoodData from "../components/FoodData";

const PostScreen = () => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);

  // Extract unique tags from foodData
  const availableTags = [
    'Door Access',
    'Student ID Needed',
    'Phone Needed',
    'Entry Needed',
  ];

  const handlePostSubmit = () => {
    let posts = collection(db, 'Posts');
    console.log(posts);
    addDoc(posts, {
      tags: tags,
      description: description,
      location: location
    })
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag)); // Remove tag
    } else {
      setTags([...tags, tag]); // Add tag
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Share Free Food!</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        multiline
        numberOfLines={4}
        placeholderTextColor="#888"
      />
      <Text style={styles.subtitle}>Select Tags:</Text>
      <View style={styles.tagContainer}>
        {availableTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, tags.includes(tag) && styles.tagSelected]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={styles.tagText}>{tag}</Text>
            {tags.includes(tag) && (
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePostSubmit}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagSelected: {
    backgroundColor: '#6200ee',
  },
  tagText: {
    color: '#fff',
  },
  checkIcon: {
    marginLeft: 5,
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostScreen;

