import * as React from 'react';
import { IconButton, Typography, Backdrop, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMainStore } from '@services/stores/useMainStore';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '@theme/themes';
import EmojiLogo from '@assets/images/emoji-logo.png';
import { ImageWrapper, Modal, Wrapper } from './DownloadModal.styles';
import OSButton from './OSButton';

function DownloadModal() {
  const showDownloadModal = useMainStore((state) => state.showDownloadModal);
  const setShowDownloadModal = useMainStore(
    (state) => state.setShowDownloadModal
  );

  const handleClose = () => {
    setShowDownloadModal(false);
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={lightTheme}>
        <Backdrop
          sx={{ zIndex: 10 }}
          open={showDownloadModal}
          onClick={handleClose}
        >
          <Modal>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
            <Wrapper>
              <ImageWrapper>
                <img src={EmojiLogo} alt="Tari Logo" />
              </ImageWrapper>
              <Typography
                variant="h1"
                sx={{
                  textTransform: 'uppercase',
                  fontSize: '100px',
                  textAlign: 'center',
                  lineHeight: '90px',
                }}
              >
                Your download
                <br />
                has started
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '18px',
                }}
              >
                Facing trouble? Here are your download links.
              </Typography>
              <Stack spacing={2} direction="row" mt={2}>
                <OSButton os="Mac" />
                <OSButton os="Windows" />
                <OSButton os="Linux" />
              </Stack>
            </Wrapper>
          </Modal>
        </Backdrop>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default DownloadModal;
