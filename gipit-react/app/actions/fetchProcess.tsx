"use server";

// Fetch list of processes with pagination
export const fetchProcess = async (page: number) => {
  try {
    if (page < 1) {
      throw new Error("Page number must be greater than 0.");
    }

    const response = await fetch(`http://localhost:3001/api/process?page=${page}`, {
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
      batch: data.batch.map((process) => ({
        id: process.id,
        name: process.job_offer, 
        stage: process.status,
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

// Fetch details for a single process
export const fetchProcessDetails = async (id: number): Promise<{
  id: number;
  name: string;
  stage: string;
  startAt: string;
  endAt: string | null;
  preFiltered: number;
  candidates: number;
  status: string;
  candidatesIds: number[];
  jobOffer: string | null;
} | null> => {
  try {
    const response = await fetch(`http://localhost:3001/api/process/${id}`);
    
    if (!response.ok) {
      throw new Error('Error fetching process details');
    }

    const process = await response.json();
    
    // Add a check to ensure the necessary fields are present
    if (!process) {
      console.error('API response is empty or invalid');
      return null;
    }

    // Validate the process object structure
    if (
      !process.job_offer ||
      !process.job_offer_description ||
      !process.status ||
      !process.candidate_process
    ) {
      console.error('Missing required fields in the process data', process);
      return null;
    }

    // Returning transformed data as expected
    return {
      id: process.id,
      name: process.job_offer, // Assuming job_offer is the name of the job
      stage: process.status ?? '', // Using status as the stage
      startAt: process.opened_at ? new Date(process.opened_at).toLocaleDateString() : '',
      endAt: process.closed_at ? new Date(process.closed_at).toLocaleDateString() : null,
      preFiltered: process.pre_filtered ? 1 : 0,
      candidates: process.candidate_process?.length || 0,
      status: process.status ?? '',
      candidatesIds: process.candidate_process?.map((cp: { candidates: { id: number } }) => cp.candidates.id) || [],
      jobOffer: process.job_offer_description ?? '', // Using job_offer_description as the job offer text
    };
  } catch (error) {
    console.error('Error fetching process details:', error);
    return null;
  }
};


// Fetch candidates associated with a process
export const fetchProcessCandidates = async (processId: number): Promise<{
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  jsongptText: string;
}[] | null> => {
  try {
    const response = await fetch(`http://localhost:3001/api/process/${processId}`);

    if (!response.ok) {
      throw new Error(`Error fetching process details: ${response.statusText}`);
    }

    const process = await response.json();

    if (!process.candidate_process || process.candidate_process.length === 0) {
      console.warn('No candidates found for this process');
      return [];
    }

    return process.candidate_process.map((cp: { candidates: { id: number; name: string; email: string; phone: string; address: string; jsongpt_text: string } }) => ({
      id: cp.candidates.id,
      name: cp.candidates.name,
      email: cp.candidates.email,
      phone: cp.candidates.phone,
      address: cp.candidates.address,
      jsongptText: cp.candidates.jsongpt_text || 'No additional comments',
    }));
  } catch (error) {
    console.error('Error fetching process details:', error);
    return null;
  }
};
