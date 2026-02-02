import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { JobPost } from '../lib/api';
import { analyzeSkills } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

interface SkillHeatmapProps {
    jobs: JobPost[];
}

const COLORS = ['#FFD6D6', '#FFBCBC', '#FFE7A0', '#B8E6C1', '#D4C1EC', '#B2D2FF', '#E2E8F0'];

export function SkillHeatmap({ jobs }: SkillHeatmapProps) {
    const jobDescriptions = useMemo(() =>
        jobs.map(j => (j.job_description || "") + " " + j.job_title).filter(Boolean),
        [jobs]);

    const { data: aiData, isLoading } = useQuery({
        queryKey: ['skills', jobs.map(j => j.job_id).join(',')],
        queryFn: () => analyzeSkills(jobDescriptions),
        enabled: jobDescriptions.length > 0,
        staleTime: 1000 * 60 * 60, // Cache analysis for 1 hour
    });

    const chartData = useMemo(() => {
        if (!aiData) return [];
        return Object.entries(aiData)
            .map(([name, count]) => ({
                name,
                count: Number(count),
                fill: COLORS[0] // Placeholder color logic, will be set in map
            }))
            .map((item, index) => ({
                ...item,
                fill: COLORS[index % COLORS.length]
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 skills
    }, [aiData]);

    if (jobs.length === 0) return null;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-cream-100 min-h-[300px]">
            <h2 className="text-2xl font-serif font-medium mb-8 text-text-primary px-2">
                Market Insights: AI Analysis
                {isLoading && <span className="text-sm font-sans font-normal text-pastel-purple ml-3 animate-pulse">Analyzing...</span>}
            </h2>

            {isLoading ? (
                <div className="h-[300px] w-full flex flex-col items-center justify-center text-text-secondary space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-pastel-purple" />
                    <p className="font-serif italic text-sm">Gemini AI is reading job descriptions...</p>
                </div>
            ) : chartData.length > 0 ? (
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={120}
                                tick={{ fill: '#718096', fontSize: 13, fontFamily: 'Inter' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: '#FFFBF5' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #FFF6E6',
                                    color: '#2D3748',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                }}
                            />
                            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={28}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-text-secondary">
                    <p>No skill data found.</p>
                </div>
            )}
        </div>
    );
}
