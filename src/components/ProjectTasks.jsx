import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask } from "../features/workspaceSlice";
import {
    Bug,
    CalendarIcon,
    GitCommit,
    MessageSquare,
    Square,
    Trash2,
    XIcon,
    Zap,
    ListTodo,
} from "lucide-react";

const typeIcons = {
    BUG: {
        icon: Bug,
        color: "text-red-600 dark:text-red-400",
        background: "bg-red-50 dark:bg-red-500/10",
    },
    FEATURE: {
        icon: Zap,
        color: "text-blue-600 dark:text-blue-400",
        background: "bg-blue-50 dark:bg-blue-500/10",
    },
    TASK: {
        icon: Square,
        color: "text-emerald-600 dark:text-emerald-400",
        background: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    IMPROVEMENT: {
        icon: GitCommit,
        color: "text-purple-600 dark:text-purple-400",
        background: "bg-purple-50 dark:bg-purple-500/10",
    },
    OTHER: {
        icon: MessageSquare,
        color: "text-amber-600 dark:text-amber-400",
        background: "bg-amber-50 dark:bg-amber-500/10",
    },
};

const priorityStyles = {
    LOW: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    MEDIUM:
        "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    HIGH: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const statusOptions = [
    { label: "To Do", value: "TODO" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Done", value: "DONE" },
];

const ProjectTasks = ({ tasks = [] }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedTasks, setSelectedTasks] = useState([]);

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        priority: "",
        assignee: "",
    });

    const assigneeList = useMemo(
        () =>
            Array.from(
                new Set(
                    tasks
                        .map((task) => task.assignee?.name)
                        .filter(Boolean)
                )
            ),
        [tasks]
    );

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const { status, type, priority, assignee } = filters;

            return (
                (!status || task.status === status) &&
                (!type || task.type === type) &&
                (!priority || task.priority === priority) &&
                (!assignee || task.assignee?.name === assignee)
            );
        });
    }, [filters, tasks]);

    const filteredTaskIds = useMemo(
        () => filteredTasks.map((task) => task.id),
        [filteredTasks]
    );

    const allFilteredSelected =
        filteredTasks.length > 0 &&
        filteredTasks.every((task) => selectedTasks.includes(task.id));

    const hasFilters =
        filters.status ||
        filters.type ||
        filters.priority ||
        filters.assignee;

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            status: "",
            type: "",
            priority: "",
            assignee: "",
        });
    };

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId]
        );
    };

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedTasks((prev) =>
                prev.filter((id) => !filteredTaskIds.includes(id))
            );
        } else {
            setSelectedTasks((prev) => [
                ...new Set([...prev, ...filteredTaskIds]),
            ]);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            toast.loading("Updating status...");

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const originalTask = tasks.find((task) => task.id === taskId);

            if (!originalTask) {
                throw new Error("Task not found");
            }

            const updatedTask = structuredClone(originalTask);
            updatedTask.status = newStatus;

            dispatch(updateTask(updatedTask));

            toast.dismiss();
            toast.success("Task status updated");
        } catch (error) {
            toast.dismiss();
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong"
            );
        }
    };

    const handleDelete = async () => {
        if (selectedTasks.length === 0) return;

        try {
            const confirmed = window.confirm(
                `Are you sure you want to delete ${selectedTasks.length} selected ${
                    selectedTasks.length === 1 ? "task" : "tasks"
                }?`
            );

            if (!confirmed) return;

            toast.loading("Deleting tasks...");

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            dispatch(deleteTask(selectedTasks));
            setSelectedTasks([]);

            toast.dismiss();
            toast.success(
                `${selectedTasks.length === 1 ? "Task" : "Tasks"} deleted successfully`
            );
        } catch (error) {
            toast.dismiss();
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong"
            );
        }
    };

    const formatDueDate = (date) => {
        if (!date) return "No due date";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Invalid date";
        }

        return format(parsedDate, "dd MMM");
    };

    const getTypeConfig = (type) => {
        return (
            typeIcons[type] || {
                icon: MessageSquare,
                color: "text-zinc-500 dark:text-zinc-400",
                background: "bg-zinc-100 dark:bg-zinc-800",
            }
        );
    };

    return (
        <div className="space-y-5">
            {/* Toolbar */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4">
                    {/* Toolbar heading */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <ListTodo className="size-4" />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    Tasks
                                </h3>

                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {filteredTasks.length}{" "}
                                    {filteredTasks.length === 1
                                        ? "task"
                                        : "tasks"}
                                </p>
                            </div>
                        </div>

                        {selectedTasks.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                    {selectedTasks.length} selected
                                </span>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                >
                                    <Trash2 className="size-3.5" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            "status",
                            "type",
                            "priority",
                            "assignee",
                        ].map((name) => {
                            const options = {
                                status: [
                                    {
                                        label: "All Statuses",
                                        value: "",
                                    },
                                    {
                                        label: "To Do",
                                        value: "TODO",
                                    },
                                    {
                                        label: "In Progress",
                                        value: "IN_PROGRESS",
                                    },
                                    {
                                        label: "Done",
                                        value: "DONE",
                                    },
                                ],

                                type: [
                                    {
                                        label: "All Types",
                                        value: "",
                                    },
                                    {
                                        label: "Task",
                                        value: "TASK",
                                    },
                                    {
                                        label: "Bug",
                                        value: "BUG",
                                    },
                                    {
                                        label: "Feature",
                                        value: "FEATURE",
                                    },
                                    {
                                        label: "Improvement",
                                        value: "IMPROVEMENT",
                                    },
                                    {
                                        label: "Other",
                                        value: "OTHER",
                                    },
                                ],

                                priority: [
                                    {
                                        label: "All Priorities",
                                        value: "",
                                    },
                                    {
                                        label: "Low",
                                        value: "LOW",
                                    },
                                    {
                                        label: "Medium",
                                        value: "MEDIUM",
                                    },
                                    {
                                        label: "High",
                                        value: "HIGH",
                                    },
                                ],

                                assignee: [
                                    {
                                        label: "All Assignees",
                                        value: "",
                                    },
                                    ...assigneeList.map((name) => ({
                                        label: name,
                                        value: name,
                                    })),
                                ],
                            };

                            return (
                                <select
                                    key={name}
                                    name={name}
                                    value={filters[name]}
                                    onChange={handleFilterChange}
                                    className="min-w-32 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                                >
                                    {options[name].map((option) => (
                                        <option
                                            key={`${name}-${option.value}`}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            );
                        })}

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                <XIcon className="size-3.5" />
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/60">
                            <tr>
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allFilteredSelected}
                                        onChange={toggleSelectAll}
                                        disabled={filteredTasks.length === 0}
                                        aria-label="Select all tasks"
                                        className="size-4 rounded accent-blue-600"
                                    />
                                </th>

                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                    Title
                                </th>

                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                    Type
                                </th>

                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                    Priority
                                </th>

                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                    Assignee
                                </th>

                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                    Due Date
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => {
                                    const {
                                        icon: Icon,
                                        color,
                                        background,
                                    } = getTypeConfig(task.type);

                                    return (
                                        <tr
                                            key={task.id}
                                            onClick={() =>
                                                navigate(
                                                    `/taskDetails?projectId=${task.projectId}&taskId=${task.id}`
                                                )
                                            }
                                            className="group cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        >
                                            {/* Checkbox */}
                                            <td
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="px-4 py-4"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTasks.includes(
                                                        task.id
                                                    )}
                                                    onChange={() =>
                                                        toggleTaskSelection(
                                                            task.id
                                                        )
                                                    }
                                                    aria-label={`Select ${task.title}`}
                                                    className="size-4 rounded accent-blue-600"
                                                />
                                            </td>

                                            {/* Title */}
                                            <td className="max-w-64 px-4 py-4">
                                                <p className="truncate text-sm font-medium text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                                                    {task.title}
                                                </p>
                                            </td>

                                            {/* Type */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`flex size-7 items-center justify-center rounded-lg ${background}`}
                                                    >
                                                        <Icon
                                                            className={`size-3.5 ${color}`}
                                                        />
                                                    </span>

                                                    <span
                                                        className={`text-xs font-medium ${color}`}
                                                    >
                                                        {task.type || "OTHER"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Priority */}
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                        priorityStyles[
                                                            task.priority
                                                        ] ||
                                                        priorityStyles.LOW
                                                    }`}
                                                >
                                                    {task.priority || "LOW"}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="px-4 py-4"
                                            >
                                                <select
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            task.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                                                >
                                                    {statusOptions.map(
                                                        (option) => (
                                                            <option
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </td>

                                            {/* Assignee */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {task.assignee?.image ? (
                                                        <img
                                                            src={
                                                                task.assignee
                                                                    .image
                                                            }
                                                            className="size-7 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
                                                            alt={
                                                                task.assignee
                                                                    ?.name ||
                                                                "Assignee"
                                                            }
                                                        />
                                                    ) : (
                                                        <div className="flex size-7 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                                            {task.assignee?.name
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                "?"}
                                                        </div>
                                                    )}

                                                    <span className="max-w-28 truncate text-xs text-zinc-600 dark:text-zinc-400">
                                                        {task.assignee?.name ||
                                                            "Unassigned"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Due Date */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                                                    <CalendarIcon className="size-3.5" />

                                                    {formatDueDate(
                                                        task.due_date
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-14 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                                                <ListTodo className="size-5" />
                                            </div>

                                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                No tasks found
                                            </p>

                                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                Try changing your filters to
                                                see more tasks.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Task Cards */}
            <div className="flex flex-col gap-3 lg:hidden">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => {
                        const {
                            icon: Icon,
                            color,
                            background,
                        } = getTypeConfig(task.type);

                        return (
                            <div
                                key={task.id}
                                onClick={() =>
                                    navigate(
                                        `/taskDetails?projectId=${task.projectId}&taskId=${task.id}`
                                    )
                                }
                                className="cursor-pointer rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${background}`}
                                        >
                                            <Icon
                                                className={`size-4 ${color}`}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                {task.title}
                                            </h3>

                                            <p
                                                className={`mt-1 text-[11px] font-medium ${color}`}
                                            >
                                                {task.type || "OTHER"}
                                            </p>
                                        </div>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={selectedTasks.includes(
                                            task.id
                                        )}
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                        onChange={() =>
                                            toggleTaskSelection(task.id)
                                        }
                                        aria-label={`Select ${task.title}`}
                                        className="mt-1 size-4 shrink-0 rounded accent-blue-600"
                                    />
                                </div>

                                {/* Priority */}
                                <div className="mt-4">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                            priorityStyles[task.priority] ||
                                            priorityStyles.LOW
                                        }`}
                                    >
                                        {task.priority || "LOW"} Priority
                                    </span>
                                </div>

                                {/* Status */}
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-4"
                                >
                                    <label className="mb-1.5 block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                                        Status
                                    </label>

                                    <select
                                        value={task.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                task.id,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                                    >
                                        {statusOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Footer Metadata */}
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        {task.assignee?.image ? (
                                            <img
                                                src={task.assignee.image}
                                                className="size-6 rounded-full object-cover"
                                                alt={
                                                    task.assignee?.name ||
                                                    "Assignee"
                                                }
                                            />
                                        ) : (
                                            <div className="flex size-6 items-center justify-center rounded-full bg-zinc-100 text-[9px] font-semibold text-zinc-500 dark:bg-zinc-800">
                                                {task.assignee?.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "?"}
                                            </div>
                                        )}

                                        <span className="max-w-32 truncate text-xs text-zinc-600 dark:text-zinc-400">
                                            {task.assignee?.name ||
                                                "Unassigned"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                        <CalendarIcon className="size-3.5" />
                                        {formatDueDate(task.due_date)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                            <ListTodo className="size-5" />
                        </div>

                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            No tasks found
                        </p>

                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Try changing your filters to see more tasks.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectTasks;