import React from "react";
import { View } from 'react-native';
import { Card, Chip, MD3Theme, Text } from 'react-native-paper';

import FoodData from './FoodData';

type Props = {
    addMessage: (string) => void,
    onPress: () => void,
    data: FoodData;
    theme: MD3Theme;
};

interface State {
    expanded: boolean;
    fancyDate: string;
}

class FoodPost extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            expanded: false,
            fancyDate: getTimeAgo(props.data.date)
        };
    }
    // handlePress = () => {
    //     console.log("pressed lol");
    //     // this.setState(prevState => ({ expanded: !prevState.expanded }));
    // }
    render() {
        const { addMessage, data, theme, ...rest } = this.props;
        const { fancyDate } = this.state;
        return (
            <View style={{ margin: 8 }}>
                <Card mode="contained" style={{ backgroundColor: theme.colors.inverseOnSurface }} onPress={this.props.onPress}>
                    <Card.Title titleStyle={{ fontWeight: 'bold', paddingTop: 8 }} titleVariant="titleLarge" titleNumberOfLines={2} title={data.location} subtitle={fancyDate} rightStyle={{ paddingRight: 20 }}
                        right={(props) => <Text>&lt; 3 miles</Text>} />
                    {/* Show chips */}
                    <Card.Content style={{ paddingTop: 8, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                        {data.tags.map((tag, key) => (
                            <Chip compact key={key} onPress={() => addMessage("This item requires you to leave campus or use transportation")} icon={tag.icon}>{tag.name}</Chip>
                        ))}
                    </Card.Content>
                    {/* Body */}
                    <Card.Content style={{ paddingTop: 8 }}>
                        <Text variant="bodyLarge">{data.details}</Text>
                    </Card.Content>
                </Card>
            </View>
        );
    }
    // Fired at least once per minute to update the subtitle
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        // Check if we need to update fancyDate (if it's been a minute)
        const newFancyDate = getTimeAgo(this.props.data.date);
        if (this.state.fancyDate != newFancyDate) {
            console.log("Updating");
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
