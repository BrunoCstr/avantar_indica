import { TouchableOpacity } from "react-native";
import {createText} from '@shopify/restyle';
import {ThemeProps} from '../theme';

const Text = createText<ThemeProps>();

type Props = {
    text: string
}

export function Button( {text}: Props ) {
    return(
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.7}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}