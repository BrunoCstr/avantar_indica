import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {useNavigation} from '@react-navigation/native';

export function BackButton(props: {color?: string; borderColor?: string, onPress?: () => void}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="border-[1px] items-center justify-center rounded-md w-8 h-8"
      style={{
        borderColor: props.borderColor || colors.blue,
      }}
      activeOpacity={0.8}
      onPress={props.onPress || (() => navigation.goBack())}>
      <Ionicons
        name="chevron-back"
        size={21}
        color={props.color || colors.blue}
      />
    </TouchableOpacity>
  );
}
