import { useState, useEffect } from 'react';
import { GradientPaper } from '@components/StyledComponents';
import { Grid, TextField, Button, Box } from '@mui/material';
import { useSearchByKernel } from '@services/api/hooks/useBlocks';
import FetchStatusCheck from '@components/FetchStatusCheck';
import BlockTable from '@components/KernelSearch/BlockTable';

function KernelSearchFormPage() {
  const [nonce, setNonce] = useState('');
  const [signature, setSignature] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const nonces = submitted && nonce ? [nonce] : [];
  const signatures = submitted && signature ? [signature] : [];

  const { data, isLoading, isError, error } = useSearchByKernel(
    nonces,
    signatures
  );

  useEffect(() => {
    if (data?.items.length === 1) {
      const blockHeight = data.items[0].block.header.height;
      window.location.replace(
        `/blocks/${blockHeight}?nonce=${nonce}&signature=${signature}`
      );
    }
  }, [data, nonce, signature]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Grid item xs={12} md={12} lg={12}>
      <GradientPaper>
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
          <TextField
            label="Nonce"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            label="Signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Search
          </Button>
        </Box>
        {submitted && (
          <FetchStatusCheck
            isError={isError}
            isLoading={isLoading}
            errorMessage={error?.message || 'Error retrieving data'}
          />
        )}
        {submitted && !isLoading && !isError && (
          <BlockTable data={data?.items || []} />
        )}
      </GradientPaper>
    </Grid>
  );
}

export default KernelSearchFormPage;
