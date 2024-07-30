import React, { useContext } from "react";
import { View } from 'react-native';
import { Button, Card, Chip, Icon, IconButton, MD3Theme, Text } from 'react-native-paper';

import FoodData, { Tag, TagDetails } from './FoodData';
import { FoodDataContext } from "./FoodDataContext";
import { LatLng } from "react-native-maps";

type Props = {
    onPress: () => void,
    data: FoodData;
    theme: MD3Theme;
};

interface State {
    expanded: boolean;
    location: LatLng | null;
    fancyDate: string;
}

class FoodPost extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            expanded: false,
            location: props.data.location,
            fancyDate: getTimeAgo(props.data.date)
        };
    }
    // handlePress = () => {
    //     console.log("pressed lol");
    //     // this.setState(prevState => ({ expanded: !prevState.expanded }));
    // }
    render() {
        const { data, theme, ...rest } = this.props;
        const { location, fancyDate } = this.state;
        const getDistance = ((lat1: number, lon1: number, lat2: number, lon2: number) => {
            // distance between latitudes
            // and longitudes
            let dLat = (lat2 - lat1) * Math.PI / 180.0;
            let dLon = (lon2 - lon1) * Math.PI / 180.0;
            // convert to radiansa
            lat1 = (lat1) * Math.PI / 180.0;
            lat2 = (lat2) * Math.PI / 180.0;
            // apply formulae
            let a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) *
                Math.cos(lat1) *
                Math.cos(lat2);
            let rad = 3961;
            let c = 2 * Math.asin(Math.sqrt(a));
            return rad * c;
        });
        function calculateDistance(userLocation: LatLng) {
            let distance = getDistance(location.latitude, location.longitude, userLocation.latitude, userLocation.longitude);
            // Don't include decimals if ≥ 10. Use a single decimal for closer posts. Distance of 0 shouldn't show the extra decimal point
            let trimmed = distance >= 10 ? Math.floor(distance) : distance == 0 ? 0 : distance.toFixed(1);
            return `${trimmed} mile${trimmed == 1 ? '' : 's'}`;
        }
        function ratePressed() {
            console.log('prompt to login');
        }
        return (
            <FoodDataContext.Consumer>
                {({ userLocation, setSnackbar }) => (
                    <View style={{ margin: 8 }}>
                        <Card mode="contained" style={{ backgroundColor: theme.colors.inverseOnSurface }}>
                            {/* If we have a user location and this post has an attached location to it */}
                            <Card.Title titleStyle={{ fontWeight: 'bold', paddingTop: 8 }} titleVariant="titleLarge" titleNumberOfLines={2} title={data.title} subtitle={fancyDate} rightStyle={{ paddingRight: 20 }}
                                right={(props) => (userLocation && location) && <Text>{calculateDistance(userLocation)}</Text>} />
                            {/* Show chips */}
                            <Card.Content style={{ paddingTop: 8, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                {data.tags.map((tag, key) => (
                                    <Chip compact key={key} onPress={() => setSnackbar(TagDetails[tag].description)} icon={TagDetails[tag].icon}>{TagDetails[tag].name}</Chip>
                                ))}
                            </Card.Content>
                            {/* Body */}
                            <Card.Content style={{ paddingTop: 8 }}>
                                <Text variant="bodyLarge">{data.details}</Text>
                            </Card.Content>
                            {/* Actions */}
                            <Card.Actions>
                                {/* Left */}
                                <View style={{ marginRight: 'auto', flexDirection: 'row' }}>
                                    <Button onPress={ratePressed} icon="thumbs-up-down">+1</Button>
                                </View>
                                {/* Right */}
                                <View style={{ flexDirection: 'row' }}>
                                    <Button mode="contained" onPress={this.props.onPress}>Map</Button>
                                </View>
                            </Card.Actions>
                        </Card>
                    </View>
                )}
            </FoodDataContext.Consumer>
        );
    }
    // Fired at least once per minute to update the subtitle
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        // Check if we need to update fancyDate (if it's been a minute)
        const newFancyDate = getTimeAgo(this.props.data.date);
        if (this.state.fancyDate != newFancyDate) {
            this.setState({ fancyDate: newFancyDate });
            return true;
        }
        return false;
    }
}

// This is supposed to help with performance
export default FoodPost;

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
