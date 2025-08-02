declare module 'react-native-vector-icons';
declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  const IconComponent: typeof Icon;
  export default IconComponent;
}