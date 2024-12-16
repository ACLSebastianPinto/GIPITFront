import React from 'react';
import './statsCard.css';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, color = 'var(--primary)' }) => {
  return (
    <div className="stats-card" style={{ backgroundColor: `${color}20` }}>
      <div className="stats-content">
        <div className="stats-info">
          <h3>{value}</h3>
          <h4>{title}</h4>
          {subtitle && <p className="text-12">{subtitle}</p>}
        </div>
        {icon && (
          <div className="stats-icon" style={{ backgroundColor: color }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard; 