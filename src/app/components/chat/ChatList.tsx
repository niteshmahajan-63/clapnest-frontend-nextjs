import { useSocket } from '@/context/SocketContext';
import { GET_CHATS } from '@/graphql/graphql-queries';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react'

const ChatList = () => {
	const { chats, setChats } = useSocket();
	const { data } = useQuery(GET_CHATS, {
		fetchPolicy: "network-only",
	});

	useEffect(() => {
		if (data) {
			setChats(data.getChats);
		}
	}, [data, setChats]);

	return (
		<div className="divide-y divide-gray-200">
			{chats.length > 0 ? (
				chats.map((chat) => (
					<Link
						href={`/chat/${chat.user.id}`}
						key={chat.user.id}
						className="flex items-center p-4 hover:bg-gray-100 relative"
					>
						<Image
							src="https://placehold.co/50.png"
							alt="User"
							width={50}
							height={50}
							className="rounded-full w-12 h-12 object-cover"
						/>
						<div className="ml-4 flex-grow">
							<h6 className="text-base font-medium text-gray-800">{chat.user.name}</h6>
							<small
								className={`text-sm block truncate w-40 ${chat.unreadCount ?? 0 > 0 ? "font-bold text-gray-900" : "text-gray-500"
									}`}
							>
								{chat.lastMessage}
							</small>
						</div>
						<div className="flex flex-col items-center">
							<small
								className={`text-xs ${chat.unreadCount ?? 0 > 0 ? "font-bold text-gray-900" : "text-gray-400"
									}`}
							>
								{chat.lastMessageTime}
							</small>

							{(chat.unreadCount ?? 0) > 0 && (
								<span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full mt-1">
									{chat.unreadCount}
								</span>
							)}
						</div>
					</Link>
				))
			) : (
				<div className="p-4 text-center">
					<p className="text-gray-500">No chats here. Start a new conversation!</p>
				</div>
			)}
		</div>
	)
}

export default ChatList