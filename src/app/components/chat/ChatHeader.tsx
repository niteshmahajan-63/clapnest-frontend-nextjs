import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';

const ChatHeader = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { logout: authLogout } = useAuth();
    const { leaveUserRoom } = useSocket();

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", closeMenu);
        return () => {
            document.removeEventListener("mousedown", closeMenu);
        };
    }, []);

    const handleLogout = async () => {
        authLogout();
        leaveUserRoom();
        router.push("/login");
    }

    return (
        <div className="flex justify-between bg-gray-800 text-white items-center p-4">
            <h5 className="text-lg font-semibold text-white">ClapNest</h5>
            {/* Three-dot options menu */}
            <div className="relative" ref={menuRef}>
                <button className="text-white" onClick={toggleMenu}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12a.75.75 0 110-1.5.75.75 0 010 1.5zM12 17.25a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                    </svg>
                </button>
                {isMenuOpen && (
                    <div
                        className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10 overflow-hidden transition-all duration-500 ease-in-out"
                        style={{
                            maxHeight: isMenuOpen ? "300px" : "0",
                            opacity: isMenuOpen ? 1 : 0,
                        }}
                    >
                        <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatHeader