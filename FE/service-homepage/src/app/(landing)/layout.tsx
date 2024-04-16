import PaperBoatBackground from '/public/image/paper-boat-background.png';
import Image from 'next/image';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Image
                src={PaperBoatBackground}
                alt="background"
                className="-z-[100]"
                layout={'fill'}
                objectFit={'cover'}
            />
            {children}
        </>
    );
}
