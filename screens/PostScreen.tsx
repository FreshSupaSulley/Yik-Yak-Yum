import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { collection, getDoc, setDoc, addDoc } from "firebase/firestore";
import {db} from "../firebase.js"


import FoodData from "../components/FoodData";

const PostScreen = () => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const handlePostSubmit = () => {
    let posts = collection(db, 'Posts');
    console.log(posts);
    addDoc(posts, {
      tags: tags,
      description: description,
      location: location
    })
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
      <View style={styles.tagContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="Add a tag (e.g. Off-Campus)"
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={addTag}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
          <Text style={styles.addTagButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tags}>
        {tags.map((tag, index) => (
          <TouchableOpacity key={index} style={styles.tag} onPress={() => removeTag(tag)}>
            <Text style={styles.tagText}>{tag}</Text>
            <Ionicons name="close-circle" size={16} color="#fff" />
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
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tagInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addTagButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addTagButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 5,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: '#fff',
    marginRight: 5,
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostScreen;


