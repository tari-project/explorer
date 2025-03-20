import { useState } from 'react';
import TariLogo from '../../../assets/TariLogo';
import { useTheme } from '@mui/material/styles';
import { Divider, Fade, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import StatsDialog from './StatsDialog';
import SearchField from './SearchField';
import {
  StyledContainer,
  LogoBox,
  MobileBox,
  LogoBoxMobile,
} from './HeaderTop.styles';
import MinersCTA from './MinersCTA';

function HeaderTop() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isMobile ? (
        <StyledContainer>
          {!isExpanded && (
            <Fade in={!isExpanded}>
              <Link to="/">
                <LogoBoxMobile>
                  <TariLogo fill={theme.palette.text.primary} />
                </LogoBoxMobile>
              </Link>
            </Fade>
          )}
          <MobileBox>
            <Box
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <SearchField
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
              />
            </Box>
            <StatsDialog />
          </MobileBox>
        </StyledContainer>
      ) : (
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
      )}
    </>
  );
}

export default HeaderTop;
