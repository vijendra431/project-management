import { useEffect, useState } from 'react';
import {
    CheckSquareIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function MyTasksSidebar() {
    const user = { id: 'user_1' };

    const { currentWorkspace } = useSelector((state) => state.workspace);

    const [showMyTasks, setShowMyTasks] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const toggleMyTasks = () => {
        setShowMyTasks((prev) => !prev);
    };

    const getTaskStatusColor = (status) => {
        switch (status) {
            case 'DONE':
                return 'bg-emerald-500';
            case 'IN_PROGRESS':
                return 'bg-amber-500';
            case 'TODO':
                return 'bg-zinc-400 dark:bg-zinc-600';
            default:
                return 'bg-zinc-300 dark:bg-zinc-700';
        }
    };

    const fetchUserTasks = () => {
        const userId = user?.id || '';

        if (!userId || !currentWorkspace) {
            setMyTasks([]);
            return;
        }

        const currentWorkspaceTasks = currentWorkspace.projects.flatMap(
            (project) =>
                project.tasks
                    .filter((task) => task?.assignee?.id === userId)
                    .map((task) => ({
                        ...task,
                        projectId: task.projectId || project.id,
                    }))
        );

        setMyTasks(currentWorkspaceTasks);
    };

    useEffect(() => {
        fetchUserTasks();
    }, [currentWorkspace]);

    return (
        <div className="mt-5 px-3">
            {/* Header */}
            <button
                type="button"
                onClick={toggleMyTasks}
                className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
            >
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                        <CheckSquareIcon className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>

                    <h3 className="truncate text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                        My Tasks
                    </h3>

                    <span className="flex min-w-5 items-center justify-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {myTasks.length}
                    </span>
                </div>

                {showMyTasks ? (
                    <ChevronDownIcon className="size-4 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
                ) : (
                    <ChevronRightIcon className="size-4 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
                )}
            </button>

            {/* Tasks */}
            {showMyTasks && (
                <div className="mt-2 pl-2">
                    {myTasks.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-3 py-4 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                            <CheckSquareIcon className="mx-auto mb-2 size-4 text-zinc-400 dark:text-zinc-600" />

                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                                No tasks assigned
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {myTasks.map((task, index) => (
                                <Link
                                    key={task.id || index}
                                    to={`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`}
                                    className="group block rounded-xl transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                                >
                                    <div className="flex w-full min-w-0 items-center gap-2.5 px-3 py-2.5">
                                        {/* Status indicator */}
                                        <div
                                            className={`size-2 shrink-0 rounded-full ${getTaskStatusColor(
                                                task.status
                                            )}`}
                                        />

                                        {/* Task information */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-medium text-zinc-700 transition-colors group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-white">
                                                {task.title}
                                            </p>

                                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                                {task.status
                                                    ?.replace('_', ' ')
                                                    .toLowerCase()}
                                            </p>
                                        </div>

                                        <ChevronRightIcon className="size-3.5 shrink-0 text-zinc-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-zinc-600" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MyTasksSidebar;