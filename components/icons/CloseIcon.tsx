import Svg, { Path } from 'react-native-svg';

export function CloseIcon({ color = '#A1A1A1', size = 24 }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" >
<Path fillRule="evenodd" clipRule="evenodd" d="M7 3H17V5H7V3ZM5 7V5H7V7H5ZM5 17H3V7H5V17ZM7 19H5V17H7V19ZM17 19V21H7V19H17ZM19 17V19H17V17H19ZM19 7H21V17H19V7ZM19 7V5H17V7H19ZM11 9H9V11H11L11 13H9V15H11V13H13V15H15V13H13V11H15V9H13V11L11 11V9Z" fill="black"/>
</Svg>

  );
}