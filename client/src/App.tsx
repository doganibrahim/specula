import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { useJobs } from './hooks/useJobs';
import { JobCard } from './components/JobCard';
import { SkillHeatmap } from './components/SkillHeatmap';

function App() {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('Python Developer'); // Default search
  const { data: jobs, isLoading, isError, error } = useJobs(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-16 px-4 sm:px-6 font-sans text-text-primary">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-pastel-blue/30 text-slate-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Project Specula
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-text-primary tracking-tight">
            Job Market Intelligence
          </h1>
          <p className="text-text-secondary text-xl font-light">
            Analyze skill demand and find your next role with data-driven insights.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mt-10">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-pastel-purple transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title (e.g., React Developer)..."
                className="w-full pl-14 pr-4 py-5 rounded-full border border-cream-100 bg-white text-text-primary placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-pastel-purple/20 shadow-soft transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 bottom-2.5 bg-text-primary text-white px-8 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-pastel-purple" />
            <p className="font-serif italic">Scanning job market data...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl p-8 max-w-2xl mx-auto border border-red-100">
            <p className="font-serif font-semibold text-lg">Error fetching data</p>
            <p className="text-sm mt-2 opacity-80">{(error as Error).message}</p>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Intelligence Layer */}
            {jobs && jobs.length > 0 && (
              <SkillHeatmap jobs={jobs} />
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs?.map((job) => (
                <JobCard key={job.job_id} data={job} />
              ))}
            </div>

            {jobs && jobs.length === 0 && (
              <div className="text-center py-20 text-text-secondary">
                <p className="font-serif italic text-lg">No jobs found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
