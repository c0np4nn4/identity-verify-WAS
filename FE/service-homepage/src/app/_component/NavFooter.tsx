import { GiPaperBoat } from 'react-icons/gi';
import { IoManOutline } from 'react-icons/io5';
import { CiBellOn } from 'react-icons/ci';
import Link from 'next/link';

export default function NavFooter() {
    return (
        <footer className="absolute bottom-0 m-4 p-8 flex items-center justify-around rounded-6 w-[calc(100%-8px)] bg-gray-800 text-white">
            <Link href="/notification">
                <CiBellOn size={36} />
            </Link>
            <Link href="/pond">
                <GiPaperBoat size={36} />
            </Link>
            <Link href="/my-page">
                <IoManOutline size={36} />
            </Link>
        </footer>
    );
}
