import { TouchableOpacity, Text } from "react-native";
import { colors } from "../styles/colors";

interface ButtonProps {
    text: string;
    backgroundColor: string;
    onPress: () => void;
  }

export function Button( { onPress, text, backgroundColor}: ButtonProps ) {

    return(
        <TouchableOpacity 
        style={{ justifyContent:"center", alignItems:"center", backgroundColor: colors[backgroundColor as keyof typeof colors], borderRadius: 100, height: 50 }} 
        activeOpacity={0.9}
        onPress={onPress}
        >
            <Text style={{color: "white"}}>{text}</Text>
        </TouchableOpacity>
    )
}