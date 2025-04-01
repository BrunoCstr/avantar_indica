import React from "react";
import { Text, View } from "react-native";
import { BottomNavigator } from "../components/BottomNavigator";

export function ProfileScreen() {
    return(
        <View className="flex-1">
            <Text>
                Profile
            </Text>
            <BottomNavigator/>
        </View>
    )
}