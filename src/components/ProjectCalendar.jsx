import { useState } from "react";
import {
    format,
    isSameDay,
    isBefore,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
    subMonths,
} from "date-fns";
import {
    CalendarIcon,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const typeColors = {
    BUG: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    FEATURE:
        "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    TASK: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    IMPROVEMENT:
        "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    OTHER: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
};

const priorityBorders = {
    LOW: "border-l-emerald-500",
    MEDIUM: "border-l-blue-500",
    HIGH: "border-l-red-500",
};

const ProjectCalendar = ({ tasks = [] }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const today = new Date();

    const getTaskDate = (task) => {
        if (!task?.due_date) return null;

        const date = new Date(task.due_date);

        return Number.isNaN(date.getTime()) ? null : date;
    };

    const getTasksForDate = (date) => {
        return tasks.filter((task) => {
            const taskDate = getTaskDate(task);

            return taskDate && isSameDay(taskDate, date);
        });
    };

    const upcomingTasks = tasks
        .filter((task) => {
            const taskDate = getTaskDate(task);

            return (
                taskDate &&
                !isBefore(taskDate, today) &&
                task.status !== "DONE"
            );
        })
        .sort(
            (a, b) =>
                getTaskDate(a).getTime() - getTaskDate(b).getTime()
        )
        .slice(0, 5);

    const overdueTasks = tasks.filter((task) => {
        const taskDate = getTaskDate(task);

        return (
            taskDate &&
            isBefore(taskDate, today) &&
            task.status !== "DONE"
        );
    });

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const handleMonthChange = (direction) => {
        setCurrentMonth((prev) =>
            direction === "next"
                ? addMonths(prev, 1)
                : subMonths(prev, 1)
        );
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Calendar Section */}
            <div className="xl:col-span-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                    {/* Calendar Header */}
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                                <CalendarIcon className="size-4 text-blue-600 dark:text-blue-400" />
                            </div>

                            <div className="hidden sm:block">
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    Task Calendar
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                    View tasks by due date
                                </p>
                            </div>
                        </div>

                        {/* Month Navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleMonthChange("prev")}
                                className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                                aria-label="Previous month"
                            >
                                <ChevronLeft className="size-4" />
                            </button>

                            <span className="min-w-[120px] text-center text-sm font-semibold text-zinc-900 dark:text-white">
                                {format(currentMonth, "MMMM yyyy")}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleMonthChange("next")}
                                className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                                aria-label="Next month"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Week Days */}
                    <div className="mb-2 grid grid-cols-7">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                        {daysInMonth.map((day) => {
                            const dayTasks = getTasksForDate(day);
                            const isSelected = isSameDay(
                                day,
                                selectedDate
                            );

                            const hasOverdue = dayTasks.some((task) => {
                                const taskDate = getTaskDate(task);

                                return (
                                    taskDate &&
                                    task.status !== "DONE" &&
                                    isBefore(taskDate, today)
                                );
                            });

                            const isToday = isSameDay(day, today);

                            return (
                                <button
                                    type="button"
                                    key={day.toISOString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        relative flex min-h-12 flex-col items-center justify-center rounded-xl border p-1 transition-all duration-200 sm:min-h-16
                                        ${
                                            isSelected
                                                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-400"
                                                : "border-transparent bg-zinc-50 text-zinc-700 hover:border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                                        }
                                        ${
                                            hasOverdue && !isSelected
                                                ? "border-red-200 dark:border-red-500/40"
                                                : ""
                                        }
                                    `}
                                >
                                    {/* Today indicator */}
                                    {isToday && (
                                        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-blue-500" />
                                    )}

                                    <span className="text-sm font-semibold">
                                        {format(day, "d")}
                                    </span>

                                    {dayTasks.length > 0 && (
                                        <span
                                            className={`mt-0.5 text-[9px] font-medium sm:text-[10px] ${
                                                isSelected
                                                    ? "text-blue-600 dark:text-blue-400"
                                                    : "text-zinc-400 dark:text-zinc-500"
                                            }`}
                                        >
                                            {dayTasks.length}{" "}
                                            {dayTasks.length === 1
                                                ? "task"
                                                : "tasks"}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Day Tasks */}
                {getTasksForDate(selectedDate).length > 0 && (
                    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <div className="mb-5">
                            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                                Tasks for{" "}
                                {format(selectedDate, "MMM d, yyyy")}
                            </h3>

                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                                {getTasksForDate(selectedDate).length}{" "}
                                {getTasksForDate(selectedDate).length === 1
                                    ? "task"
                                    : "tasks"}{" "}
                                scheduled
                            </p>
                        </div>

                        <div className="space-y-3">
                            {getTasksForDate(selectedDate).map((task) => (
                                <div
                                    key={task.id}
                                    className={`rounded-xl border border-zinc-200 border-l-4 bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 ${
                                        priorityBorders[task.priority] ||
                                        "border-l-zinc-400"
                                    }`}
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <h4 className="min-w-0 text-sm font-semibold text-zinc-900 dark:text-white">
                                            {task.title}
                                        </h4>

                                        <span
                                            className={`w-fit shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                                typeColors[task.type] ||
                                                typeColors.OTHER
                                            }`}
                                        >
                                            {task.type || "OTHER"}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                                        <span className="capitalize">
                                            {task.priority?.toLowerCase() ||
                                                "medium"}{" "}
                                            priority
                                        </span>

                                        {task.assignee && (
                                            <span className="flex items-center gap-1.5">
                                                <User className="size-3.5" />
                                                {task.assignee.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Upcoming Tasks */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                            </div>

                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                Upcoming Tasks
                            </h3>
                        </div>

                        {upcomingTasks.length > 0 && (
                            <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                {upcomingTasks.length}
                            </span>
                        )}
                    </div>

                    {upcomingTasks.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center dark:border-zinc-800 dark:bg-zinc-800/30">
                            <Clock className="mx-auto mb-2 size-5 text-zinc-300 dark:text-zinc-600" />
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                                No upcoming tasks
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {upcomingTasks.map((task) => {
                                const taskDate = getTaskDate(task);

                                return (
                                    <div
                                        key={task.id}
                                        className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="min-w-0 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                {task.title}
                                            </span>

                                            <span
                                                className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${
                                                    typeColors[task.type] ||
                                                    typeColors.OTHER
                                                }`}
                                            >
                                                {task.type || "OTHER"}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-500">
                                            {taskDate &&
                                                format(
                                                    taskDate,
                                                    "MMM d, yyyy"
                                                )}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                    <div className="rounded-2xl border border-red-200 border-l-4 border-l-red-500 bg-white p-5 shadow-sm dark:border-red-500/30 dark:border-l-red-500 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
                                <Clock className="size-4 text-red-600 dark:text-red-400" />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                                    Overdue Tasks
                                </h3>

                                <p className="text-[10px] text-red-500/80 dark:text-red-400/70">
                                    {overdueTasks.length}{" "}
                                    {overdueTasks.length === 1
                                        ? "task needs"
                                        : "tasks need"}{" "}
                                    attention
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {overdueTasks.slice(0, 5).map((task) => {
                                const taskDate = getTaskDate(task);

                                return (
                                    <div
                                        key={task.id}
                                        className="rounded-xl border border-red-100 bg-red-50/70 p-3 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 dark:hover:bg-red-500/10"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="min-w-0 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                {task.title}
                                            </span>

                                            <span className="shrink-0 rounded-md bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold text-red-700 dark:bg-red-500/20 dark:text-red-400">
                                                {task.type || "OTHER"}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                                            Due{" "}
                                            {taskDate &&
                                                format(
                                                    taskDate,
                                                    "MMM d, yyyy"
                                                )}
                                        </p>
                                    </div>
                                );
                            })}

                            {overdueTasks.length > 5 && (
                                <p className="pt-1 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
                                    +{overdueTasks.length - 5} more overdue
                                    tasks
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCalendar;