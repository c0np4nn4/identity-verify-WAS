import ReactDOM from 'react-dom';

export default function Portal({ children }: { children: React.ReactNode }) {
    return ReactDOM.createPortal(
        <>{children}</>,
        document.getElementById('modal-root') as HTMLElement
    );
}
