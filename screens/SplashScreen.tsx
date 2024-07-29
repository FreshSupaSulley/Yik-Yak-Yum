import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, SafeAreaView, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { FoodDataContext } from '../components/FoodDataContext';
import { useRoute } from '@react-navigation/native';

// Return loading screen while we wait
const SplashScreen = () => {
    const { refreshData } = useContext(FoodDataContext);
    const [error, setError] = useState<string>('');
    const route = useRoute();

    // Receive location from select screen
    useEffect(() => {
        const error = route.params?.['error'];
        if (error) {
            setError(error);
        }
    }, [route.params]);

    return (
        <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {error &&
                <View style={{ margin: 10, gap: 20 }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant="headlineMedium">Failed to load</Text>
                    <Card>
                        <Card.Content>
                            <Text variant="titleMedium">{error}</Text>
                        </Card.Content>
                    </Card>
                    <Button style={{ alignSelf: 'center' }} icon="refresh" mode="contained-tonal" onPress={() => {
                        setError('');
                        refreshData();
                    }}>Try Again</Button>
                </View>
            }
            <ActivityIndicator animating={!error} />
        </SafeAreaView>
    )
}

export default SplashScreen;
