import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";
import {
    CheckCircle,
    Clock,
    AlertTriangle,
    Users,
    ArrowRightIcon,
} from "lucide-react";

// Chart colors
const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
];

const PRIORITY_COLORS = {
    LOW: {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500",
        lightBg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    MEDIUM: {
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500",
        lightBg: "bg-blue-50 dark:bg-blue-500/10",
    },
    HIGH: {
        text: "text-red-600 dark:text-red-400",
        bg: "bg-red-500",
        lightBg: "bg-red-50 dark:bg-red-500/10",
    },
};

const ProjectAnalytics = ({ project, tasks = [] }) => {
    const { stats, statusData, typeData, priorityData } = useMemo(() => {
        const now = new Date();
        const total = tasks.length;

        const stats = {
            total,
            completed: 0,
            inProgress: 0,
            todo: 0,
            overdue: 0,
        };

        const statusMap = {
            TODO: 0,
            IN_PROGRESS: 0,
            DONE: 0,
        };

        const typeMap = {
            TASK: 0,
            BUG: 0,
            FEATURE: 0,
            IMPROVEMENT: 0,
            OTHER: 0,
        };

        const priorityMap = {
            LOW: 0,
            MEDIUM: 0,
            HIGH: 0,
        };

        tasks.forEach((task) => {
            if (task.status === "DONE") stats.completed++;
            if (task.status === "IN_PROGRESS") stats.inProgress++;
            if (task.status === "TODO") stats.todo++;

            if (
                task.due_date &&
                new Date(task.due_date) < now &&
                task.status !== "DONE"
            ) {
                stats.overdue++;
            }

            if (statusMap[task.status] !== undefined) {
                statusMap[task.status]++;
            }

            if (typeMap[task.type] !== undefined) {
                typeMap[task.type]++;
            }

            if (priorityMap[task.priority] !== undefined) {
                priorityMap[task.priority]++;
            }
        });

        return {
            stats,

            statusData: Object.entries(statusMap).map(([key, value]) => ({
                name: key.replace("_", " "),
                value,
            })),

            typeData: Object.entries(typeMap)
                .filter(([_, value]) => value > 0)
                .map(([key, value]) => ({
                    name: key,
                    value,
                })),

            priorityData: Object.entries(priorityMap).map(
                ([key, value]) => ({
                    name: key,
                    value,
                    percentage:
                        total > 0
                            ? Math.round((value / total) * 100)
                            : 0,
                })
            ),
        };
    }, [tasks]);

    const completionRate = stats.total
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;

    const metrics = [
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            icon: CheckCircle,
            iconColor: "text-emerald-600 dark:text-emerald-400",
            iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
        },
        {
            label: "Active Tasks",
            value: stats.inProgress,
            icon: Clock,
            iconColor: "text-blue-600 dark:text-blue-400",
            iconBg: "bg-blue-50 dark:bg-blue-500/10",
        },
        {
            label: "Overdue Tasks",
            value: stats.overdue,
            icon: AlertTriangle,
            iconColor: "text-red-600 dark:text-red-400",
            iconBg: "bg-red-50 dark:bg-red-500/10",
        },
        {
            label: "Team Size",
            value: project?.members?.length || 0,
            icon: Users,
            iconColor: "text-purple-600 dark:text-purple-400",
            iconBg: "bg-purple-50 dark:bg-purple-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => {
                    const Icon = metric.icon;

                    return (
                        <div
                            key={metric.label}
                            className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                        {metric.label}
                                    </p>

                                    <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        {metric.value}
                                    </p>
                                </div>

                                <div
                                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${metric.iconBg}`}
                                >
                                    <Icon
                                        className={`size-5 ${metric.iconColor}`}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Tasks by Status */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                            Tasks by Status
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                            Current distribution of project tasks
                        </p>
                    </div>

                    <div className="h-[280px] w-full sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={statusData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 5,
                                }}
                            >
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fill: "#71717a",
                                        fontSize: 11,
                                    }}
                                    axisLine={{
                                        stroke: "#e4e4e7",
                                    }}
                                    tickLine={false}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{
                                        fill: "#71717a",
                                        fontSize: 11,
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "rgba(59, 130, 246, 0.05)",
                                    }}
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #e4e4e7",
                                        backgroundColor: "#ffffff",
                                        boxShadow:
                                            "0 10px 30px rgba(0,0,0,0.08)",
                                    }}
                                />

                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={55}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tasks by Type */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                            Tasks by Type
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                            Breakdown of task categories
                        </p>
                    </div>

                    {typeData.length === 0 ? (
                        <div className="flex h-[280px] items-center justify-center sm:h-[300px]">
                            <p className="text-sm text-zinc-400 dark:text-zinc-500">
                                No task type data available
                            </p>
                        </div>
                    ) : (
                        <div className="h-[280px] w-full sm:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={typeData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="65%"
                                        innerRadius="35%"
                                        paddingAngle={3}
                                        label={({ name, value }) =>
                                            `${name}: ${value}`
                                        }
                                        labelLine={false}
                                    >
                                        {typeData.map((_, index) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "1px solid #e4e4e7",
                                            backgroundColor: "#ffffff",
                                            boxShadow:
                                                "0 10px 30px rgba(0,0,0,0.08)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Priority Breakdown */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                <div className="mb-6">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                        Tasks by Priority
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                        Priority distribution across this project
                    </p>
                </div>

                <div className="space-y-5">
                    {priorityData.map((priority) => {
                        const colors =
                            PRIORITY_COLORS[priority.name] ||
                            PRIORITY_COLORS.MEDIUM;

                        return (
                            <div
                                key={priority.name}
                                className="space-y-2.5"
                            >
                                {/* Priority Header */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`flex size-7 items-center justify-center rounded-lg ${colors.lightBg}`}
                                        >
                                            <ArrowRightIcon
                                                className={`size-3.5 ${colors.text}`}
                                            />
                                        </div>

                                        <span className="text-sm font-medium capitalize text-zinc-800 dark:text-zinc-200">
                                            {priority.name.toLowerCase()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 pl-9 sm:pl-0">
                                        <span className="text-xs text-zinc-500 dark:text-zinc-500">
                                            {priority.value}{" "}
                                            {priority.value === 1
                                                ? "task"
                                                : "tasks"}
                                        </span>

                                        <span className="rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                                            {priority.percentage}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${colors.bg}`}
                                        style={{
                                            width: `${priority.percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalytics;