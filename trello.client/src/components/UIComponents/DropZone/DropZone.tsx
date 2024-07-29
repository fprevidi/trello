import { useDropzone } from 'react-dropzone';
import './DropZone.css';

interface DropZoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    children?: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop,children }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        multiple: false, // Accetta solo una foto
    });

    return (
        <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {children ? children : <p>Trascina una foto qui, o clicca per selezionarla</p>}
        </div>
    );
};

export default DropZone;
