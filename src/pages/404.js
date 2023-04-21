import Nav from '@/components/Nav/Default';
import Link from 'next/link';

export default function showPageNotFound() {
    return(
        <>
            <Nav actionLabel={'Register'} />
            <div>
                <h2>Ooops.. You have found a page that doesn't exist</h2>
                <br />
                <div>
                    <span>Go back:</span>
                    <Link href={'/'}><button>Home page</button></Link>
                </div>
            </div>
        </>
    )
}