import { TouchableOpacity } from "react-native";
import {createText} from '@shopify/restyle';
import {ThemeProps} from '../theme';

const Text = createText<ThemeProps>();

interface ButtonProps {
    text: string;
    backgroundColor: string;
    onPress: () => void;
  }

export function Button( { onPress, text, backgroundColor}: ButtonProps ) {
    return(
        <TouchableOpacity 
        style={{ justifyContent:"center", alignItems:"center", backgroundColor: backgroundColor, borderRadius: 50, height: 50 }} 
        activeOpacity={0.9}
        onPress={onPress}
        >
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}