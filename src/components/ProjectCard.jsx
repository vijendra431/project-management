import { Link } from "react-router-dom";
import { ArrowUpRightIcon, UsersIcon } from "lucide-react";

const statusColors = {
    PLANNING:
        "bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    ACTIVE:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    ON_HOLD:
        "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    COMPLETED:
        "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    CANCELLED:
        "bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
};

const ProjectCard = ({ project }) => {
    const progress = Math.min(
        100,
        Math.max(0, Number(project.progress) || 0)
    );

    const status = project.status || "PLANNING";
    const priority = project.priority || "MEDIUM";

    return (
        <Link
            to={`/projectsDetail?id=${project.id}&tab=tasks`}
            className="group block h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {project.name}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 min-h-[40px] text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                        {project.description || "No description available"}
                    </p>
                </div>

                {/* Open Project */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-zinc-400 opacity-0 transition-all duration-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:opacity-100 dark:bg-zinc-800 dark:text-zinc-500 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
                    <ArrowUpRightIcon className="size-4" />
                </div>
            </div>

            {/* Status & Priority */}
            <div className="mt-5 flex items-center justify-between gap-3">
                <span
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        statusColors[status] || statusColors.PLANNING
                    }`}
                >
                    {status.replace("_", " ")}
                </span>

                <span className="text-xs font-medium capitalize text-zinc-400 dark:text-zinc-500">
                    {priority.toLowerCase()} priority
                </span>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-zinc-100 dark:border-zinc-800" />

            {/* Progress */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Progress
                    </span>

                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {progress}%
                    </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                    <UsersIcon className="size-3.5" />
                    <span>
                        {project.members?.length || 0}{" "}
                        {project.members?.length === 1
                            ? "member"
                            : "members"}
                    </span>
                </div>

                <span className="text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                    View project
                </span>
            </div>
        </Link>
    );
};

export default ProjectCard;