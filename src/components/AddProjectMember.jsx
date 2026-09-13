import { useState } from "react";
import { Mail, UserPlus, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }) => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const currentWorkspace = useSelector(
        (state) => state.workspace?.currentWorkspace || null
    );

    const project = currentWorkspace?.projects?.find((p) => p.id === id);

    const projectMembersEmails =
        project?.members?.map((member) => member.user.email) || [];

    const [email, setEmail] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) return;

        setIsAdding(true);

        try {
            // Add API logic here
        } finally {
            setIsAdding(false);
        }
    };

    if (!isDialogOpen) return null;

    const availableMembers =
        currentWorkspace?.members?.filter(
            (member) => !projectMembersEmails.includes(member.user.email)
        ) || [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setIsDialogOpen(false)}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
                    <div className="flex gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                            <UserPlus className="size-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                Add project member
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Add an existing workspace member to this project.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                        aria-label="Close dialog"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Project info */}
                <div className="px-6 pt-5">
                    {project && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
                            <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                                Project
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-zinc-900 dark:text-white">
                                {project.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="project-member"
                            className="text-sm font-medium text-zinc-900 dark:text-zinc-200"
                        >
                            Select workspace member
                        </label>

                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <select
                                id="project-member"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 w-full appearance-none rounded-xl border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                                <option value="">Select a member</option>

                                {availableMembers.map((member) => (
                                    <option
                                        key={member.user.id}
                                        value={member.user.email}
                                    >
                                        {member.user.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {availableMembers.length === 0 && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                All workspace members are already part of this project.
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
                                isAdding ||
                                !email ||
                                !currentWorkspace ||
                                availableMembers.length === 0
                            }
                            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isAdding ? "Adding..." : "Add member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectMember;