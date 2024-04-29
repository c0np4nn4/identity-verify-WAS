import CreateBoarFab from '@/app/(home)/pond/_component/CreateBoatFab';

export default function PondLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <CreateBoarFab />
        </>
    );
}
