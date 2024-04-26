'use client';

import { generateColor } from '@/utils/color';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface IPaperBoatCardProps {
    labels: string[];
    authorNickname: string;
    href: string;
}

export default function PaperBoatCard({
    labels,
    authorNickname,
    href,
}: IPaperBoatCardProps) {
    return (
        <Link
            href={href}
            className="flex flex-col w-144 h-168 bg-white rounded-6 shadow-2xl p-8 opacity-80 hover:animate-spring"
        >
            <div className="flex flex-wrap mt-2 gap-8">
                {labels.map((label, index) => (
                    <LabelTag key={label + index} label={label} />
                ))}
            </div>
            <p className="text-sm ml-auto mt-auto font-sans px-4 rounded-8 bg-gray-200">
                {authorNickname}
            </p>
        </Link>
    );
}

function LabelTag({ label }: { label: string }) {
    const [textColor, setTextColor] = useState('');
    useEffect(function textColorEffect() {
        setTextColor(generateColor());
    }, []);

    return (
        <span
            className={`text-18 rounded-6 px-2 py-1`}
            style={{ color: textColor }}
        >
            {label}
        </span>
    );
}
