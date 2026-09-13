import {
    SearchIcon,
    PanelLeft,
    MoonIcon,
    SunIcon,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/themeSlice';
import { assets } from '../assets/assets';

const Navbar = ({ setIsSidebarOpen }) => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);

    return (
        <header className="sticky top-0 z-30 w-full shrink-0 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6 xl:px-10">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    {/* Mobile Sidebar Button */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsSidebarOpen((prev) => !prev)
                        }
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white sm:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <PanelLeft className="size-4" />
                    </button>

                    {/* Search */}
                    <div className="relative w-full max-w-md">
                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />

                        <input
                            type="text"
                            placeholder="Search projects, tasks..."
                            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:hover:border-zinc-700 dark:focus:border-blue-500 dark:focus:bg-zinc-900"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex shrink-0 items-center gap-2.5">
                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={() => dispatch(toggleTheme())}
                        className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <MoonIcon className="size-4" />
                        ) : (
                            <SunIcon className="size-4 text-amber-400" />
                        )}
                    </button>

                    {/* Divider */}
                    <div className="hidden h-7 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />

                    {/* User Avatar */}
                    <button
                        type="button"
                        className="rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-blue-500/30 active:scale-95"
                        aria-label="User profile"
                    >
                        <img
                            src={assets.profile_img_a}
                            alt="User Avatar"
                            className="size-9 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;