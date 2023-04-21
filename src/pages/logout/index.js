import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        // Logout user by clearing local storage & redirecting
        localStorage.clear();
        router.push('/login');
    }, []);
}