import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Calendar,
    UsersIcon,
    FolderOpen,
} from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";

const ProjectOverview = () => {
    const statusColors = {
        PLANNING:
            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        ACTIVE:
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
        ON_HOLD:
            "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
        COMPLETED:
            "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
        CANCELLED:
            "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    };

    const priorityColors = {
        LOW: "border-zinc-400 bg-zinc-400",
        MEDIUM: "border-amber-500 bg-amber-500",
        HIGH: "border-red-500 bg-red-500",
    };

    const currentWorkspace = useSelector(
        (state) => state?.workspace?.currentWorkspace || null
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(currentWorkspace?.projects || []);
    }, [currentWorkspace]);

    if (!currentWorkspace) return null;

    const formatStatus = (status) => {
        if (!status) return "Unknown";

        return status
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getProgress = (progress) => {
        const value = Number(progress) || 0;
        return Math.min(100, Math.max(0, value));
    };

    const formatDate = (date) => {
        if (!date) return null;

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        return format(parsedDate, "MMM d, yyyy");
    };

    return (
        <>
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            Project Overview
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Track your latest projects and their progress
                        </p>
                    </div>

                    <Link
                        to="/projects"
                        className="group flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                    >
                        <span>View all</span>

                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {/* Content */}
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            <FolderOpen className="size-8" />
                        </div>

                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            No projects yet
                        </h3>

                        <p className="mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                            Create your first project and start organizing
                            your tasks and team.
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(true)}
                            className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.98]"
                        >
                            Create your first project
                        </button>

                        <CreateProjectDialog
                            isDialogOpen={isDialogOpen}
                            setIsDialogOpen={setIsDialogOpen}
                        />
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {projects.slice(0, 5).map((project) => {
                            const progress = getProgress(project.progress);
                            const formattedDate = formatDate(project.end_date);

                            return (
                                <Link
                                    key={project.id}
                                    to={`/projectsDetail?id=${project.id}&tab=tasks`}
                                    className="group block px-4 py-5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 sm:px-6"
                                >
                                    {/* Project title + status */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate text-sm font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 sm:text-base">
                                                    {project.name}
                                                </h3>

                                                <ArrowRight className="hidden size-4 shrink-0 text-zinc-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
                                            </div>

                                            <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                                                {project.description ||
                                                    "No description available"}
                                            </p>
                                        </div>

                                        {/* Status + priority */}
                                        <div className="flex shrink-0 items-center gap-2">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                    statusColors[
                                                        project.status
                                                    ] ||
                                                    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                                }`}
                                            >
                                                {formatStatus(project.status)}
                                            </span>

                                            {project.priority && (
                                                <span
                                                    title={`Priority: ${formatStatus(
                                                        project.priority
                                                    )}`}
                                                    className={`size-2.5 rounded-full border-2 ${
                                                        priorityColors[
                                                            project.priority
                                                        ] ||
                                                        "border-zinc-400 bg-zinc-400"
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                                        {project.members?.length > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <UsersIcon className="size-3.5" />
                                                <span>
                                                    {project.members.length}{" "}
                                                    {project.members.length ===
                                                    1
                                                        ? "member"
                                                        : "members"}
                                                </span>
                                            </div>
                                        )}

                                        {formattedDate && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5" />
                                                <span>
                                                    Due {formattedDate}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-zinc-500 dark:text-zinc-400">
                                                Progress
                                            </span>

                                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                                {progress}%
                                            </span>
                                        </div>

                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                            <div
                                                className="h-full rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-500"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </>
    );
};

export default ProjectOverview;