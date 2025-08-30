import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
`;

const Circle = styled(motion.span)`
  width: 15px;
  height: 15px;
  background-color: #72AFED;
  border-radius: 50%;
  display: inline-block;
  margin: 0 5px;
`;

const containerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const circleVariants = {
  start: {
    y: '0%',
  },
  end: {
    y: '100%',
  },
};

const circleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: 'easeInOut',
};

const Loading: React.FC = () => {
  return (
    <LoadingContainer
      variants={containerVariants}
      initial="start"
      animate="end"
    >
      <Box mb={2}>
        <motion.div variants={containerVariants}>
          <Circle variants={circleVariants} transition={circleTransition} />
          <Circle variants={circleVariants} transition={circleTransition} />
          <Circle variants={circleVariants} transition={circleTransition} />
        </motion.div>
      </Box>
      <Typography variant="h6" color="textSecondary">
        Loading...
      </Typography>
    </LoadingContainer>
  );
};

export default Loading;
