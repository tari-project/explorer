import { useState } from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { useAllBlocks } from '../../../services/api/hooks/useBlocks';
import { toHexString, shortenString } from '../../../utils/helpers';
import CopyToClipboard from '../../CopyToClipboard';
import { BootstrapDialog, StyledDialogTitle } from './StatsDialog.styles';

function StatsDialog() {
  const [open, setOpen] = useState(false);
  const { data } = useAllBlocks();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <IoAnalyticsOutline />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <StyledDialogTitle id="customized-dialog-title">
          Latest Stats
        </StyledDialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom variant="body2">
            <strong>Height:</strong>{' '}
            {data?.tipInfo?.metadata?.best_block_height}
          </Typography>
          <Typography gutterBottom variant="body2">
            <strong>Best Block:</strong>{' '}
            {shortenString(
              toHexString(data?.tipInfo.metadata.best_block_hash.data)
            )}
            <CopyToClipboard
              copy={toHexString(data?.tipInfo.metadata.best_block_hash?.data)}
            />
          </Typography>
          <Typography gutterBottom variant="body2">
            <strong>Pruned Height:</strong>{' '}
            {data?.tipInfo.metadata.pruned_height}
          </Typography>
          <Typography gutterBottom variant="body2">
            <strong>Version:</strong> {data?.version}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default StatsDialog;
