import { toHexString } from '@utils/helpers';

const kernelSearch = (
  nonce: string,
  signature: string,
  kernels: unknown[]
): number | null => {
  if (!kernels) return null;
  const normalizedNonce = nonce.trim().toLowerCase();
  const normalizedSignature = signature.trim().toLowerCase();

  const foundIndex = kernels.findIndex((kernel) => {
    const k = kernel as Record<string, unknown> | null | undefined;
    const excess_sig = k?.excess_sig as Record<string, unknown> | null | undefined;
    const public_nonce = excess_sig?.public_nonce as Record<string, unknown> | null | undefined;
    const sig = excess_sig?.signature as Record<string, unknown> | null | undefined;

    const kernelNonce = String(toHexString(public_nonce?.data as number[])).toLowerCase();
    const kernelSignature = String(toHexString(sig?.data as number[])).toLowerCase();

    // Match if either field is provided and matches
    const nonceMatch = normalizedNonce ? kernelNonce.includes(normalizedNonce) : false;
    const signatureMatch = normalizedSignature
      ? kernelSignature.includes(normalizedSignature)
      : false;

    // If both fields are provided, require both to match; if only one, require that one
    if (normalizedNonce && normalizedSignature) {
      return nonceMatch && signatureMatch;
    }
    if (normalizedNonce) {
      return nonceMatch;
    }
    if (normalizedSignature) {
      return signatureMatch;
    }
    return false;
  });

  return foundIndex !== -1 ? foundIndex : null;
};

const payrefSearch = (payref: string, outputs: unknown[]): number | null => {
  if (!outputs) return null;
  payref = payref.trim().toLowerCase();

  const foundIndex = outputs.findIndex((output) => {
    const o = output as Record<string, unknown> | null | undefined;
    const payment_reference = o?.payment_reference as Record<string, unknown> | null | undefined;
    const paymentRefHex = String(toHexString(payment_reference?.data as number[])).toLowerCase();
    const payrefMatch = payref ? paymentRefHex === payref : false;
    if (payref) {
      return payrefMatch;
    }
    return false;
  });

  return foundIndex !== -1 ? foundIndex : null;
};

const commitmentSearch = (commitment: string, outputs: unknown[]): number | null => {
  if (!outputs) return null;
  commitment = commitment.trim().toLowerCase();

  const foundIndex = outputs.findIndex((output) => {
    const o = output as Record<string, unknown> | null | undefined;
    const commitmentData = o?.commitment as Record<string, unknown> | null | undefined;
    const commitmentHex = String(toHexString(commitmentData?.data as number[])).toLowerCase();
    const commitmentMatch = commitment ? commitmentHex === commitment : false;
    if (commitment) {
      return commitmentMatch;
    }
    return false;
  });

  return foundIndex !== -1 ? foundIndex : null;
};

export { kernelSearch, payrefSearch, commitmentSearch };
