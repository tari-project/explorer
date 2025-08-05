import * as React from 'react';
import { Typography, Backdrop, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMainStore } from '@services/stores/useMainStore';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '@theme/themes';
import EmojiLogo from '@assets/images/emoji-logo.png';
import {
  ImageWrapper,
  Modal,
  Wrapper,
  CloseButton,
  Header,
} from './DownloadModal.styles';
import OSButton from './OSButton';

function DownloadModal() {
  const showDownloadModal = useMainStore((state) => state.showDownloadModal);
  const setShowDownloadModal = useMainStore(
    (state) => state.setShowDownloadModal
  );
  const isLinux = useMainStore((state) => state.isLinux);

  const handleClose = () => {
    setShowDownloadModal(false);
  };

  const message = {
    linux: {
      title: 'Not available for Linux',
      description: 'Looking for a different OS? Download it below.',
    },
    default: {
      title: 'Your download has started',
      description: 'Facing trouble? Here are your download links.',
    },
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={lightTheme}>
        <Backdrop
          sx={{ zIndex: 10 }}
          open={!!showDownloadModal}
          onClick={handleClose}
        >
          <Modal>
            <CloseButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </CloseButton>
            <Wrapper>
              <ImageWrapper>
                <img src={EmojiLogo} alt="Tari Logo" />
              </ImageWrapper>
              <Header variant="h1">
                {isLinux ? message.linux.title : message.default.title}
              </Header>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '18px',
                }}
              >
                {isLinux
                  ? message.linux.description
                  : message.default.description}
              </Typography>
              <Stack spacing={2} direction="row" mt={2}>
                <OSButton os="Mac" />
                <OSButton os="Windows" />
              </Stack>
            </Wrapper>
          </Modal>
        </Backdrop>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default DownloadModal;
