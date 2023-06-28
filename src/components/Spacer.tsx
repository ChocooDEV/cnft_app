import React from 'react';

export const Spacer = ({ size }) => {
  const spacerStyle = {
    height: `${size}px`,
  };

  return <div style={spacerStyle} />;
};