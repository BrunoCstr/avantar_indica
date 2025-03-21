import { TouchableOpacity } from "react-native";
import {createText} from '@shopify/restyle';
import {ThemeProps} from '../theme';
import { useNavigation } from "@react-navigation/native";

const Text = createText<ThemeProps>();

interface ButtonProps {
    navigateTo: string;
    opacity: number;
    text: string;
    backgroundColor: string;
  }

export function Button( {navigateTo, opacity, text, backgroundColor}: ButtonProps ) {
    const navigation = useNavigation()

    return(
        <TouchableOpacity 
        style={{ justifyContent:"center", alignItems:"center", backgroundColor: backgroundColor, borderRadius: 50, height: 50 }} 
        activeOpacity={opacity}
        onPress={() => navigation.navigate(navigateTo)}
        >
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}