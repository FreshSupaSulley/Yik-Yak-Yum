import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, SafeAreaView, StyleSheet, View } from 'react-native';
import { Snackbar, Card, Text, Tooltip, Chip, useTheme } from 'react-native-paper';

import FoodData from './FoodData';
import App from "../App";

// import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Collapse, IconButton, Typography } from '@mui/material';

const timeNow = Date.now();

export type Props = {
    addMessage: (string) => void,
    data: FoodData;
};

export default function FoodPost({ addMessage, data, ...rest }: Props) {
    // Not snackbar
    const [expanded, setExpanded] = React.useState(false);
    const handlePress = () => setExpanded(!expanded);
    const theme = useTheme();
    return (
        <View style={{ margin: 8 }}>
            <Card mode="contained" style={{ backgroundColor: theme.colors.inverseOnSurface }} onPress={handlePress}>
                <Card.Title titleStyle={{ fontWeight: 'bold', paddingTop: 8 }} titleVariant="titleLarge" titleNumberOfLines={2} style={{ flex: 3 }} title={data.location} subtitle={getTimeAgo(data.date)} rightStyle={{ paddingRight: 20 }}
                    right={(props) => <Text>&lt; 3 miles</Text>} />
                {/* Show chips */}
                <Card.Content style={{ paddingTop: 8, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    {data.transportation && <Chip onPress={() => addMessage("Hi")} icon="car">Off-Campus</Chip>}
                    {data.phoneNeeded && <Chip icon="cellphone">Need Phone</Chip>}
                    {data.doorAccess && <Chip icon="door-sliding-lock">Entry Needed</Chip>}
                </Card.Content>
                {/* Body */}
                <Card.Content style={{ paddingTop: 8 }}>
                    <Text variant="bodyLarge">{data.details}</Text>
                </Card.Content>
            </Card>
        </View>
    );
}

const getTimeAgo = (date) => {
    const now = new Date();
    const elapsed = now.getTime() - new Date(date).getTime();

    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(elapsed / 3600000);
    const days = Math.floor(elapsed / 86400000);
    const weeks = Math.floor(elapsed / 604800000);
    const months = Math.floor(elapsed / 2629800000);
    const years = Math.floor(elapsed / 31557600000);

    if (minutes < 1) {
        return 'just now';
    } else if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (days < 7) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (weeks < 4) {
        return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else if (months < 12) {
        return `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
        return `${years} year${years === 1 ? '' : 's'} ago`;
    }
};
