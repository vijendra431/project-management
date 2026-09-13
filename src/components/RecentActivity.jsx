import { useEffect, useState } from "react";
import {
    GitCommit,
    MessageSquare,
    Clock,
    Bug,
    Zap,
    Square,
} from "lucide-react";
import { format, isValid } from "date-fns";
import { useSelector } from "react-redux";

const typeIcons = {
    BUG: {
        icon: Bug,
        color: "text-red-500 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-500/10",
    },
    FEATURE: {
        icon: Zap,
        color: "text-blue-500 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    TASK: {
        icon: Square,
        color: "text-emerald-500 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    IMPROVEMENT: {
        icon: MessageSquare,
        color: "text-amber-500 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    OTHER: {
        icon: GitCommit,
        color: "text-purple-500 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-500/10",
    },
};

const statusColors = {
    TODO: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    IN_PROGRESS:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    DONE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
};

const RecentActivity = () => {
    const [tasks, setTasks] = useState([]);

    const { currentWorkspace } = useSelector(
        (state) => state.workspace
    );

    const getTasksFromCurrentWorkspace = () => {
        if (!currentWorkspace?.projects) {
            setTasks([]);
            return;
        }

        const allTasks = currentWorkspace.projects.flatMap(
            (project) => project.tasks || []
        );

        // Show the most recently updated tasks first.
        const sortedTasks = [...allTasks].sort((a, b) => {
            const dateA = new Date(a.updatedAt || 0).getTime();
            const dateB = new Date(b.updatedAt || 0).getTime();

            return dateB - dateA;
        });

        setTasks(sortedTasks);
    };

    useEffect(() => {
        getTasksFromCurrentWorkspace();
    }, [currentWorkspace]);

    const formatTaskDate = (date) => {
        if (!date) return "Unknown time";

        const parsedDate = new Date(date);

        if (!isValid(parsedDate)) {
            return "Unknown time";
        }

        return format(parsedDate, "MMM d, h:mm a");
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
                <div>
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Recent Activity
                    </h2>

                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        Latest updates across your workspace
                    </p>
                </div>

                {tasks.length > 0 && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                    </span>
                )}
            </div>

            {/* Content */}
            <div>
                {tasks.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                            <Clock className="size-7 text-zinc-400 dark:text-zinc-500" />
                        </div>

                        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            No recent activity
                        </h3>

                        <p className="mx-auto mt-1 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
                            Task updates and activity will appear here when
                            your workspace becomes active.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {tasks.map((task, index) => {
                            const taskType = task.type || "OTHER";

                            const {
                                icon: TypeIcon,
                                color: iconColor,
                                bg: iconBg,
                            } = typeIcons[taskType] || typeIcons.OTHER;

                            const statusClass =
                                statusColors[task.status] ||
                                "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

                            const assigneeName =
                                task.assignee?.name || "Unassigned";

                            const initial = assigneeName
                                .charAt(0)
                                .toUpperCase();

                            return (
                                <div
                                    key={task.id || index}
                                    className="group px-5 py-5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 sm:px-6"
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        {/* Type icon */}
                                        <div
                                            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                                        >
                                            <TypeIcon
                                                className={`size-4 ${iconColor}`}
                                            />
                                        </div>

                                        {/* Task content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <h4 className="min-w-0 truncate pr-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                    {task.title ||
                                                        "Untitled task"}
                                                </h4>

                                                <span
                                                    className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClass}`}
                                                >
                                                    {(
                                                        task.status ||
                                                        "TODO"
                                                    )
                                                        .replaceAll("_", " ")
                                                        .toLowerCase()
                                                        .replace(
                                                            /\b\w/g,
                                                            (char) =>
                                                                char.toUpperCase()
                                                        )}
                                                </span>
                                            </div>

                                            {/* Metadata */}
                                            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                {/* Task type */}
                                                <span className="capitalize">
                                                    {taskType
                                                        .toLowerCase()
                                                        .replace(
                                                            "_",
                                                            " "
                                                        )}
                                                </span>

                                                <span className="hidden size-1 rounded-full bg-zinc-300 dark:bg-zinc-700 sm:block" />

                                                {/* Assignee */}
                                                {task.assignee ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="flex size-5 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                                                            {initial}
                                                        </div>

                                                        <span className="max-w-32 truncate">
                                                            {assigneeName}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>Unassigned</span>
                                                )}

                                                <span className="hidden size-1 rounded-full bg-zinc-300 dark:bg-zinc-700 sm:block" />

                                                {/* Updated time */}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="size-3.5" />
                                                    {formatTaskDate(
                                                        task.updatedAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default RecentActivity;