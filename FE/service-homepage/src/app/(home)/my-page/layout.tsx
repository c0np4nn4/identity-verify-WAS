export default function MyPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className={'bg-white w-full h-full p-24'}>{children}</div>;
}
