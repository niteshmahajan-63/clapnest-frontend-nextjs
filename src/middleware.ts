import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl
    const isAuthRoute = publicRoutes.includes(pathname)

    if (isAuthRoute && token) {
        const isValid = await validateToken(token);
        if (isValid) {
            return NextResponse.redirect(new URL('/chat', request.url));
        }
    }

    if (!isAuthRoute) {
        if (!token || !(await validateToken(token))) {
            return redirectToLogin(request, true);
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
    ],
}

function redirectToLogin(request: NextRequest, clearToken: boolean = false) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);

    const response = NextResponse.redirect(loginUrl);

    if (clearToken) {
        response.cookies.delete("token");
    }

    return response;
}

async function validateToken(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        getprofile {
                            id
                            name,
                            email
                        }
                    }
                `,
            }),
        });

        if (!response.ok) return false;
        const data = await response.json();
        return data.data?.getprofile ?? false;
    } catch (error) {
        console.log(error);
        return false;
    }
}