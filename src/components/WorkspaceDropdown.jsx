import { useState, useRef, useEffect } from "react";
import {
    ChevronDown,
    Check,
    Plus,
    Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { dummyWorkspaces } from "../assets/assets";

function WorkspaceDropdown() {
    const { workspaces = [], currentWorkspace } = useSelector(
        (state) => state.workspace
    );

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSelectWorkspace = (workspaceId) => {
        dispatch(setCurrentWorkspace(workspaceId));
        setIsOpen(false);
        navigate("/");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // Close dropdown with Escape
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    const workspaceList =
        dummyWorkspaces?.length > 0
            ? dummyWorkspaces
            : workspaces;

    return (
        <div
            ref={dropdownRef}
            className="relative w-full"
        >
            {/* Workspace trigger */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
                {/* Workspace image */}
                {currentWorkspace?.image_url ? (
                    <img
                        src={currentWorkspace.image_url}
                        alt={currentWorkspace.name || "Workspace"}
                        className="size-9 shrink-0 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                    />
                ) : (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <Building2 className="size-4" />
                    </div>
                )}

                {/* Workspace information */}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {currentWorkspace?.name ||
                            "Select Workspace"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {workspaces.length}{" "}
                        {workspaces.length === 1
                            ? "workspace"
                            : "workspaces"}
                    </p>
                </div>

                {/* Chevron */}
                <ChevronDown
                    className={`size-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-[60] w-full min-w-64 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30">
                    {/* Header */}
                    <div className="border-b border-zinc-100 px-3 py-3 dark:border-zinc-800">
                        <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Switch workspace
                        </p>
                    </div>

                    {/* Workspace list */}
                    <div
                        className="max-h-64 overflow-y-auto p-2"
                        role="listbox"
                    >
                        {workspaceList.length === 0 ? (
                            <div className="px-3 py-6 text-center">
                                <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                    <Building2 className="size-4 text-zinc-400" />
                                </div>

                                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    No workspaces found
                                </p>
                            </div>
                        ) : (
                            workspaceList.map((workspace) => {
                                const isSelected =
                                    currentWorkspace?.id ===
                                    workspace.id;

                                return (
                                    <button
                                        type="button"
                                        key={workspace.id}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() =>
                                            onSelectWorkspace(
                                                workspace.id
                                            )
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors ${
                                            isSelected
                                                ? "bg-blue-50 dark:bg-blue-500/10"
                                                : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        {/* Image */}
                                        {workspace.image_url ? (
                                            <img
                                                src={
                                                    workspace.image_url
                                                }
                                                alt={workspace.name}
                                                className="size-8 shrink-0 rounded-lg object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                                            />
                                        ) : (
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                                <Building2 className="size-4 text-zinc-500" />
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate text-sm font-medium ${
                                                    isSelected
                                                        ? "text-blue-700 dark:text-blue-400"
                                                        : "text-zinc-800 dark:text-zinc-200"
                                                }`}
                                            >
                                                {workspace.name}
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                                                {workspace.membersCount ||
                                                    0}{" "}
                                                members
                                            </p>
                                        </div>

                                        {/* Selected */}
                                        {isSelected && (
                                            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                                                <Check className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Create workspace */}
                    <div className="border-t border-zinc-100 p-2 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                // Add create-workspace navigation/dialog here later.
                            }}
                            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        >
                            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <Plus className="size-4" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    Create Workspace
                                </p>

                                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                    Start a new workspace
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkspaceDropdown;