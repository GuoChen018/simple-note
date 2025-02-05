import Svg, { Path } from 'react-native-svg';

export function SearchIcon({ color = '#999', size = 16 }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M6 2H14V4H6V2ZM6 16.0004H14V18.0004H6V16.0004ZM4 6.0002H2V14.0002H4L4 16H6V14H4V6.00039H6V4.00039H4L4 6.0002ZM16 6.0002H18V14.0002H16L16 16H14V14H16V6.00039H14V4.00039H16L16 6.0002ZM20 18.0002H18V20.0002H20L20 22H22V20H20L20 18.0002ZM16 16.0004H18V18.0004H16V16.0004Z" fill="#A1A1A1"/>
    </Svg>
  );
}