import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { StyledContainer } from './HeaderTop.styles';
import MinersCTA from '../MinersCTA/MinersCTA';
import Logo from '../../../assets/images/tari-logo.svg';

function HeaderTop() {
  return (
    <>
      <StyledContainer>
        <Link to="/">
          <img src={Logo} alt="Tari Logo" />
        </Link>
        <MinersCTA
          theme="dark"
          buttonText="Download Tari Universe"
          noBackground={false}
        />
      </StyledContainer>
      <Divider />
    </>
  );
}

export default HeaderTop;
