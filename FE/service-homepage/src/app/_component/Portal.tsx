import ReactDOM from 'react-dom';

export default function Portal({ children }: { children: React.ReactNode }) {
    return ReactDOM.createPortal(
        <div
            className="flex flex-col justify-center items-center w-screen h-screen"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                position: 'fixed',
                zIndex: '10000',
                flex: '1',
            }}
        >
            {children}
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
}
