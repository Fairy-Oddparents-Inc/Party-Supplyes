"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.954 4 4 12.954 4 24s8.954 20 20 20s20-8.954 20-20c0-1.332-.142-2.631-.389-3.917z" />
    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.332-.142-2.631-.389-3.917z" />
  </svg>
);

//
export default function LoginDialog() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: nombre } }
      });
      if (error) setError(error.message);
      else alert("¡Registro exitoso! Revisa tu correo.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        router.push('/dashboard');
      }
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      },
    });
    if (error) setError(error.message);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) { setIsSignUp(false); setError(""); }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-[13px] hover:bg-transparent text-white hover:text-pink-300 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
        >
          <span>Iniciar Sesión</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#4B1B7D] text-white sm:max-w-md rounded-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">{isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}</DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            {isSignUp ? "Regístrate para empezar." : "Ingresa tus credenciales o con redes sociales."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 py-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input className="bg-white text-black rounded-full" id="nombre" placeholder="Juan Pérez" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input className="bg-white text-black rounded-full" id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input className="bg-white text-black rounded-full" id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className="text-sm text-red-300 font-bold">{error}</p>}

          <Button type="submit" className="w-full bg-[#E91E63] rounded-full" disabled={loading}>
            {loading ? "Cargando..." : (isSignUp ? "Registrarme" : "Iniciar Sesión")}
          </Button>

          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div><div className="relative flex justify-center text-xs"><span className="bg-[#4B1B7D] px-2 text-white/60">O continúa con</span></div></div>

          <div className="flex gap-4 justify-center items-center">
            <Button type="button" onClick={() => handleSocialLogin('google')} variant="outline" className="w-12 h-12 rounded-full p-0 bg-white border-none hover:bg-gray-700 flex items-center justify-center shadow-md">
              <GoogleIcon />
            </Button>
            <Button type="button" onClick={() => handleSocialLogin('facebook')} variant="outline" className="w-12 h-12 rounded-full p-0 bg-[#1877F2] border-none text-white hover:bg-[#166fe5] flex items-center justify-center shadow-md">
              <Facebook className="h-6 w-6" />
            </Button>
          </div>

          <button type="button" className="w-full text-sm underline text-center text-white/80 hover:text-white mt-4" onClick={(e) => { e.preventDefault(); setIsSignUp(!isSignUp); }}>
            {isSignUp ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}