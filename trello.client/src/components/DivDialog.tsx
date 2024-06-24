import React from 'react';
import {
    Dialog,
    DialogContent,

} from './ui/dialog'; // Ensure the path is correct
import { DialogTitle} from '@radix-ui/react-dialog';


interface DivDialogProps {
    content: React.ReactNode;
    isOpen: boolean; // Add this prop to manage dialog visibility
    onOpenChange: (open: boolean) => void; // Function to handle open/close state changes
    title: string;
}

const DivDialog: React.FC<DivDialogProps> = ({ content, isOpen, onOpenChange,title }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>
                    {title}
                </DialogTitle>
                {content}            
            </DialogContent>
        </Dialog>
    );
};

export default DivDialog;
