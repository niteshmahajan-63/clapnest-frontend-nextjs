"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '@/graphql/graphql-queries';

const schema = z.object({
	name: z.string().nonempty('Name is required'),
	email: z.string().nonempty('Email is required').email("Invalid email"),
	password: z.string().nonempty('Password is required')
});

type FormData = z.infer<typeof schema>;

const Register = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [signupMutation] = useMutation(SIGNUP_MUTATION);

	const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data: FormData) => {
		setLoading(true);
		try {
			await signupMutation({ variables: { name: data.name, email: data.email, password: data.password } });
			toast.success("You have successfully signed up");
			router.push("/login");
		} catch (error: unknown) {
			if (error instanceof Error) {
                toast.error(error.message || "An unknown error occurred");
            } else {
                toast.error("An unknown error occurred");
            }
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-300">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ClapNest</h2>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Name Field */}
					<div>
						<label htmlFor="name" className="block text-gray-700 mb-1">
							Name
						</label>
						<input
							type="text"
							id="name"
							className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${errors.name ? "border-red-500 ring-red-300" : "border-gray-300"
								}`}
							{...register("name")}
						/>
						{errors.name && (
							<div className="text-red-500 text-sm">{errors.name.message}</div>
						)}
					</div>

					{/* Email Field */}
					<div>
						<label htmlFor="email" className="block text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							id="email"
							className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${errors.email ? "border-red-500 ring-red-300" : "border-gray-300"
								}`}
							{...register("email")}
						/>
						{errors.email && (
							<div className="text-red-500 text-sm">{errors.email.message}</div>
						)}
					</div>

					{/* Password Field */}
					<div>
						<label htmlFor="password" className="block text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							id="password"
							className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${errors.password ? "border-red-500 ring-red-300" : "border-gray-300"
								}`}
							{...register("password")}
						/>
						{errors.password && (
							<div className="text-red-500 text-sm">{errors.password.message}</div>
						)}
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-medium" disabled={loading}
					>
						{loading ? "Creating..." : "Create Account"}
					</button>
				</form>

				<div className="text-center mt-4">
					<p className="text-gray-700">
						Already have an account?{" "}
						<Link href="/login" className="text-blue-600 hover:underline">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Register