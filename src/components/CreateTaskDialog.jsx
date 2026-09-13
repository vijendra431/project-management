import { useState } from "react";
import {
    Calendar as CalendarIcon,
    ClipboardPlus,
    XIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

export default function CreateTaskDialog({
    showCreateTask,
    setShowCreateTask,
    projectId,
}) {
    const currentWorkspace = useSelector(
        (state) => state.workspace?.currentWorkspace || null
    );

    const project = currentWorkspace?.projects?.find(
        (p) => p.id === projectId
    );

    const teamMembers = project?.members || [];

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "TASK",
        status: "TODO",
        priority: "MEDIUM",
        assigneeId: "",
        due_date: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            // Add API logic here
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!showCreateTask) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setShowCreateTask(false)}
        >
            <div
                className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
                    <div className="flex gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                            <ClipboardPlus className="size-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                Create new task
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                {project
                                    ? `Add a task to ${project.name}`
                                    : "Add a new task to your project"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowCreateTask(false)}
                        className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                        aria-label="Close dialog"
                    >
                        <XIcon className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    Task information
                                </h3>

                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    Add the details and description for this
                                    task.
                                </p>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="task-title"
                                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                                >
                                    Task title
                                </label>

                                <input
                                    id="task-title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Build login page"
                                    className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="task-description"
                                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="task-description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Describe what needs to be done..."
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                />
                            </div>
                        </div>

                        {/* Task Settings */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    Task settings
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                        Type
                                    </label>

                                    <select
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                type: e.target.value,
                                            })
                                        }
                                        className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    >
                                        <option value="TASK">Task</option>
                                        <option value="BUG">Bug</option>
                                        <option value="FEATURE">
                                            Feature
                                        </option>
                                        <option value="IMPROVEMENT">
                                            Improvement
                                        </option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                        Priority
                                    </label>

                                    <select
                                        value={formData.priority}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                priority: e.target.value,
                                            })
                                        }
                                        className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>

                                {/* Assignee */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                        Assignee
                                    </label>

                                    <select
                                        value={formData.assigneeId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                assigneeId: e.target.value,
                                            })
                                        }
                                        className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    >
                                        <option value="">
                                            Unassigned
                                        </option>

                                        {teamMembers.map((member) => (
                                            <option
                                                key={member?.user?.id}
                                                value={member?.user?.id}
                                            >
                                                {member?.user?.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                        Status
                                    </label>

                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value,
                                            })
                                        }
                                        className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">
                                            In Progress
                                        </option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="size-4 text-zinc-500 dark:text-zinc-400" />

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        Deadline
                                    </h3>

                                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                        Set a due date for this task.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="due-date"
                                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                                >
                                    Due date
                                </label>

                                <input
                                    id="due-date"
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            due_date: e.target.value,
                                        })
                                    }
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                />

                                {formData.due_date && (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Due on{" "}
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {format(
                                                new Date(formData.due_date),
                                                "PPP"
                                            )}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setShowCreateTask(false)}
                                className="h-11 rounded-xl border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}