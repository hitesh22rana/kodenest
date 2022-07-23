import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {

  return (
    <Box sx={{ position:'absolute', top:'0%' , display: 'flex' , height: '100vh' , width: '100vw' }}>
      <CircularProgress sx={{margin:'auto'}} size='10vh' style={{color:'#0077ff'}} />
    </Box>
  );
}