import React, { useContext, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.js";

import { useRoute } from '@react-navigation/native';
import { LatLng } from 'react-native-maps';
import { Banner, Button, Card, Divider, Text, TextInput } from 'react-native-paper';
import { Tag, TagDetails } from "../components/FoodData";
import { FoodDataContext } from "../components/FoodDataContext";

const PostScreen = ({ navigation }) => {
  const route = useRoute();
  const { setSnackbar, userLocation, requestUserLocation, refreshData } = useContext(FoodDataContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LatLng>(null);
  const [tags, setTags] = useState([]);

  const [posting, setPosting] = useState<boolean>(false);

  // Receive location from select screen
  useEffect(() => {
    const location = route.params?.['location'];
    if (location) {
      setLocation(location);
    }
  }, [route.params]);

  const handlePostSubmit = () => {
    setPosting(true);
    let body = {
      title, description, location, tags
    };
    console.log(body);
    addDoc(collection(db, 'Posts'), body).then((response) => {
      setSnackbar("Post added!");
      refreshData().then(() => {
        // Navigate back to FoodScreen
        navigation.navigate("FoodScreen");
      });
    }).catch(error => {
      console.error("Failed to create food post", error);
      setSnackbar(String(error));
    }).finally(() => {
      setPosting(false);
    });
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag)); // Remove tag
    } else {
      setSnackbar(`Added ${tag}\n\n${TagDetails[tag].description}`);
      setTags([...tags, tag]); // Add tag
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ padding: 16, paddingBottom: 0 }}>
          {/* Title / Description */}
          <Card style={styles.section}>
            <Card.Content>
              <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>What's free?</Text>
              <TextInput
                style={{ marginBottom: 4 }}
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
                maxLength={300}
                placeholder="One free donut with a student ID"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor="#888"
              />
            </Card.Content>
          </Card>
          {/* Begin location section. Pick a point on the map */}
          <View style={[{ paddingBottom: 12 }]}>
            {/* Choose a location on the map instead */}
            {!userLocation && <Button onPress={requestUserLocation} style={{ paddingBottom: 4 }} icon="near-me" mode='text'>
              Enable Location Services
            </Button>}
            <Button disabled={!userLocation} onPress={() => navigation.navigate("MapSelectScreen", { location, userLocation })} icon="map-marker" mode='outlined'>
              {location ? `${location.latitude}, ${location.longitude}` : 'Add Location'}
            </Button>
          </View>
        </View>
        {/* Scroll through tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.section} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          {/* For each tag, create a button for it */}
          {Object.values(Tag).map((value, index) => {
            {/* Include checkmark if selected */ }
            return (
              <Button key={index} textColor='white' icon={tags.includes(value) ? 'check-circle-outline' : TagDetails[value].icon} style={[styles.tag, tags.includes(value) && styles.tagSelected]} onPress={() => toggleTag(value)}>
                {/* Tag name */}
                {value}
              </Button>
            )
          })}
        </ScrollView>
        {/* Post button */}
        <View style={{ padding: 16, paddingTop: 0, gap: 16 }}>
          <Divider />
          <Button disabled={posting || !title || !description} mode='contained' onPress={handlePostSubmit}>{posting ? 'Posting...' : 'Post'}</Button>
        </View>
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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'gray',
    borderRadius: 10,
    // padding: 8,
  },
  tagSelected: {
    backgroundColor: '#6200ee',
  },
});

export default PostScreen;

