import { useEffect, useState } from "react";
import {
    ArrowRight,
    Clock,
    AlertTriangle,
    User,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function TasksSummary() {
    const { currentWorkspace } = useSelector(
        (state) => state.workspace
    );

    const user = { id: "user_1" };

    const [tasks, setTasks] = useState([]);

    // Get all tasks from all projects in the current workspace
    useEffect(() => {
        if (!currentWorkspace?.projects) {
            setTasks([]);
            return;
        }

        const allTasks = currentWorkspace.projects.flatMap(
            (project) => project.tasks || []
        );

        setTasks(allTasks);
    }, [currentWorkspace]);

    const myTasks = tasks.filter(
        (task) => task.assigneeId === user.id
    );

    const overdueTasks = tasks.filter((task) => {
        if (!task.due_date || task.status === "DONE") {
            return false;
        }

        const dueDate = new Date(task.due_date);

        return (
            !Number.isNaN(dueDate.getTime()) &&
            dueDate < new Date()
        );
    });

    const inProgressIssues = tasks.filter(
        (task) => task.status === "IN_PROGRESS"
    );

    const summaryCards = [
        {
            title: "My Tasks",
            count: myTasks.length,
            icon: User,
            iconColor:
                "text-emerald-600 dark:text-emerald-400",
            iconBg:
                "bg-emerald-50 dark:bg-emerald-500/10",
            badge:
                "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
            items: myTasks.slice(0, 3),
        },
        {
            title: "Overdue",
            count: overdueTasks.length,
            icon: AlertTriangle,
            iconColor:
                "text-red-600 dark:text-red-400",
            iconBg:
                "bg-red-50 dark:bg-red-500/10",
            badge:
                "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
            items: overdueTasks.slice(0, 3),
        },
        {
            title: "In Progress",
            count: inProgressIssues.length,
            icon: Clock,
            iconColor:
                "text-blue-600 dark:text-blue-400",
            iconBg:
                "bg-blue-50 dark:bg-blue-500/10",
            badge:
                "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
            items: inProgressIssues.slice(0, 3),
        },
    ];

    return (
        <div className="space-y-4">
            {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                    <section
                        key={card.title}
                        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
                                >
                                    <Icon
                                        className={`size-4 ${card.iconColor}`}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                        {card.title}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                                        {card.count === 0
                                            ? "Nothing needs attention"
                                            : `${card.count} ${
                                                  card.count === 1
                                                      ? "item"
                                                      : "items"
                                              }`}
                                    </p>
                                </div>
                            </div>

                            {/* Count */}
                            <span
                                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${card.badge}`}
                            >
                                {card.count}
                            </span>
                        </div>

                        {/* Tasks */}
                        <div className="p-4">
                            {card.items.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-6 text-center dark:border-zinc-800 dark:bg-zinc-950/40">
                                    <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-900">
                                        <Icon className="size-4 text-zinc-400 dark:text-zinc-500" />
                                    </div>

                                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                        No {card.title.toLowerCase()}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {card.items.map((task) => (
                                        <div
                                            key={task.id}
                                            className="group rounded-xl border border-transparent bg-zinc-50 p-3 transition-all hover:border-zinc-200 hover:bg-white hover:shadow-sm dark:bg-zinc-950/60 dark:hover:border-zinc-800 dark:hover:bg-zinc-900"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Task indicator */}
                                                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-400 shadow-sm dark:bg-zinc-800 dark:text-zinc-500">
                                                    <span className="size-1.5 rounded-full bg-current" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                                                        {task.title ||
                                                            "Untitled task"}
                                                    </h4>

                                                    <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                                                        {task.type ||
                                                            "Task"}{" "}
                                                        <span className="mx-1 text-zinc-300 dark:text-zinc-700">
                                                            •
                                                        </span>
                                                        {task.priority ||
                                                            "Normal"}{" "}
                                                        priority
                                                    </p>
                                                </div>

                                                <ArrowRight className="size-4 shrink-0 text-zinc-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-500 group-hover:opacity-100 dark:text-zinc-700 dark:group-hover:text-zinc-400" />
                                            </div>
                                        </div>
                                    ))}

                                    {/* View more */}
                                    {card.count > 3 && (
                                        <button
                                            type="button"
                                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                        >
                                            View {card.count - 3} more
                                            <ArrowRight className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}