"use client";

import { useState } from "react";
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

const classAveragesData = [
  { unit: "1.01 Acid/base review", classAvg: 78, yourAvg: 5 },
  { unit: "1.04 Acid/base - Indicators", classAvg: 82, yourAvg: 5 },
  { unit: "2.01 Kinetics - Rate laws", classAvg: 75, yourAvg: 65 },
  { unit: "2.03 Kinetics - Integrated Rate Laws", classAvg: 70, yourAvg: 60 },
  { unit: "2.05 Kinetics - Collision theory", classAvg: 80, yourAvg: 5 },
  { unit: "2.07 Kinetics - Reaction profiles", classAvg: 72, yourAvg: 5 },
  { unit: "2.09 Kinetics - Enzyme kinetics", classAvg: 76, yourAvg: 5 },
  { unit: "3.01 Orgo - Live drawings", classAvg: 88, yourAvg: 0 },
  { unit: "3.04 Orgo - Hybridization", classAvg: 65, yourAvg: 55 },
  { unit: "4.01 Orgo - Functional groups", classAvg: 78, yourAvg: 5 },
  { unit: "4.03 Orgo - Reactions", classAvg: 82, yourAvg: 5 },
  { unit: "4.05 Orgo - Synthesis", classAvg: 74, yourAvg: 5 },
  { unit: "5.01 ChemBio - Asymmetry", classAvg: 80, yourAvg: 5 },
  { unit: "5.03 ChemBio - Combinatorial chemistry", classAvg: 77, yourAvg: 5 },
  { unit: "6.02 Isoelectric Point of Casein", classAvg: 79, yourAvg: 5 },
  { unit: "6.04 Asprin Synthesis Lab", classAvg: 83, yourAvg: 95 },
  { unit: "7.52 ME - Properties of liquids", classAvg: 80, yourAvg: 5 },
];

const timePerQuestionData = [
  { unit: "1.03 Acid/base - Buffers", avgTime: 2.8 },
  { unit: "1.05 Acid/base - Titration Curves", avgTime: 2.1 },
  { unit: "2.01 Kinetics - Rate laws", avgTime: 3.0 },
  { unit: "3.02 Orgo - Hybridization", avgTime: 10.5 },
  { unit: "6.04 Asprin Synthesis Lab", avgTime: 1.8 },
];

const unitDistributionData = [
  { name: "Acid/base", value: 18, color: "#7a003c" },
  { name: "Kinetics", value: 28, color: "#a81858" },
  { name: "Organic Chem", value: 22, color: "#fdbf57" },
  { name: "ChemBio", value: 15, color: "#495965" },
  { name: "Lab", value: 10, color: "#dbdbdd" },
  { name: "Other", value: 7, color: "#959a9e" },
];

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

function ClassAveragesChart() {
  const classPoints = classAveragesData.map((d, i) => ({
    x: i,
    y: d.classAvg,
    unit: d.unit,
  }));
  const yourPoints = classAveragesData.map((d, i) => ({
    x: i,
    y: d.yourAvg,
    unit: d.unit,
  }));

  const tickFormatter = (index: number) => classAveragesData[index]?.unit ?? "";

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
            domain={[-0.5, classAveragesData.length - 0.5]}
            ticks={classAveragesData.map((_, i) => i)}
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

function TimePerQuestionChart() {
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { value: number }[];
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-border rounded-md px-3 py-2 text-xs shadow-sm">
        <p>{payload[0].value}s</p>
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
          data={timePerQuestionData}
          margin={{ top: 10, right: 20, bottom: 80, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="unit"
            tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
            interval={0}
          />
          <YAxis
            tickFormatter={(v) => `${v}s`}
            tick={{ fontSize: 11 }}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avgTime" fill="#93c5fd" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function UnitDistributionChart() {
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { name: string; value: number }[];
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-border rounded-md px-3 py-2 text-xs shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p>{payload[0].value}%</p>
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
              data={unitDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {unitDistributionData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2">
          {unitDistributionData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-foreground">{entry.name}</span>
              <span className="ml-auto pl-4 text-muted-foreground font-medium">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatisticsDashboard() {
  const [activeSubTab, setActiveSubTab] = useState<
    "classAverages" | "timePerQuestion" | "unitDistribution"
  >("classAverages");

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

      {activeSubTab === "classAverages" && <ClassAveragesChart />}
      {activeSubTab === "timePerQuestion" && <TimePerQuestionChart />}
      {activeSubTab === "unitDistribution" && <UnitDistributionChart />}
    </div>
  );
}
