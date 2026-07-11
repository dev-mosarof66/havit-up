'use client'
import React, { useState } from 'react'
import { MdMenu, MdList, MdHome, MdInsertChart, MdLocalFireDepartment } from 'react-icons/md'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutUser } from '@/app/actions/authActions'
import { MdLogout } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'

const items = [
    {
        id: 1,
        name: 'Dashboard',
        href: '/dashboard',
        icon: () => <MdHome className='text-foreground text-xl shrink-0' />
    },
    {
        id: 2,
        name: "Habits",
        href: '/habits',
        icon: () => <MdList className='text-foreground text-xl shrink-0' />
    },
    {
        id: 3,
        name: "Analytics",
        href: '/analytics',
        icon: () => <MdInsertChart className='text-foreground text-xl shrink-0' />
    }
]

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const pathname = usePathname()

    if (pathname === '/') return null;

    return (
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen border-r border-r-foreground/30 transition-all duration-300 relative`}>

            {/* Top logo + collapse icon */}
            <div className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center p-4`}>
                {!isCollapsed && (
                    <div className='flex items-center gap-2'>
                        <div className='p-1 bg-[#ef4444]/10 rounded-xl border border-[#ef4444]/20 flex items-center justify-center'>
                            <MdLocalFireDepartment size={20} className="text-[#ef4444]" />
                        </div>
                        <p className='text-xl font-bold font-stack'>Habit Up</p>
                    </div>
                )}
                <button onClick={() => setIsCollapsed(!isCollapsed)} className='rounded-full p-2 '>
                    <MdMenu className='text-foreground text-xl' />
                </button>
            </div>

            {/* items */}
            <div className='w-full py-10'>
                <div className='w-full flex flex-col gap-1 py-2'>
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.id} 
                                href={item.href}
                                title={isCollapsed ? item.name : undefined}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-2 hover:bg-foreground/20 px-3 py-2 cursor-pointer transition-all duration-150 ${isActive ? 'bg-foreground/20' : ''}`}
                            >
                                {item.icon()}
                                {!isCollapsed && <p className='text-foreground text-sm whitespace-nowrap'>{item.name}</p>}
                            </Link>
                        )
                    })}
                </div>
            </div>
            
            <div className="absolute bottom-4 left-0 w-full px-2">
                <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    title={isCollapsed ? "Sign Out" : undefined}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-2 hover:bg-red-500/10 text-red-500 px-3 py-2 rounded-md cursor-pointer transition-all duration-150`}
                >
                    <MdLogout className='text-xl shrink-0' />
                    {!isCollapsed && <span className='text-sm font-medium'>Sign Out</span>}
                </button>
            </div>

            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-[#09090b] border border-[#27272a] p-6 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Sign Out</h3>
                            <p className="text-gray-400 text-sm mb-6">Are you sure you want to sign out?</p>
                            <div className="flex gap-3 justify-end">
                                <button 
                                    onClick={() => setShowLogoutConfirm(false)}
                                    disabled={isLoggingOut}
                                    className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={async () => {
                                        setIsLoggingOut(true);
                                        await logoutUser();
                                        // No need to set isLoggingOut(false) since we will be redirected
                                    }}
                                    disabled={isLoggingOut}
                                    className="px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging out...
                                        </>
                                    ) : 'Sign Out'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div >
    )
}

export default Sidebar