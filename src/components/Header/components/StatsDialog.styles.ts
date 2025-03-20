import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle } from '@mui/material';

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '24px',
  fontFamily: 'DrukHeavy',
  textTransform: 'uppercase',
  letterSpacing: '1px',
}));
