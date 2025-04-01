import { TouchableOpacity, Text } from "react-native";
import { colors } from "../styles/colors";

interface ButtonProps {
    text: string;
    backgroundColor: string;
    textColor?: string;
    fontWeight?: any;
    fontSize?: number;
    onPress: () => void;
  }

export function Button( { onPress, text, backgroundColor, textColor, fontWeight, fontSize}: ButtonProps ) {

    return(
        <TouchableOpacity
        style={{ justifyContent:"center", alignItems:"center", backgroundColor: colors[backgroundColor as keyof typeof colors], borderRadius: 100, height: 50 }} 
        activeOpacity={0.8}
        onPress={onPress}
        >
            <Text style={{fontWeight,fontSize, color: colors[textColor as keyof typeof colors]}}>{text}</Text>
        </TouchableOpacity>
    )
}