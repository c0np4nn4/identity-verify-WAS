export default function BoatButton({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <button className="bg-gray-800 text-white p-4 rounded-md">
            {children}
        </button>
    );
}
