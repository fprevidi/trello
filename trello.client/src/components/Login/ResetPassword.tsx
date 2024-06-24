import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const query = useQuery();
    const login = "";
    const token = query.get('token');
    const navigate = useNavigate(); // Usa useNavigate qui
    const [errorMessage, setErrorMessage] = useState<string>("");
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Le password non corrispondono");
            return;
        }
        try {
            const response = await fetch("/api/Login/ResetPassword/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify({ token,password,login }),
            });

            if (response.ok) {
                navigate('/Login'); // Naviga alla home
            } else {
                const errorResponse = await response.text(); // Presume che il corpo della risposta contenga il messaggio di errore
                setErrorMessage(errorResponse || "Problema nell'invio password");

            }
        }
        catch (error) {
            console.error("Errore nella chiamata di recupero:", error);
            const networkErrorMessage = "Errore di rete o server non disponibile";
            setErrorMessage(networkErrorMessage);

        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="flex flex-col gap-2">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h1 className="font-semibold leading-none tracking-tight">Reset password</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col p-6 pt-0 gap-8">
                        <div>
                            <label htmlFor="Password">Password</label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"></input>

                        </div>
                        <div>
                            <label htmlFor="Password">Conferma password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"></input>

                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-blue-500 text-white shadow hover:bg-blue-500/90"
                        >
                            conferma</button>
                        <div> {errorMessage && (<span className="text-red-500">{errorMessage}</span>)}</div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
