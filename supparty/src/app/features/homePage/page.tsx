'use client';

import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Calendar, Bot } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      
      <div className="pb-16">
        
        <section className="bg-gradient-to-r from-cyan-400 to-blue-500 py-16 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Verano Party</h1>
          
          <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-2 border-b md:border-b-0 md:border-r">
              <Search className="text-gray-400 mr-2" />
              <Input placeholder="Carpas, sillas, fotografía, mesas..." className="border-0 focus-visible:ring-0" />
            </div>
            <div className="flex-1 flex items-center px-2 border-b md:border-b-0 md:border-r">
              <MapPin className="text-gray-400 mr-2" />
              <Input placeholder="Ubicación" className="border-0 focus-visible:ring-0" />
            </div>
            <div className="flex-1 flex items-center px-2 border-b md:border-b-0 md:border-r">
              <Calendar className="text-gray-400 mr-2" />
              <Input type="date" className="border-0 focus-visible:ring-0" />
            </div>
            <Button className="bg-[#E91E63] hover:bg-[#D81B60] w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Encuentra todo lo que necesitas en un solo lugar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-40 bg-gray-200" />
                <CardHeader>
                  <CardTitle className="text-center text-[#4B1B7D]">Paquete Fiesta Básica</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-gray-600">
                  <p>✔ 10 mesas con 80 sillas</p>
                  <p>✔ 1 carpa 6x6 mts</p>
                  <p>✔ 1 trampolín infantil</p>
                  <p>✔ 2 mesas tipo tablón</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-[#4B1B7D] to-[#6A2C91] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Bot size={48} />
              <div>
                <h3 className="text-xl font-bold">Tu asistente IA para organizar la mejor fiesta</h3>
                <p className="opacity-90">Recibe ayuda personalizada</p>
              </div>
            </div>
            <Button variant="secondary" className="text-[#4B1B7D] font-bold">
              Recibe ayuda personalizada
            </Button>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard title="Todo lo que necesitas en un solo lugar" desc="Olvídate de buscar en redes sociales y ahorrar tiempo." />
          <FeatureCard title="Suppartners verificados y confiables" desc="Cada proveedor pasa por un proceso de validación estricto." />
          <FeatureCard title="Transparencia total antes de contratar" desc="Consulta fotos reales, descripciones y precios claros." />
          <FeatureCard title="Reserva rápida y segura" desc="Confirma tu servicio en pocos pasos con respaldo total." />
        </section>

        <footer className="bg-[#4B1B7D] text-white py-12">
           <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
             <FooterCol title="Servicio al cliente" links={["Ayuda", "Facturación", "Consultar reserva"]} />
             <FooterCol title="Información útil" links={["Nuestra historia", "Sala de prensa", "Términos de uso"]} />
             <FooterCol title="Supparters" links={["Registrarse", "Perfil Suppartner", "Contáctanos"]} />
             <FooterCol title="Síguenos" links={["Copyright 2026", "Grupo Supparty"]} />
           </div>
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-2">
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
      <h4 className="font-bold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function FooterCol({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-4">
      <h5 className="font-bold uppercase tracking-wider">{title}</h5>
      <ul className="space-y-2 opacity-80">
        {links.map(link => <li key={link}>{link}</li>)}
      </ul>
    </div>
  );
}