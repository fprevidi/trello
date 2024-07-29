import React, { useState, useEffect, useCallback } from 'react';
import './Profile.css';
import Button from '../../UIComponents/Button/Button';
import DropZone from '../../UIComponents/DropZone/DropZone';
import CropImage from '../../UIComponents/CropImage/CropImage';

const Profile: React.FC = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<File | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [showCrop, setShowCrop] = useState(false);
    const uid = localStorage.getItem('uid');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!uid) {
                console.error('UID non trovato nel local storage');
                return;
            }

            const response = await fetch(`/api/LoginEdit/${uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Includi il token nell'header di autorizzazione
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setName(data.name);
                setProfilePic(`/img/profiles/${uid}.jpg`);
                setCroppedImageUrl(`/img/profiles/$Profile_{uid}.jpg`);
            } else {
                console.error('Errore durante il recupero del profilo');
            }
        };

        fetchUserProfile();
    }, [uid]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('name', name);
        formData.append('password', password);
        formData.append('token', localStorage.getItem('token') ?? '');
        formData.append('uid', uid ?? '');

        if (croppedImage) {
            formData.append('profilePic', croppedImage, 'profile.jpg');
        }

        const response = await fetch('/api/LoginEdit', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Includi il token nell'header di autorizzazione
            },
            body: formData,
        });

        if (response.ok) {
            setMessage('Profilo modificato con successo');
        } else {
            setMessage('Errore durante la modifica del profilo');
        }
    };

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setProfilePic(URL.createObjectURL(file));
        setShowCrop(true);
    }, []);

    const handleCropComplete = (croppedBlob: Blob) => {
        const croppedUrl = URL.createObjectURL(croppedBlob);
        setCroppedImageUrl(croppedUrl);
        const croppedFile = new File([croppedBlob], 'profile.jpg', { type: 'image/jpeg' });
        setCroppedImage(croppedFile);
        setShowCrop(false);
    };

    return (
        <div className="profile-container">
            <h2>Modifica Profilo</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nome Completo:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Foto Profilo:</label>
                    {showCrop ? (
                        <CropImage src={profilePic!} onCropComplete={handleCropComplete} />
                    ) : (
                        <DropZone onDrop={handleDrop}>
                            {croppedImageUrl ? (
                                <img src={croppedImageUrl} alt="Profile" className="profile-pic" />
                            ) : (
                                <div>Trascina una foto...</div>
                            )}
                        </DropZone>
                    )}
                </div>
                <Button type="submit" label="Salva" className="save-button" variant="custom" /><br />
                {message && <span className="message text-red-500">{message}</span>}
            </form>
        </div>
    );
};

export default Profile;
