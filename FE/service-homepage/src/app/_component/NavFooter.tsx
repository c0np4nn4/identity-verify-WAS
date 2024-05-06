import { TbSailboat } from 'react-icons/tb';
import { IoManOutline } from 'react-icons/io5';
import { FaRegBell } from 'react-icons/fa6';

import Link from 'next/link';

export default function NavFooter() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 m-auto p-12 flex items-center justify-around rounded-6 min-w-[calc(372px)] bg-gray-800 text-white">
            <Link href="/notification">
                <FaRegBell size={36} />
            </Link>
            <Link href="/pond">
                <TbSailboat size={36} />
            </Link>
            <Link href="/my-page">
                <IoManOutline size={36} />
            </Link>
        </footer>
    );
}
