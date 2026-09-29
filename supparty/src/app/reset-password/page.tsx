"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        setError("");

        // Actualiza la contraseña del usuario con la sesión temporal creada por el enlace de Supabase
        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
        } else {
            alert("¡Contraseña actualizada con éxito!");
            router.push("/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 px-4">
            <div className="bg-[#4B1B7D] text-white p-8 rounded-2xl max-w-md w-full shadow-xl">
                <h1 className="text-2xl font-bold text-center mb-2">Restablecer Contraseña</h1>
                <p className="text-white/70 text-center text-sm mb-6">
                    Ingresa tu nueva contraseña a continuación.
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <Input
                            id="new-password"
                            type="password"
                            className="bg-white text-black rounded-full"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            className="bg-white text-black rounded-full"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-300 font-bold">{error}</p>}

                    <Button
                        type="submit"
                        className="w-full bg-[#E91E63] hover:bg-[#d81b5b] rounded-full mt-4 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Actualizar Contraseña"}
                    </Button>
                </form>
            </div>
        </div>
    );
}