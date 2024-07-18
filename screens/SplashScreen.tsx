import React from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';

const SplashScreen = () => {
    // Return loading screen while we wait
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Spoiling JJK...</Text>
        <ActivityIndicator animating={true} />
    </SafeAreaView>
}

export default SplashScreen;
