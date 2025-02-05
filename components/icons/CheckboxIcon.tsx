import Svg, { Path } from 'react-native-svg';

export function CheckboxIcon({ color = '#A1A1A1', size = 24 }) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M5 3H3V21H5V3ZM5.00002 3H19H21V21H19L19 20.9999H5.00002V18.9999H19V5H5.00002V3ZM9.00001 12H7.00001V14H9.00001V12ZM9 14.0001H11V16.0001H9V14.0001ZM13 12H11V14H13V12ZM15 10.0001H17V8.0001H15V9.9999H13V11.9999H15V10.0001Z" 
        fill="black"
      />
    </Svg>
  );
}