import React from "react";
import { Text, View } from "react-native";
import { BottomNavigator } from "../components/BottomNavigator";

export function WalletScreen() {
    return(
        <View className="flex-1">
            <Text>
                Carteira
            </Text>
            <BottomNavigator/>
        </View>
    )
}