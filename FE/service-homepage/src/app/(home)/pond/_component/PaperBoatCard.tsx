'use client';

import { cls } from '@/utils/tailwind';
import { generateColor } from '@/utils/color';
import { useEffect, useState } from 'react';

interface IPaperBoatCardProps {
    labels: string[];
    authorNickname: string;
    onClick?: () => void;
}

export default function PaperBoatCard({
    labels,
    authorNickname,
    onClick,
}: IPaperBoatCardProps) {
    return (
        <div className="flex flex-col w-144 h-168 bg-white rounded-6 shadow-2xl p-8 opacity-80">
            <div className="flex flex-wrap mt-2 gap-8">
                {labels.map((label) => (
                    <LabelTag key={label} label={label} />
                ))}
            </div>
            <p className="text-sm ml-auto mt-auto font-sans px-4 rounded-8 bg-gray-200">
                {authorNickname}
            </p>
        </div>
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
