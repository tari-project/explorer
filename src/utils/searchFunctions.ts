import { toHexString } from '@utils/helpers';

const kernelSearch = (
  nonce: string,
  signature: string,
  kernels: any[]
): number | null => {
  if (!kernels) return null;

  const foundIndex = kernels.findIndex((kernel) => {
    const kernelNonce = toHexString(kernel.excess_sig.public_nonce.data);
    const kernelSignature = toHexString(kernel.excess_sig.signature.data);

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

const payrefSearch = (payref: string, outputs: any[]): number | null => {
  if (!outputs) return null;
  payref = payref.toLowerCase();

  const foundIndex = outputs.findIndex((output) => {
    const payment_reference = toHexString(output.payment_reference.data);
    const payrefMatch = payref ? payment_reference === payref : false;
    if (payref) {
      return payrefMatch;
    }
    return false;
  });

  return foundIndex !== -1 ? foundIndex : null;
};

export { kernelSearch, payrefSearch };
