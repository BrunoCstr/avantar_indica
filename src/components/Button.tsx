import { TouchableOpacity } from "react-native";
import {createText, useTheme} from '@shopify/restyle';
import {ThemeProps} from '../styles';

const Text = createText<ThemeProps>();

interface ButtonProps {
    text: string;
    backgroundColor: keyof ThemeProps['colors'];
    onPress: () => void;
  }

export function Button( { onPress, text, backgroundColor}: ButtonProps ) {
    const theme = useTheme<ThemeProps>();

    return(
        <TouchableOpacity 
        style={{ justifyContent:"center", alignItems:"center", backgroundColor: theme.colors[backgroundColor], borderRadius: 100, height: 50 }} 
        activeOpacity={0.9}
        onPress={onPress}
        >
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}