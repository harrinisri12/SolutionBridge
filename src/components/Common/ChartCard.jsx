import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import { Card } from './Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ChartCard = ({
  title,
  subtitle,
  type = 'bar', // bar, line, doughnut, radar
  data,
  options = {},
  height = 240,
  action,
  className = ''
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          color: '#475569'
        }
      },
      tooltip: {
        backgroundColor: '#0f2942',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales:
      type === 'doughnut'
        ? {}
        : {
            x: {
              grid: { display: false, drawBorder: false },
              ticks: {
                color: '#64748b',
                font: { size: 10 }
              }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                color: '#64748b',
                font: { size: 10 }
              }
            }
          }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={action}
      className={className}
      bodyClassName="p-4"
    >
      <div style={{ height: `${height}px`, width: '100%' }} className="relative">
        {type === 'bar' && <Bar data={data} options={mergedOptions} />}
        {type === 'line' && <Line data={data} options={mergedOptions} />}
        {type === 'doughnut' && <Doughnut data={data} options={mergedOptions} />}
        {type === 'radar' && <Radar data={data} options={mergedOptions} />}
      </div>
    </Card>
  );
};

export default ChartCard;
