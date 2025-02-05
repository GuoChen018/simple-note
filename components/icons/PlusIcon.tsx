import Svg, { Path } from 'react-native-svg';

export function PlusIcon({ color = '#FFFFFF', size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path fillRule="evenodd" clipRule="evenodd" d="M13 5H11V10.9993H5V12.9993H11V19H13V12.9993H19V10.9993H13V5Z" fill={color}/>
    </Svg>
  );
}