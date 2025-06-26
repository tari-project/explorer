import { DotLoaderContainer, Dot } from './DotLoader.styles';

const DotLoader = () => (
  <DotLoaderContainer>
    <Dot />
    <Dot delay="0.2s" />
    <Dot delay="0.4s" />
  </DotLoaderContainer>
);

export default DotLoader;
