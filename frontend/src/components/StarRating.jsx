import React from 'react';
import { Icons } from './Icons';

const StarRating = ({ rating, size = 'sm' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Icons.Star key={i} filled={i <= Math.floor(rating)} />
    );
  }
  return (
    <div className={`flex gap-0.5 ${size === 'lg' ? 'gap-1' : ''}`}>
      {stars}
    </div>
  );
};

export default StarRating;
