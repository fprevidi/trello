import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface LoginProps {
    onLoginSuccess: () => void;
    onLoginFailure: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onLoginFailure }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate(); // Usa useNavigate qui
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const token = await response.text(); // Supponendo che il token sia nel campo 'token' della risposta JSON
                localStorage.setItem("authToken", token); // Salva il token nel localStorage
                onLoginSuccess();
                navigate("/"); // Naviga alla home
            } else {
                const errorResponse = await response.text(); // Presume che il corpo della risposta contenga il messaggio di errore
                setErrorMessage(errorResponse || "Login fallito");
                onLoginFailure();
            }
        } catch (error) {
            console.error("Errore nella chiamata di login:", error);
            const networkErrorMessage = "Errore di rete o server non disponibile";
            setErrorMessage(networkErrorMessage);
            onLoginFailure();
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col gap-2 items-center ">

                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <img style={{ width: '150px' }} src="/img/logo.png" alt="Logo" className="mb-4 mt-5 m-auto" />
                    <div className="flex flex-col space-y-1.5 p-6">

                        <h1 className="font-semibold leading-none tracking-tight">Login</h1>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col p-6 pt-0 gap-8 w-[300px] max-w-full"
                    >
                        <div className="">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                type="text"
                                id="username"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                        //className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-blue-500 text-white shadow hover:bg-blue-500/90"
                        >
                            Login
                        </Button>
                        <div>
                            <Link className="py-4 text-sm font-medium hover:underline" to="/RecuperoPassword">Hai dimenticato la password?</Link>
                        </div>
                        {errorMessage && (
                            <span className="text-red-500">{errorMessage}</span>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
