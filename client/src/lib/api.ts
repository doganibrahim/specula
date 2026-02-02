import axios from 'axios';

export interface JobPost {
    job_id: string;
    employer_name: string;
    job_title: string;
    job_description: string | null;
    job_city: string | null;
    job_country: string | null;
    job_posted_at_datetime_utc: string | null;
    job_apply_link: string;
}

interface SearchResponse {
    status: string;
    count: number;
    data: JobPost[];
}

interface AnalyzeResponse {
    status: string;
    data: Record<string, number>;
}

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

export const searchJobs = async (query: string): Promise<JobPost[]> => {
    const response = await api.get<SearchResponse>('/jobs/search', {
        params: { query },
    });
    return response.data.data;
};

export const analyzeSkills = async (descriptions: string[]): Promise<Record<string, number>> => {
    const response = await api.post<AnalyzeResponse>('/analyze', {
        descriptions,
    });
    return response.data.data;
};
