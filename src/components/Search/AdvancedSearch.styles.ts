import { styled } from '@mui/material/styles';
import { Box, FormControlLabel } from '@mui/material';

export const FormWrapper = styled(Box)(({}) => ({
  minHeight: '170px',
}));

export const StyledFormControlLabel = styled(FormControlLabel)`
  .MuiFormControlLabel-label {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;
