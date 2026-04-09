"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { getJson } from "@/lib/api";

type AnalyticsResponse<TStat> = {
  course_public_id: string;
  statistics: TStat[];
};

type SubtopicStat = {
  unit_id: string | number;
  unit_name: string;
  unit_number: number;
  subtopic_id: string | number;
  subtopic_name: string;
  average_score: number; // 0..1
  total_attempts: number;
  unique_students: number;
};

type QuestionTimeStat = {
  unit_id: string | number;
  unit_name: string;
  unit_number: number;
  subtopic_id: string | number;
  subtopic_name: string;
  question_id: string | number;
  question_serial_number: string | number;
  average_time_spent: number; // seconds
  total_attempts: number;
  unique_students: number;
};

type UnitUserStat = {
  user_id: string | number;
  unit_id: string | number;
  unit_name: string;
  unit_number: number;
  total_attempts: number;
  questions_attempted: number;
};

const PIE_COLORS = ["#7a003c", "#a81858", "#fdbf57", "#495965", "#dbdbdd", "#959a9e"];

function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{detail ?? "No data available."}</p>
    </div>
  );
}

function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}

function SubTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
        active
          ? "bg-(--maroon) text-white font-medium"
          : "text-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

function ClassAveragesChart({
  data,
}: {
  data: { unit: string; classAvg: number; yourAvg: number }[];
}) {
  const classPoints = data.map((d, i) => ({
    x: i,
    y: d.classAvg,
    unit: d.unit,
  }));
  const yourPoints = data.map((d, i) => ({
    x: i,
    y: d.yourAvg,
    unit: d.unit,
  }));

  const tickFormatter = (index: number) => data[index]?.unit ?? "";

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { unit: string; y: number } }[];
  }) => {
    if (!active || !payload?.length) return null;
    const { unit, y } = payload[0].payload;
    return (
      <div className="bg-white border border-border rounded-md px-3 py-2 text-xs shadow-sm">
        <p className="font-medium mb-0.5">{unit}</p>
        <p>{y}%</p>
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold mb-4">Average by section and unit</h3>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 80, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[-0.5, data.length - 0.5]}
            ticks={data.map((_, i) => i)}
            tickFormatter={tickFormatter}
            tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
            interval={0}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11 }}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
          />
          <Scatter
            name="Class Avg"
            data={classPoints}
            fill="#ef4444"
            fillOpacity={0.7}
            shape="circle"
          />
          <Scatter
            name="Your average"
            data={yourPoints}
            fill="#93c5fd"
            fillOpacity={0.9}
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function TimePerQuestionChart({
  data,
}: {
  data: { unit: string; avgTime: number; rawAvgTime: number }[];
}) {
  const maxValue = Math.max(...data.map((d) => d.avgTime), 0);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { rawAvgTime: number; unit: string } }[];
  }) => {
    if (!active || !payload?.length) return null;
    const entry = payload[0].payload;
    return (
      <div className="bg-white border border-border rounded-md px-3 py-2 text-xs shadow-sm">
        <p className="font-medium mb-0.5">{entry.unit}</p>
        <p>{entry.rawAvgTime}s</p>
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold mb-4">
        Average Time Taken per Question
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 80, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="unit"
            tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
            interval={0}
          />
          <YAxis
            domain={[0, maxValue > 0 ? Math.ceil(maxValue) : 1]}
            tickFormatter={(v) => `${v}s`}
            tick={{ fontSize: 11 }}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="avgTime"
            fill="#93c5fd"
            radius={[3, 3, 0, 0]}
            minPointSize={4}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function UnitDistributionChart({
  data,
}: {
  data: { name: string; value: number; color: string; questionCount: number }[];
}) {
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { name: string; value: number; questionCount: number } }[];
  }) => {
    if (!active || !payload?.length) return null;
    const entry = payload[0].payload;
    return (
      <div className="bg-white border border-border rounded-md px-3 py-2 text-xs shadow-sm">
        <p className="font-medium">{entry.name}</p>
        <p>
          {entry.value}% ({entry.questionCount} questions)
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold mb-4">Questions by Unit</h3>
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <ResponsiveContainer width={260} height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-foreground">{entry.name}</span>
              <span className="ml-auto pl-4 text-muted-foreground font-medium">
                {entry.questionCount} Questions ({entry.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatisticsDashboard({ coursePublicId }: { coursePublicId?: string }) {
  const [activeSubTab, setActiveSubTab] = useState<
    "classAverages" | "timePerQuestion" | "unitDistribution"
  >("classAverages");

  const authFetch = useAuthFetch();
  const fetcher = useCallback(
    async <T,>(url: string): Promise<T> => {
      const res = await authFetch(url);
      return getJson(res) as Promise<T>;
    },
    [authFetch],
  );

  const classAveragesEndpoint = coursePublicId
    ? `/api/analytics/class-averages/?course_public_id=${encodeURIComponent(coursePublicId)}`
    : null;
  const timePerQuestionEndpoint = coursePublicId
    ? `/api/analytics/time-per-question/?course_public_id=${encodeURIComponent(coursePublicId)}`
    : null;
  const unitDistributionEndpoint = coursePublicId
    ? `/api/analytics/unit-distribution/?course_public_id=${encodeURIComponent(coursePublicId)}`
    : null;

  const {
    data: classAveragesRes,
    error: classAveragesError,
    isLoading: classAveragesLoading,
  } = useSWR<AnalyticsResponse<SubtopicStat>>(classAveragesEndpoint, fetcher);

  const {
    data: timePerQuestionRes,
    error: timePerQuestionError,
    isLoading: timePerQuestionLoading,
  } = useSWR<AnalyticsResponse<QuestionTimeStat>>(timePerQuestionEndpoint, fetcher);

  const {
    data: unitDistributionRes,
    error: unitDistributionError,
    isLoading: unitDistributionLoading,
  } = useSWR<AnalyticsResponse<UnitUserStat>>(unitDistributionEndpoint, fetcher);

  const classAveragesData = useMemo(() => {
    const stats = classAveragesRes?.statistics ?? [];
    return stats
      .slice()
      .sort((a, b) => (a.unit_number ?? 0) - (b.unit_number ?? 0))
      .map((s) => ({
        unit: `${s.unit_number}. ${s.unit_name} - ${s.subtopic_name}`,
        classAvg: Math.round(Math.max(0, Math.min(1, s.average_score)) * 1000) / 10,
        // Backend currently returns class-level aggregate only; when one student exists,
        // personal average and class average are identical.
        yourAvg: Math.round(Math.max(0, Math.min(1, s.average_score)) * 1000) / 10,
      }));
  }, [classAveragesRes]);

  const timePerQuestionData = useMemo(() => {
    const stats = timePerQuestionRes?.statistics ?? [];
    const byUnit = new Map<
      string,
      {
        unit_id: string;
        unit_name: string;
        unit_number: number;
        sumWeightedTime: number;
        sumAttempts: number;
        sumTime: number;
        count: number;
      }
    >();

    for (const row of stats) {
      const key = String(row.unit_id);
      const attempts = Number.isFinite(row.total_attempts) ? row.total_attempts : 0;
      const time = Number.isFinite(row.average_time_spent) ? row.average_time_spent : 0;
      const existing = byUnit.get(key);
      if (existing) {
        existing.sumWeightedTime += time * Math.max(0, attempts);
        existing.sumAttempts += Math.max(0, attempts);
        existing.sumTime += time;
        existing.count += 1;
      } else {
        byUnit.set(key, {
          unit_id: String(row.unit_id),
          unit_name: row.unit_name,
          unit_number: row.unit_number,
          sumWeightedTime: time * Math.max(0, attempts),
          sumAttempts: Math.max(0, attempts),
          sumTime: time,
          count: 1,
        });
      }
    }

    return Array.from(byUnit.values())
      .sort((a, b) => (a.unit_number ?? 0) - (b.unit_number ?? 0))
      .map((u) => {
        const avg =
          u.sumAttempts > 0 ? u.sumWeightedTime / u.sumAttempts : u.sumTime / u.count;
        const roundedAvg = Math.round(avg * 10) / 10;
        return {
          unit: `${u.unit_number}. ${u.unit_name}`,
          rawAvgTime: roundedAvg,
          // Keep zero-time data visible in chart while preserving true value in tooltip.
          avgTime: roundedAvg > 0 ? roundedAvg : 0.05,
        };
      });
  }, [timePerQuestionRes]);

  const unitDistributionData = useMemo(() => {
    const stats = unitDistributionRes?.statistics ?? [];
    const byUnit = new Map<
      string,
      {
        unit_id: string;
        unit_name: string;
        unit_number: number;
        total_attempts: number;
        questions_attempted: number;
      }
    >();

    for (const row of stats) {
      const key = String(row.unit_id);
      const attempts = Number.isFinite(row.total_attempts) ? row.total_attempts : 0;
      const questionsAttempted = Number.isFinite(row.questions_attempted)
        ? row.questions_attempted
        : 0;
      const existing = byUnit.get(key);
      if (existing) {
        existing.total_attempts += Math.max(0, attempts);
        existing.questions_attempted += Math.max(0, questionsAttempted);
      } else {
        byUnit.set(key, {
          unit_id: String(row.unit_id),
          unit_name: row.unit_name,
          unit_number: row.unit_number,
          total_attempts: Math.max(0, attempts),
          questions_attempted: Math.max(0, questionsAttempted),
        });
      }
    }

    const units = Array.from(byUnit.values()).sort(
      (a, b) => (a.unit_number ?? 0) - (b.unit_number ?? 0),
    );
    const total = units.reduce((acc, u) => acc + u.questions_attempted, 0);

    return units.map((u, idx) => ({
      name: `${u.unit_number}. ${u.unit_name}`,
      value: total > 0 ? Math.round((u.questions_attempted / total) * 1000) / 10 : 0,
      questionCount: u.questions_attempted,
      color: PIE_COLORS[idx % PIE_COLORS.length],
    }));
  }, [unitDistributionRes]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 border-b border-border pb-2">
        <SubTab
          label="Class averages"
          active={activeSubTab === "classAverages"}
          onClick={() => setActiveSubTab("classAverages")}
        />
        <SubTab
          label="Time per question"
          active={activeSubTab === "timePerQuestion"}
          onClick={() => setActiveSubTab("timePerQuestion")}
        />
        <SubTab
          label="Unit Distribution"
          active={activeSubTab === "unitDistribution"}
          onClick={() => setActiveSubTab("unitDistribution")}
        />
      </div>

      {!coursePublicId ? (
        <EmptyState title="Statistics" detail="Course information is still loading." />
      ) : (
        <>
          {activeSubTab === "classAverages" &&
            (classAveragesLoading ? (
              <EmptyState title="Average by section and unit" detail="Loading..." />
            ) : classAveragesError ? (
              <ErrorState
                title="Average by section and unit"
                message={
                  classAveragesError instanceof Error
                    ? classAveragesError.message
                    : "Failed to load analytics."
                }
              />
            ) : classAveragesData.length === 0 ? (
              <EmptyState
                title="Average by section and unit"
                detail="No class-average data available for this course yet."
              />
            ) : (
              <ClassAveragesChart data={classAveragesData} />
            ))}

          {activeSubTab === "timePerQuestion" &&
            (timePerQuestionLoading ? (
              <EmptyState title="Average Time Taken per Question" detail="Loading..." />
            ) : timePerQuestionError ? (
              <ErrorState
                title="Average Time Taken per Question"
                message={
                  timePerQuestionError instanceof Error
                    ? timePerQuestionError.message
                    : "Failed to load analytics."
                }
              />
            ) : timePerQuestionData.length === 0 ? (
              <EmptyState
                title="Average Time Taken per Question"
                detail="No time-per-question data available for this course yet."
              />
            ) : (
              <TimePerQuestionChart data={timePerQuestionData} />
            ))}

          {activeSubTab === "unitDistribution" &&
            (unitDistributionLoading ? (
              <EmptyState title="Questions by Unit" detail="Loading..." />
            ) : unitDistributionError ? (
              <ErrorState
                title="Questions by Unit"
                message={
                  unitDistributionError instanceof Error
                    ? unitDistributionError.message
                    : "Failed to load analytics."
                }
              />
            ) : unitDistributionData.length === 0 ? (
              <EmptyState
                title="Questions by Unit"
                detail="No unit-distribution data available for this course yet."
              />
            ) : (
              <UnitDistributionChart data={unitDistributionData} />
            ))}
        </>
      )}
    </div>
  );
}
