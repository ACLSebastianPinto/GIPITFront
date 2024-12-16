import React from 'react';
import StatsCard from '@/components/molecules/StatsCard';
import { IconUsers, IconFolderCheck, IconFolder, IconClock } from '@tabler/icons-react';
import { fetchDashboardStats } from '@/app/actions/fetchDashboardStats';

async function DashboardPage() {
  const stats = await fetchDashboardStats();

  return (
    <div className="inner-page-container">
      <div className="dashboard-header">
        <h1>Hola,</h1>
        <p className="text-14">Simplifica tu gestión de contrataciones y toma decisiones más rápido</p>
      </div>

      <div className="dashboard-stats">
        <h3>Resumen de procesos</h3>
        <div className="stats-grid">
          <StatsCard
            title="Procesos Activos"
            value={stats.activosCount}
            subtitle="Hace 2 días"
            icon={<IconFolder size={24} />}
            color="var(--primary)"
          />
          <StatsCard
            title="Procesos Cerrados"
            value={stats.cerradosCount}
            subtitle="5 en el último trimestre"
            icon={<IconFolderCheck size={24} />}
            color="var(--light-secondary)"
          />
          <StatsCard
            title="Profesionales Activos"
            value={stats.profesionalesCount}
            subtitle="5 en el último trimestre"
            icon={<IconUsers size={24} />}
            color="#4CAF50"
          />
        </div>

        <div className="time-stats">
          <StatsCard
            title="Tiempo promedio de cierre"
            value={stats.tiempoCierre}
            subtitle="Promedio de últimos 5 procesos"
            icon={<IconClock size={24} />}
            color="var(--dark-tertiary)"
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage; 