import Header from '@/app/_component/header';
import NavFooter from '@/app/_component/NavFooter';
import CreateBoarFab from '@/app/(home)/pond/_component/CreateBoatFab';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/*<Header />*/}
            {children}
            <NavFooter />
        </>
    );
}
