import React from "react";
import { Text, View } from "react-native";
import { BottomNavigator } from "../components/BottomNavigator";
import { Button } from "../components/Button";
import { useAuth } from "../contexts/Auth";

export function ProfileScreen() {
    const { signOut } = useAuth()

    return(
        <View className="flex-1 bg-black">
            <Text>
                Profile
            </Text>
            <Button
            text="SAIR"
            backgroundColor="red"
            textColor="white"
            onPress={() => signOut()}
            />
        </View>
    )
}