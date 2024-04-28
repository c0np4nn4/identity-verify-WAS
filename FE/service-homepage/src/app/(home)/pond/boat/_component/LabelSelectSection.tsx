import { useState } from 'react';

export default function LabelSelectSection({
    label,
    options,
    onSelect,
}: {
    label: string;
    options: string[];
    onSelect: (option: string) => void;
}) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <section className={'flex flex-col w-full overflow-x-auto'}>
            <h2 className={'text-14 font-sans ml-8'}>{label}</h2>
            <ul className={'flex overflow-x-auto w-330'}>
                {options.map((option, index) => (
                    <li key={index} className={'m-2'}>
                        <button
                            className={`px-4 py-2 border-2 border-gray-300 rounded-lg ${selected === option ? 'bg-gray-300' : ''}`}
                            onClick={() => {
                                setSelected(option);
                                onSelect(option);
                            }}
                        >
                            {option}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
