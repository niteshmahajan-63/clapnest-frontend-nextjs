"use client";
import React from "react";
import { SocketProvider } from "@/context/SocketContext";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    );
}
