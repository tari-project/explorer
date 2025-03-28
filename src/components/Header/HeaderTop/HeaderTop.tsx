import TariLogo from '../../../assets/TariLogo';
import { useTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { StyledContainer, LogoBox } from './HeaderTop.styles';
import MinersCTA from '../MinersCTA/MinersCTA';

function HeaderTop() {
  const theme = useTheme();

  return (
    <>
      <StyledContainer>
        <Link to="/">
          <LogoBox>
            <TariLogo fill={theme.palette.text.primary} />
          </LogoBox>
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
