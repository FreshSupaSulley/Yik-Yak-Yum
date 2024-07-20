import React from 'react';
import { StyleSheet, ActivityIndicator, SafeAreaView, View } from 'react-native';
import { Text } from 'react-native-paper';

// Return loading screen while we wait
const SplashScreen = () => {
    return (
        <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Text variant="titleLarge">Spoiling JJK...</Text>
            <ActivityIndicator animating={true} />
        </SafeAreaView>
    )
}

export default SplashScreen;
