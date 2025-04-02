import Typography from '@mui/material/Typography';
import { useAllBlocks } from '@services/api/hooks/useBlocks';
// import { toHexString, shortenString } from '../../utils/helpers';
// import CopyToClipboard from '../CopyToClipboard';
import { InnerBox } from './VersionInfo.styles';

function VersionInfo() {
  const { data } = useAllBlocks();

  return (
    <InnerBox>
      {/* <Typography variant="body2">
        <strong>TIP:</strong>
      </Typography>
      <Typography variant="body2">
        <strong>Height:</strong> {data?.tipInfo?.metadata?.best_block_height}
      </Typography>
      <Typography variant="body2">
        <strong>Best Block:</strong>{' '}
        {shortenString(
          toHexString(data?.tipInfo.metadata.best_block_hash.data)
        )}
        <CopyToClipboard
          copy={toHexString(data?.tipInfo.metadata.best_block_hash?.data)}
        />
      </Typography>
      <Typography variant="body2">
        <strong>Pruned Height:</strong> {data?.tipInfo.metadata.pruned_height}
      </Typography> */}
      <Typography variant="body2" color="GrayText">
        <strong>Version:</strong> {data?.version}
      </Typography>
    </InnerBox>
  );
}

export default VersionInfo;
