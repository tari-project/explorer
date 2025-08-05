import { toHexString } from '@utils/helpers';

const kernelSearch = (
  nonce: string,
  signature: string,
  kernels: unknown[]
): number | null => {
  if (!kernels) return null;

  const foundIndex = kernels.findIndex((kernel) => {
    const k = kernel as Record<string, unknown>;
    const excess_sig = k.excess_sig as Record<string, unknown>;
    const public_nonce = excess_sig.public_nonce as Record<string, unknown>;
    const sig = excess_sig.signature as Record<string, unknown>;
    
    const kernelNonce = toHexString(public_nonce.data as number[]);
    const kernelSignature = toHexString(sig.data as number[]);

    // Match if either field is provided and matches
    const nonceMatch = nonce ? kernelNonce.includes(nonce) : false;
    const signatureMatch = signature
      ? kernelSignature.includes(signature)
      : false;

    // If both fields are provided, require both to match; if only one, require that one
    if (nonce && signature) {
      return nonceMatch && signatureMatch;
    }
    if (nonce) {
      return nonceMatch;
    }
    if (signature) {
      return signatureMatch;
    }
    return false;
  });

  return foundIndex !== -1 ? foundIndex : null;
};

const payrefSearch = (payref: string, outputs: unknown[]): number | null => {
  if (!outputs) return null;
  payref = payref.toLowerCase();

  const foundIndex = outputs.findIndex((output) => {
    const o = output as Record<string, unknown>;
    const payment_reference = o.payment_reference as Record<string, unknown>;
    const paymentRefHex = toHexString(payment_reference.data as number[]);
    const payrefMatch = payref ? paymentRefHex === payref : false;
    if (payref) {
      return payrefMatch;
    }
    return false;
  });

  return foundIndex !== -1 ? foundIndex : null;
};

export { kernelSearch, payrefSearch };
