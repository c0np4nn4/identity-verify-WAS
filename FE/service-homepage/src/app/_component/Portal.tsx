import ReactDOM from 'react-dom';

export default function Portal({ children }: { children: React.ReactNode }) {
    return ReactDOM.createPortal(
        <div
            className="flex flex-col justify-center items-center w-full h-full fixed top-0 left-0 bg-black bg-opacity-50 z-50"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                position: 'fixed',
                zIndex: '10000',
                flex: '1',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
            }}
        >
            {children}
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
}
