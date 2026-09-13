import {
    FolderOpen,
    CheckCircle,
    Users,
    AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function StatsGrid() {
    const currentWorkspace = useSelector(
        (state) => state?.workspace?.currentWorkspace || null
    );

    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        myTasks: 0,
        overdueIssues: 0,
    });

    useEffect(() => {
        if (!currentWorkspace?.projects) {
            setStats({
                totalProjects: 0,
                activeProjects: 0,
                completedProjects: 0,
                myTasks: 0,
                overdueIssues: 0,
            });
            return;
        }

        const projects = currentWorkspace.projects;
        const ownerEmail = currentWorkspace.owner?.email;

        const totalProjects = projects.length;

        const activeProjects = projects.filter(
            (project) =>
                project.status !== "CANCELLED" &&
                project.status !== "COMPLETED"
        ).length;

        const completedProjects = projects.filter(
            (project) => project.status === "COMPLETED"
        ).length;

        const myTasks = projects.reduce(
            (total, project) =>
                total +
                (project.tasks || []).filter(
                    (task) => task.assignee?.email === ownerEmail
                ).length,
            0
        );

        const now = new Date();

        const overdueIssues = projects.reduce(
            (total, project) =>
                total +
                (project.tasks || []).filter((task) => {
                    if (!task.due_date || task.status === "DONE") {
                        return false;
                    }

                    const dueDate = new Date(task.due_date);

                    return !Number.isNaN(dueDate.getTime()) && dueDate < now;
                }).length,
            0
        );

        setStats({
            totalProjects,
            activeProjects,
            completedProjects,
            myTasks,
            overdueIssues,
        });
    }, [currentWorkspace]);

    const statCards = [
        {
            icon: FolderOpen,
            title: "Total Projects",
            value: stats.totalProjects,
            subtitle: currentWorkspace?.name
                ? `Projects in ${currentWorkspace.name}`
                : "Projects in workspace",
            iconBg: "bg-blue-50 dark:bg-blue-500/10",
            iconColor: "text-blue-600 dark:text-blue-400",
        },
        {
            icon: CheckCircle,
            title: "Completed Projects",
            value: stats.completedProjects,
            subtitle: `of ${stats.totalProjects} total`,
            iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
            iconColor: "text-emerald-600 dark:text-emerald-400",
        },
        {
            icon: Users,
            title: "My Tasks",
            value: stats.myTasks,
            subtitle: "Assigned to me",
            iconBg: "bg-purple-50 dark:bg-purple-500/10",
            iconColor: "text-purple-600 dark:text-purple-400",
        },
        {
            icon: AlertTriangle,
            title: "Overdue",
            value: stats.overdueIssues,
            subtitle: "Need attention",
            iconBg: "bg-amber-50 dark:bg-amber-500/10",
            iconColor: "text-amber-600 dark:text-amber-400",
        },
    ];

    return (
        <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(
                ({
                    icon: Icon,
                    title,
                    value,
                    subtitle,
                    iconBg,
                    iconColor,
                }) => (
                    <div
                        key={title}
                        className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                    >
                        <div className="flex items-start justify-between gap-4">
                            {/* Text */}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    {title}
                                </p>

                                <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {value}
                                </p>

                                <p className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
                                    {subtitle}
                                </p>
                            </div>

                            {/* Icon */}
                            <div
                                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                            >
                                <Icon
                                    className={`size-5 ${iconColor}`}
                                />
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}