import { useState } from "react";
import { Mail, UserPlus, XIcon } from "lucide-react";
import { useSelector } from "react-redux";

const InviteMemberDialog = ({ isDialogOpen, setIsDialogOpen }) => {
    const currentWorkspace = useSelector(
        (state) => state.workspace?.currentWorkspace || null
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        role: "org:member",
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

    if (!isDialogOpen) return null;

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
                                Invite team member
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Send an invitation to join your workspace.
                            </p>
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

                {/* Workspace Info */}
                {currentWorkspace && (
                    <div className="px-6 pt-5">
                        <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
                            <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                                Workspace
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-zinc-900 dark:text-white">
                                {currentWorkspace.name}
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >
                    {/* Email */}
                    <div className="space-y-2">
                        <label
                            htmlFor="invite-email"
                            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                        >
                            Email address
                        </label>

                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="invite-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="name@example.com"
                                className="h-11 w-full rounded-xl border border-zinc-300 bg-white pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label
                            htmlFor="invite-role"
                            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                        >
                            Role
                        </label>

                        <select
                            id="invite-role"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                })
                            }
                            className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            <option value="org:member">Member</option>
                            <option value="org:admin">Admin</option>
                        </select>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Admins can manage workspace settings and members.
                        </p>
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
                                ? "Sending..."
                                : "Send invitation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberDialog;