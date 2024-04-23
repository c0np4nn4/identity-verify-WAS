'use client';

export default function BoatMatchingPage({
    params,
}: {
    params: { boatId: string };
}) {
    console.log(params.boatId);
    return (
        <main className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#162832] to-[#527784]">
            <h1 className="text-4xl font-bold text-white">배 매칭</h1>
        </main>
    );
}
