import { Wrapper, Holder, Text, GradientText } from './styles';

export default function Banner() {
  return (
    <Wrapper>
      <Holder>
        <Text>
          Tari Mainnet <GradientText>is live</GradientText>
        </Text>
      </Holder>
    </Wrapper>
  );
}
