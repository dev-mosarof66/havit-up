'use client'
import React, { useState } from 'react'
import { MdMenu, MdList, MdHome, MdInsertChart, MdLocalFireDepartment } from 'react-icons/md'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutUser } from '@/app/actions/authActions'
import { MdLogout } from 'react-icons/md'

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
                    onClick={() => logoutUser()}
                    title={isCollapsed ? "Sign Out" : undefined}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-2 hover:bg-red-500/10 text-red-500 px-3 py-2 rounded-md cursor-pointer transition-all duration-150`}
                >
                    <MdLogout className='text-xl shrink-0' />
                    {!isCollapsed && <span className='text-sm font-medium'>Sign Out</span>}
                </button>
            </div>

        </div >
    )
}

export default Sidebar