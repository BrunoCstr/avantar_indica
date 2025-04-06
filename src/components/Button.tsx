import { TouchableOpacity, Text } from "react-native";
import { colors } from "../styles/colors";

interface ButtonProps {
    text: string;
    backgroundColor: string;
    textColor?: string;
    fontWeight?: any;
    fontSize?: number;
    onPress: () => void;
    height?: number;
    width?: number;
  }

export function Button( { onPress, text, backgroundColor, textColor, fontWeight, fontSize, width, height = 50}: ButtonProps ) {

    return(
        <TouchableOpacity
        style={{ justifyContent:"center", alignItems:"center", backgroundColor: colors[backgroundColor as keyof typeof colors], borderRadius: 100, height, width}} 
        activeOpacity={0.8}
        onPress={onPress}
        >
            <Text style={{fontWeight,fontSize, color: colors[textColor as keyof typeof colors]}}>{text}</Text>
        </TouchableOpacity>
    )
}