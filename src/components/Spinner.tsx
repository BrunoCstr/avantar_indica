import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

interface SpinnerProps {
  size?: number;
  thickness?: number;
  variant?: "purple" | "blue";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 28,
  thickness = 4,
  variant = "purple",
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => {
        if (isMounted) startRotation();
      });
    };

    startRotation();

    return () => {
      isMounted = false;
    };
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const styles = StyleSheet.create({
    spinner: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: thickness,
      borderTopColor: variant === "purple" ? "#4A04A5" : "#3E0085",
      borderRightColor: variant === "purple" ? "#C252F2" : "#29F3DF",
      borderBottomColor: variant === "purple" ? "#C252F2" : "#29F3DF",
      borderLeftColor: variant === "purple" ? "#C252F2" : "#29F3DF",
    },
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );
};
