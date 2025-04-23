import { motion } from 'framer-motion';
import { Box } from '@mui/material';

interface SkeletonLoaderProps {
  height?: number;
}

const SkeletonLoader = ({ height }: SkeletonLoaderProps) => {
  return (
    <Box
      component={motion.div}
      sx={{
        width: '100%',
        height: height ? `${height}px` : '100px',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    >
      <Box
        component={motion.div}
        sx={{
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(90deg, rgba(0, 0, 0, 0.01)%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.01) 75%)',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity }}
      />
    </Box>
  );
};

export default SkeletonLoader;
