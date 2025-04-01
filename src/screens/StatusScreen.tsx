import React from "react";
import { Text, View } from "react-native";
import { BottomNavigator } from "../components/BottomNavigator";

export function StatusScreen() {
    return(
        <View className="flex-1">
            <Text>
                Status
            </Text>
            <BottomNavigator/>
        </View>
    )
}