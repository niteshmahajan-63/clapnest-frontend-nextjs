"use client"
import React from 'react'
import ChatList from '../components/chat/ChatList'
import ChatHeader from '../components/chat/ChatHeader'
import Link from 'next/link'

const page = () => {
	return (
		<>
			<div className="min-h-screen md:flex md:justify-center md:items-center md:mt-2">
				<div className="w-full h-screen md:h-[80vh] md:max-w-md bg-white md:rounded-lg md:shadow-lg relative overflow-y-auto">
					<ChatHeader />
					<ChatList />
					{/* Floating action button */}
					<div className="fixed md:absolute bottom-6 right-6">
						<Link href="/chat/new">
							<button className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 5.25v13.5m7.5-7.5h-15"
									/>
								</svg>
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default page