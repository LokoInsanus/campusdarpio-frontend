import { type FC } from 'react';

interface CardProps {
  title: string;
  description?: string;
}

const Card: FC<CardProps> = ({ title, description }) => {
  return (
    <div className="card bg-success" style={{ maxWidth: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title text-center">{title}</h5>
        <p className="card-text text-center">{description}</p>
      </div>
    </div>
  );
}

export default Card;