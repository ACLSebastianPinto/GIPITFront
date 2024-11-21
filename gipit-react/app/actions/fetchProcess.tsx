"use server";

type Candidate = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  jsongpt_text: string;
};

type ProcessData = {
  id: number;
  job_offer: string;
  opened_at: string;
  closed_at: string | null;
  pre_filtered: boolean;
  candidate_process: Candidate[];  // Use Candidate[] instead of any[]
  status: string;
};

type Proceso = {
  id: number;
  name: string;
  startAt: string;
  endAt: string | null;
  preFiltered: number;
  candidates: number;
  status: string;
  candidatesIds: number[];
  jobOffer: string | null;
  stage: string;
  isInternal: boolean;
};

export const fetchProcess = async (page: number) => {
  try {
    if (page < 1) {
      throw new Error("Page number must be greater than 0.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/process?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching processes');
    }

    const data = await response.json();

    return {
      total: data.total,
      batch: data.batch.map((process: ProcessData) => ({
        id: process.id,
        name: process.job_offer,
        startAt: process.opened_at ? new Date(process.opened_at).toLocaleDateString() : '',
        endAt: process.closed_at ? new Date(process.closed_at).toLocaleDateString() : null,
        preFiltered: process.pre_filtered ? 1 : 0,
        candidates: process.candidate_process ? process.candidate_process.length : 0,
        state: process.status,
      })),
    };
  } catch (error) {
    console.error('Error fetching process data:', error);
    return {
      total: 0,
      batch: [],
    };
  }
};




export const fetchProcessDetails = async (id: number): Promise<Proceso | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/process/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error("Error al obtener los detalles del proceso");
    }

    const proceso = await response.json();

    const candidateProcess = Array.isArray(proceso.candidate_process) ? proceso.candidate_process : [];

    if (candidateProcess.length === 0) {
      console.warn('No se encontraron candidatos en los datos del proceso');
    }

    const candidatesIds = candidateProcess.map((candidate: { id: number }) => candidate.id);

    return {
      id: proceso.processId,
      name: proceso.jobOffer,
      startAt: proceso.openedAt ? new Date(proceso.openedAt).toLocaleDateString() : '',
      endAt: proceso.closedAt ? new Date(proceso.closedAt).toLocaleDateString() : null,
      preFiltered: proceso.preFiltered ? 1 : 0,
      candidates: candidateProcess.length || 0,
      status: proceso.status ?? '',
      candidatesIds: candidatesIds,
      jobOffer: proceso.jobOfferDescription ?? '',
      stage: proceso.stage ?? 'Desconocido',
      isInternal: proceso.isInternal ?? false,
    };
  } catch (error) {
    console.error('Error al obtener los detalles del proceso:', error);
    return null;
  }
};

export const fetchProcessCandidates = async (processId: number): Promise<{
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  jsongptText: string;
}[] | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/process/${processId}`);

    if (!response.ok) {
      throw new Error(`Error al obtener los detalles del proceso: ${response.statusText}`);
    }

    const proceso = await response.json();  // Now using 'proceso' for the process object

    if (!proceso.candidate_process || proceso.candidate_process.length === 0) {
      console.warn('No se encontraron candidatos para este proceso');
      return [];
    }

    return proceso.candidate_process.map((cp: { candidates: { id: number; name: string; email: string; phone: string; address: string; jsongpt_text: string } }) => ({
      id: cp.candidates.id,
      name: cp.candidates.name,
      email: cp.candidates.email,
      phone: cp.candidates.phone,
      address: cp.candidates.address,
      jsongptText: cp.candidates.jsongpt_text || 'No hay comentarios adicionales',
    }));
  } catch (error) {
    console.error('Error al obtener los detalles del proceso:', error);
    return null;
  }
};

