import Container from '@mui/material/Container';
import {
  StyledContainer,
  StyledTitle,
  StyledSubTitle,
} from './HeaderTitle.styles';

interface HeaderTitleProps {
  title: string;
  subTitle?: string;
}

function HeaderTitle({ title, subTitle }: HeaderTitleProps) {
  return (
    <>
      <Container maxWidth="xl">
        <StyledContainer>
          <StyledTitle variant="h1">{title}</StyledTitle>
          <StyledSubTitle variant="body2">{subTitle}</StyledSubTitle>
        </StyledContainer>
      </Container>
    </>
  );
}

export default HeaderTitle;
