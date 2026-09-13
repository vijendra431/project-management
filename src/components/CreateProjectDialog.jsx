import { useState } from "react";
import {
    XIcon,
    FolderPlus,
    CalendarDays,
    Users,
} from "lucide-react";
import { useSelector } from "react-redux";

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {
    const { currentWorkspace } = useSelector((state) => state.workspace);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "",
        end_date: "",
        team_members: [],
        team_lead: "",
        progress: 0,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            // Add API logic here
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeTeamMember = (email) => {
        setFormData((prev) => ({
            ...prev,
            team_members: prev.team_members.filter((m) => m !== email),
        }));
    };

    if (!isDialogOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setIsDialogOpen(false)}
        >
            <div
                className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
                    <div className="flex gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                            <FolderPlus className="size-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                Create new project
                            </h2>

                            {currentWorkspace && (
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    Create a project in{" "}
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                        {currentWorkspace.name}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                        aria-label="Close dialog"
                    >
                        <XIcon className="size-5" />
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">

                        {/* Project Information */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    Project information
                                </h3>

                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    Add the basic details for your project.
                                </p>
                            </div>

                            {/* Project Name */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="project-name"
                                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                                >
                                    Project name
                                </label>

                                <input
                                    id="project-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. E-commerce platform"
                                    className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="project-description"
                                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="project-description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Describe what this project is about..."
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                />
                            </div>
                        </div>

                        {/* Status & Priority */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    Project settings
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                        <option value="PLANNING">
                                            Planning
                                        </option>
                                        <option value="ACTIVE">
                                            Active
                                        </option>
                                        <option value="COMPLETED">
                                            Completed
                                        </option>
                                        <option value="ON_HOLD">
                                            On Hold
                                        </option>
                                        <option value="CANCELLED">
                                            Cancelled
                                        </option>
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
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-zinc-500" />

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        Project timeline
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Start Date */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="start-date"
                                        className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                                    >
                                        Start date
                                    </label>

                                    <input
                                        id="start-date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                start_date: e.target.value,
                                            })
                                        }
                                        className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="end-date"
                                        className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                                    >
                                        End date
                                    </label>

                                    <input
                                        id="end-date"
                                        type="date"
                                        value={formData.end_date}
                                        min={
                                            formData.start_date ||
                                            undefined
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                end_date: e.target.value,
                                            })
                                        }
                                        className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Team */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Users className="size-4 text-zinc-500" />

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        Team
                                    </h3>

                                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                        Assign a lead and team members.
                                    </p>
                                </div>
                            </div>

                            {/* Project Lead */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    Project lead
                                </label>

                                <select
                                    value={formData.team_lead}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            team_lead: e.target.value,
                                            team_members: e.target.value
                                                ? [
                                                      ...new Set([
                                                          ...formData.team_members,
                                                          e.target.value,
                                                      ]),
                                                  ]
                                                : formData.team_members,
                                        })
                                    }
                                    className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                >
                                    <option value="">No lead</option>

                                    {currentWorkspace?.members?.map(
                                        (member) => (
                                            <option
                                                key={member.user.email}
                                                value={member.user.email}
                                            >
                                                {member.user.email}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Team Members */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    Team members
                                </label>

                                <select
                                    value=""
                                    onChange={(e) => {
                                        if (
                                            e.target.value &&
                                            !formData.team_members.includes(
                                                e.target.value
                                            )
                                        ) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                team_members: [
                                                    ...prev.team_members,
                                                    e.target.value,
                                                ],
                                            }));
                                        }
                                    }}
                                    className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                >
                                    <option value="">
                                        Add team members
                                    </option>

                                    {currentWorkspace?.members
                                        ?.filter(
                                            (member) =>
                                                !formData.team_members.includes(
                                                    member.user.email
                                                )
                                        )
                                        .map((member) => (
                                            <option
                                                key={member.user.email}
                                                value={member.user.email}
                                            >
                                                {member.user.email}
                                            </option>
                                        ))}
                                </select>

                                {/* Selected Members */}
                                {formData.team_members.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {formData.team_members.map(
                                            (email) => (
                                                <div
                                                    key={email}
                                                    className="flex max-w-full items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                                                >
                                                    <span className="max-w-[220px] truncate">
                                                        {email}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTeamMember(
                                                                email
                                                            )
                                                        }
                                                        className="flex size-5 shrink-0 items-center justify-center rounded-md transition hover:bg-blue-100 dark:hover:bg-blue-500/20"
                                                        aria-label={`Remove ${email}`}
                                                    >
                                                        <XIcon className="size-3.5" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsDialogOpen(false)}
                                className="h-11 rounded-xl border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    isSubmitting || !currentWorkspace
                                }
                                className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create project"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectDialog;