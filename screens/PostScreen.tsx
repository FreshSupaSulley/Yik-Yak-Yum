import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ImageBackground } from 'react-native';
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.js";
import { useRoute } from '@react-navigation/native';
import { LatLng } from 'react-native-maps';
import { Button, Card, Divider, Text, TextInput } from 'react-native-paper';
import { Tag, TagDetails } from "../components/FoodData";
import { FoodDataContext } from "../components/FoodDataContext";

const backgroundImage = require('../assets/red_background.jpg');

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
      title, description, location, tags,
      timestamp: Date.now()
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
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <ScrollView>
            <View style={styles.contentContainer}>
              {/* Title / Description */}
              <Card style={styles.section_card}>
                <Card.Content>
                  <Text style={styles.title}>What's free?</Text>
                  <TextInput
                    style={styles.textInput}
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
              <View style={styles.locationContainer}>
                {/* Choose a location on the map instead */}
                {!userLocation && <Button onPress={requestUserLocation} style={styles.locationButton} icon="near-me" mode='text'>
                  Enable Location Services
                </Button>}
                <Button disabled={!userLocation} onPress={() => navigation.navigate("MapSelectScreen", { location, userLocation })} icon="map-marker" mode='outlined'>
                  {location ? `${location.latitude}, ${location.longitude}` : 'Add Location'}
                </Button>
              </View>
              {/* Scroll through tags */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.section} contentContainerStyle={styles.tagContainer}>
                {/* For each tag, create a button for it */}
                {Object.values(Tag).map((value, index) => {
                  return (
                    <Button key={index} textColor='white' icon={tags.includes(value) ? 'check-circle-outline' : TagDetails[value].icon} style={[styles.tag, tags.includes(value) && styles.tagSelected]} onPress={() => toggleTag(value)}>
                      {value}
                    </Button>
                  );
                })}
              </ScrollView>
              {/* Post button */}
              <View style={styles.footer}>
                <Divider />
                <Button disabled={posting || !title || !description} mode='contained' onPress={handlePostSubmit}>{posting ? 'Posting...' : 'Post'}</Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent overlay
    padding: 16,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  section: {
    marginBottom: 30
  },
  section_card: {
    marginBottom: 30,
    borderRadius: 8,
    backgroundColor: '#d89e9a', // Lightened color for better readability
    borderColor: '#baacac', // Nobel
    borderWidth: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Darker color for better contrast
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 4,
  },
  locationContainer: {
    paddingBottom: 12,
  },
  locationButton: {
    paddingBottom: 4,
  },
  tagContainer: {
    gap: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tag: {
    backgroundColor: '#6d6e71', // Dark gray for tags
    borderRadius: 10,
  },
  tagSelected: {
    backgroundColor: '#d89e9a', // Primary color for selected tags
  },
  footer: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
});

export default PostScreen;

