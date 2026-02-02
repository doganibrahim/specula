import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { JobPost } from '../lib/api';
import { useMemo } from 'react';

interface SkillHeatmapProps {
    jobs: JobPost[];
}

const SKILL_KEYWORDS = ["React", "Python", "TypeScript", "Docker", "AWS", "SQL", "Node.js"];
const COLORS = ['#FFD6D6', '#FFBCBC', '#FFE7A0', '#B8E6C1', '#D4C1EC', '#B2D2FF', '#E2E8F0'];

export function SkillHeatmap({ jobs }: SkillHeatmapProps) {
    const data = useMemo(() => {
        const counts: Record<string, number> = {};
        SKILL_KEYWORDS.forEach(k => counts[k] = 0);

        jobs.forEach(job => {
            const description = (job.job_description || "").toLowerCase() + " " + (job.job_title || "").toLowerCase();
            SKILL_KEYWORDS.forEach(skill => {
                if (description.includes(skill.toLowerCase())) {
                    counts[skill]++;
                }
            });
        });

        return SKILL_KEYWORDS.map((skill, index) => ({
            name: skill,
            count: counts[skill],
            fill: COLORS[index % COLORS.length]
        })).sort((a, b) => b.count - a.count);
    }, [jobs]);

    if (jobs.length === 0) return null;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-cream-100">
            <h2 className="text-2xl font-serif font-medium mb-8 text-text-primary px-2">Market Insights: Skill Demand</h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
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
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
