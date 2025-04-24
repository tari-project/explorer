import { Wrapper, Holder, Text, GradientText } from './styles';

export default function Banner() {
  return (
    <Wrapper>
      <Holder>
        <Text>
          Tari is in Testnet.{' '}
          <GradientText>Mainnet launches in May 2025!</GradientText>
        </Text>
      </Holder>
    </Wrapper>
  );
}
