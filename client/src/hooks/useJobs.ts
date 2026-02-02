import { useQuery } from '@tanstack/react-query';
import { searchJobs, type JobPost } from '../lib/api';

export const useJobs = (query: string) => {
    return useQuery<JobPost[]>({
        queryKey: ['jobs', query],
        queryFn: () => searchJobs(query),
        enabled: !!query, // Only fetch if query is not empty
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1,
    });
};
