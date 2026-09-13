import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
    ChevronRightIcon,
    SettingsIcon,
    KanbanIcon,
    ChartColumnIcon,
    CalendarIcon,
    ArrowRightIcon,
    FolderKanban,
} from "lucide-react";
import { useSelector } from "react-redux";

const ProjectSidebar = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [expandedProjects, setExpandedProjects] = useState(new Set());

    const projects = useSelector(
        (state) =>
            state?.workspace?.currentWorkspace?.projects || []
    );

    const getProjectSubItems = (projectId) => [
        {
            title: "Tasks",
            icon: KanbanIcon,
            tab: "tasks",
            url: `/projectsDetail?id=${projectId}&tab=tasks`,
        },
        {
            title: "Analytics",
            icon: ChartColumnIcon,
            tab: "analytics",
            url: `/projectsDetail?id=${projectId}&tab=analytics`,
        },
        {
            title: "Calendar",
            icon: CalendarIcon,
            tab: "calendar",
            url: `/projectsDetail?id=${projectId}&tab=calendar`,
        },
        {
            title: "Settings",
            icon: SettingsIcon,
            tab: "settings",
            url: `/projectsDetail?id=${projectId}&tab=settings`,
        },
    ];

    const toggleProject = (id) => {
        setExpandedProjects((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const isProjectActive = (projectId) =>
        location.pathname === "/projectsDetail" &&
        searchParams.get("id") === projectId;

    return (
        <div className="mt-5 px-3">
            {/* Section Header */}
            <div className="mb-2 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                    <FolderKanban className="size-3.5 text-zinc-400" />

                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Projects
                    </h3>
                </div>

                <Link
                    to="/projects"
                    aria-label="View all projects"
                    className="flex size-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                    <ArrowRightIcon className="size-3.5" />
                </Link>
            </div>

            {/* Project List */}
            <div className="space-y-1">
                {projects.length === 0 ? (
                    <div className="mx-2 rounded-xl border border-dashed border-zinc-200 px-3 py-4 text-center dark:border-zinc-800">
                        <FolderKanban className="mx-auto mb-2 size-4 text-zinc-400" />

                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            No projects yet
                        </p>
                    </div>
                ) : (
                    projects.map((project) => {
                        const isExpanded = expandedProjects.has(project.id);
                        const isActive = isProjectActive(project.id);

                        return (
                            <div key={project.id}>
                                {/* Project */}
                                <button
                                    type="button"
                                    onClick={() => toggleProject(project.id)}
                                    className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                    }`}
                                >
                                    <ChevronRightIcon
                                        className={`size-3.5 shrink-0 text-zinc-400 transition-transform duration-200 ${
                                            isExpanded ? "rotate-90" : ""
                                        }`}
                                    />

                                    {/* Project Indicator */}
                                    <span
                                        className={`size-2 shrink-0 rounded-full ${
                                            isActive
                                                ? "bg-blue-500"
                                                : "bg-zinc-300 dark:bg-zinc-600"
                                        }`}
                                    />

                                    <span className="min-w-0 flex-1 truncate text-xs font-medium">
                                        {project.name}
                                    </span>

                                    {isActive && (
                                        <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
                                    )}
                                </button>

                                {/* Sub Items */}
                                {isExpanded && (
                                    <div className="relative ml-5 mt-1 space-y-0.5 border-l border-zinc-200 pl-2.5 dark:border-zinc-800">
                                        {getProjectSubItems(project.id).map(
                                            (subItem) => {
                                                const Icon = subItem.icon;

                                                const isSubItemActive =
                                                    location.pathname ===
                                                        "/projectsDetail" &&
                                                    searchParams.get("id") ===
                                                        project.id &&
                                                    searchParams.get("tab") ===
                                                        subItem.tab;

                                                return (
                                                    <Link
                                                        key={subItem.title}
                                                        to={subItem.url}
                                                        className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-all duration-200 ${
                                                            isSubItemActive
                                                                ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                                                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                                        }`}
                                                    >
                                                        <Icon
                                                            className={`size-3.5 ${
                                                                isSubItemActive
                                                                    ? "text-blue-600 dark:text-blue-400"
                                                                    : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                                                            }`}
                                                        />

                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProjectSidebar;