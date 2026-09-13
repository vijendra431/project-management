import { format } from "date-fns";
import { Plus, Save, Users, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import AddProjectMember from "./AddProjectMember";

export default function ProjectSettings({ project }) {
    const [formData, setFormData] = useState({
        name: "New Website Launch",
        description: "Initial launch for new web platform.",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "2025-09-10",
        end_date: "2025-10-15",
        progress: 30,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const members = project?.members || [];

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                status: project.status || "PLANNING",
                priority: project.priority || "MEDIUM",
                start_date: project.start_date || "",
                end_date: project.end_date || "",
                progress: Number(project.progress) || 0,
            });
        }
    }, [project]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            // Add your API update logic here
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const formatDateValue = (value) => {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return format(date, "yyyy-MM-dd");
    };

    const inputClasses =
        "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500";

    const labelClasses =
        "text-sm font-medium text-zinc-700 dark:text-zinc-300";

    if (!project) {
        return (
            <div className="flex min-h-60 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Project information is unavailable.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
            {/* Project Details */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {/* Card Header */}
                <div className="border-b border-zinc-200 px-5 py-5 dark:border-zinc-800 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <CalendarDays className="size-5" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                Project Details
                            </h2>

                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Update project information and timeline
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5 sm:p-6"
                >
                    {/* Project Name */}
                    <div>
                        <label className={labelClasses}>
                            Project Name
                        </label>

                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            className={inputClasses}
                            placeholder="Enter project name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClasses}>
                            Description
                        </label>

                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            className={`${inputClasses} min-h-28 resize-y`}
                            placeholder="Describe your project..."
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelClasses}>Status</label>

                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    handleChange("status", e.target.value)
                                }
                                className={inputClasses}
                            >
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}>Priority</label>

                            <select
                                value={formData.priority}
                                onChange={(e) =>
                                    handleChange("priority", e.target.value)
                                }
                                className={inputClasses}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <CalendarDays className="size-4 text-zinc-400" />

                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Project Timeline
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className={labelClasses}>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={formatDateValue(
                                        formData.start_date
                                    )}
                                    onChange={(e) =>
                                        handleChange(
                                            "start_date",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    value={formatDateValue(
                                        formData.end_date
                                    )}
                                    min={formatDateValue(
                                        formData.start_date
                                    )}
                                    onChange={(e) =>
                                        handleChange(
                                            "end_date",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                        <div className="mb-3 flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Project Progress
                            </label>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                {formData.progress}%
                            </span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={formData.progress}
                            onChange={(e) =>
                                handleChange(
                                    "progress",
                                    Number(e.target.value)
                                )
                            }
                            className="w-full accent-blue-600"
                        />

                        <div className="mt-2 flex justify-between text-[11px] text-zinc-400">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end border-t border-zinc-200 pt-5 dark:border-zinc-800">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save className="size-4" />

                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Team Members */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-5 dark:border-zinc-800 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                            <Users className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                Team Members
                            </h2>

                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                {members.length}{" "}
                                {members.length === 1
                                    ? "member"
                                    : "members"}{" "}
                                assigned
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsDialogOpen(true)}
                        aria-label="Add project member"
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    >
                        <Plus className="size-4" />
                    </button>

                    <AddProjectMember
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                    />
                </div>

                {/* Member List */}
                <div className="p-5 sm:p-6">
                    {members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-5 py-10 text-center dark:border-zinc-700">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                                <Users className="size-5" />
                            </div>

                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                No team members
                            </p>

                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Add members to collaborate on this project.
                            </p>

                            <button
                                type="button"
                                onClick={() => setIsDialogOpen(true)}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                            >
                                <Plus className="size-3.5" />
                                Add Member
                            </button>
                        </div>
                    ) : (
                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                            {members.map((member, index) => {
                                const email =
                                    member?.user?.email || "Unknown member";

                                const isTeamLead =
                                    project.team_lead === member?.user?.id;

                                return (
                                    <div
                                        key={member?.user?.id || index}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                                                {email
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <span className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                {email}
                                            </span>
                                        </div>

                                        {isTeamLead && (
                                            <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                                                Team Lead
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}