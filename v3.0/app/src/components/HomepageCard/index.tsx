import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as Icons from '@mui/icons-material';
import { PALETTE } from '../../constants';

interface HomepageCardProps {
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const StyledCard = styled(Card)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
  '&:hover': {
    backgroundColor: disabled ? undefined : PALETTE.LightBlue,
    transform: disabled ? undefined : 'translateY(-5px)',
  },
}));

const IconContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1rem',
});

const HomepageCard: React.FC<HomepageCardProps> = ({
  icon,
  title,
  description,
  disabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const IconComponent = Icons[icon as keyof typeof Icons];

  return (
    <StyledCard
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContent>
        <IconContainer>
          <IconButton disabled={disabled}>
            <IconComponent style={{ fontSize: 40, color: PALETTE.Blue }} />
          </IconButton>
        </IconContainer>
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default HomepageCard;