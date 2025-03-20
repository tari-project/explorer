import { styled } from '@mui/material/styles';
import { TextField, IconButton } from '@mui/material';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '400px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const SearchIconButton = styled(IconButton)({
  padding: 0,
  borderRadius: 40,
  background: 'none',
  height: '40px',
  width: '40px',
});

export const CloseIconButton = styled(IconButton)({
  padding: 0,
  borderRadius: 40,
  background: 'none',
});

export const ExpandIconButton = styled(IconButton)({
  borderRadius: 40,
});
