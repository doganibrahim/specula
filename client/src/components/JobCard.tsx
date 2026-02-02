import type { JobPost } from '../lib/api';
import { MapPin, Building2, Calendar, ExternalLink } from 'lucide-react';

interface JobCardProps {
    data: JobPost;
}

export function JobCard({ data }: JobCardProps) {
    const formattedDate = data.job_posted_at_datetime_utc
        ? new Date(data.job_posted_at_datetime_utc).toLocaleDateString()
        : 'Recently';

    return (
        <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-pastel-blue/30 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-serif font-semibold text-text-primary group-hover:text-amber-800 transition-colors">
                        {data.job_title}
                    </h3>
                    <div className="flex items-center text-text-secondary mt-2">
                        <Building2 className="w-4 h-4 mr-1.5 opacity-75" />
                        <span className="text-sm font-medium">{data.employer_name}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8 text-sm text-text-secondary flex-grow">
                <div className="flex items-center bg-cream-100 px-3 py-1.5 rounded-lg border border-cream-50">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                    {data.job_city ? `${data.job_city}, ${data.job_country}` : data.job_country || 'Remote'}
                </div>
                <div className="flex items-center bg-cream-100 px-3 py-1.5 rounded-lg border border-cream-50">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                    {formattedDate}
                </div>
            </div>

            <a
                href={data.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-pastel-orange/80 hover:bg-pastel-orange text-text-primary text-sm font-semibold rounded-xl transition-colors shadow-sm hover:shadow-md"
            >
                Apply Now
                <ExternalLink className="w-4 h-4 ml-2 opacity-75" />
            </a>
        </div>
    );
}
