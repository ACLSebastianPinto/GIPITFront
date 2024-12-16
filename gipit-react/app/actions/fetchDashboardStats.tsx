'use server';

interface DashboardStats {
  activosCount: number;
  cerradosCount: number;
  profesionalesCount: number;
  tiempoCierre: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener las estadísticas del dashboard');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    // Valores por defecto en caso de error
    return {
      activosCount: 0,
      cerradosCount: 0,
      profesionalesCount: 0,
      tiempoCierre: 0,
    };
  }
} 