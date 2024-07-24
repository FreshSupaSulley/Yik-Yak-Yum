import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { collection, getDoc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase.js"


import FoodData, { Tag } from "../components/FoodData";
import MapView from 'react-native-maps';
import MapScreen, { osuRegion } from './MapScreen.native';
import { Button, TextInput } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { DetailedLocation } from './MapSelectScreen.native.js';

const PostScreen = ({ navigation }) => {
  const route = useRoute();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<DetailedLocation>(null);
  const [tags, setTags] = useState([]);

  // Route doesn't become available until rendered apparently
  useEffect(() => {
    const location = route.params?.['location'];
    if (location) {
      setLocation(location);
    }
  }, [route.params?.['location']]);
  const handlePostSubmit = () => {
    let posts = collection(db, 'Posts');
    console.log(tags);
    // addDoc(posts, {
    //   tags: tags,
    //   description: description,
    //   location: location
    // });
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag)); // Remove tag
    } else {
      setTags([...tags, tag]); // Add tag
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>What's free?</Text>
        {/* Title / Description */}
        <View style={styles.section}>
          <TextInput
            label="Title *"
            mode='outlined'
            maxLength={50}
            placeholder="Free Pastry at Buckeye Donuts"
            value={title}
            onChangeText={setTitle}
            numberOfLines={1}
            placeholderTextColor="#888"
          />
          <TextInput
            label="Details *"
            mode='outlined'
            placeholder="One free donut with a student ID"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#888"
          />
        </View>
        {/* Begin location section. Pick a point on the map */}
        <View style={styles.section}>
          {/* Choose a location on the map instead */}
          <Button onPress={() => navigation.navigate("MapSelectScreen", { location })} icon="map-marker" mode={location ? 'outlined' : 'contained'}>
            {location ? location.title || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Set Location'}
          </Button>
        </View>
        <View style={styles.tagContainer}>
          {/* For each tag, create a button for it */}
          {Object.values(Tag).map((value, index) => {
            return (
              <TouchableOpacity key={index} style={[styles.tag, tags.includes(value) && styles.tagSelected]} onPress={() => toggleTag(value)}>
                {/* Tag name */}
                <Text style={styles.tagText}>{value}</Text>
                {/* Include checkmark if selected */}
                {tags.includes(value) && <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.checkIcon} />}
              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity style={styles.button} onPress={handlePostSubmit}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    // textAlign: 'center',
  },
  input: {
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

