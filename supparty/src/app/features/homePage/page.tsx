"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
           <img src="/banner-verano.jpg" alt="Verano Party" className="w-full object-cover h-[300px]" />
           <div className="bg-[#E91E63] text-white text-center py-3 font-bold text-xl">
              Tu evento comienza aquí
           </div>
        </div>
      </main>
    </div>
  );
}