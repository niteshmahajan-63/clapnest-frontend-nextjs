"use client"
import { GET_CHAT_USERS } from '@/graphql/graphql-queries';
import { UserList } from '@/types/UserList';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const NewChat = () => {
    const router = useRouter();
    const [users, setUsers] = useState<UserList[]>([]);
    const { data } = useQuery(GET_CHAT_USERS);

    useEffect(() => {
        if (data) {
            setUsers(data.getChatUsers);
        }
    }, [data]);

    const handleUserClick = (userId: string) => {
        router.push(`/chat/${userId}`);
    };

    return (
        <div className="min-h-screen md:flex md:justify-center md:items-center md:mt-2">
            <div className="w-full h-screen md:h-[80vh] md:max-w-md bg-white md:rounded-lg md:shadow-lg relative overflow-y-auto">
                {/* Header */}
                <div className="flex items-center bg-gray-800 text-white md:rounded-t-lg p-4">
                    <button
                        onClick={() => router.push('/chat')}
                        className="bg-transparent text-blue-500 p-2 rounded-md hover:bg-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <h5 className="ml-3 text-lg font-semibold">Start new chat</h5>
                </div>

                {/* User List */}
                <div className="divide-y divide-gray-200">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => handleUserClick(user.id)}
                                className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                            >
                                <Image
                                    src="https://placehold.co/50.png"
                                    alt="User"
                                    width={50}
                                    height={50}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4 flex-grow">
                                    <h6 className="text-base font-medium text-gray-800">{user.name}</h6>
                                    <small className="text-sm text-gray-500">{user.email}</small>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center">
                            <p className="text-gray-500">No users available to chat with.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NewChat