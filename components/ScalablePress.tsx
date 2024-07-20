// Adds more a press feeling to pressable objects
import { useEffect, useRef } from "react";
import { Animated, StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

interface ScalablePressProps {
    children: React.ReactNode;
    onPress: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    activeOpacity?: number,
    activeScale?: number,
    style?: StyleProp<ViewStyle>;
}

const ScalablePress: React.FC<ScalablePressProps> = ({ children, onPress, onPressIn = () => {}, onPressOut = () => {}, activeOpacity = 0.2, activeScale = 0.8, style }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    // Smooth scale when pressed and held
    function zoomIn() {
        onPressIn();
        Animated.spring(fadeAnim, {
            toValue: activeScale, useNativeDriver: true,
        }).start();
    }
    function zoomOut() {
        onPressOut();
        Animated.spring(fadeAnim, {
            toValue: 1, useNativeDriver: true,
        }).start();
    }
    // Zoom in on first render
    useEffect(() => {
        zoomOut();
    }, [fadeAnim]);
    return (
        <View style={[{ flex: 1 }, style]}>
            <TouchableOpacity activeOpacity={activeOpacity} onPressIn={zoomIn} onPressOut={zoomOut} onPress={onPress} style={{ flex: 1 }}>
                <Animated.View style={{ transform: [{ scale: fadeAnim }], flex: 1 }}>
                    {children}
                </Animated.View>
            </TouchableOpacity>
        </View>
    )
}

export default ScalablePress;