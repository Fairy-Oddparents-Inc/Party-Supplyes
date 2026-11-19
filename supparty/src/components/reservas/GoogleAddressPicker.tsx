'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface GooglePlace {
    fetchFields(options: { fields: string[] }): Promise<void>;
    formattedAddress?: string;
}

interface GooglePlacePrediction {
    toPlace(): GooglePlace;
}

interface GooglePlaceAutocompleteElement extends HTMLElement {
    includedRegionCodes: string[];
    placeholder: string;
}

interface GooglePlacesLibrary {
    PlaceAutocompleteElement: new () => GooglePlaceAutocompleteElement;
}

declare global {
    interface Window {
        google?: {
            maps: {
                importLibrary(library: 'places'): Promise<GooglePlacesLibrary>;
            };
        };
    }
}

let googleMapsApiPromise: Promise<void> | undefined;

function loadGoogleMapsApi(apiKey: string): Promise<void> {
    if (window.google?.maps) return Promise.resolve();
    if (googleMapsApiPromise) return googleMapsApiPromise;

    googleMapsApiPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async`;
        script.async = true;
        script.dataset.googleMapsApi = 'true';
        script.onload = () => resolve();
        script.onerror = () => {
            googleMapsApiPromise = undefined;
            reject(new Error('No se pudo cargar Google Maps.'));
        };
        document.head.appendChild(script);
    });

    return googleMapsApiPromise;
}

interface GoogleAddressPickerProps {
    address: string;
    onAddressChange(address: string): void;
}

export default function GoogleAddressPicker({ address, onAddressChange }: GoogleAddressPickerProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const autocompleteContainer = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!apiKey || !isEditing || !autocompleteContainer.current) return;

        let isActive = true;
        let autocompleteElement: GooglePlaceAutocompleteElement | undefined;

        const handlePlaceSelection = async (event: Event) => {
            const prediction = (event as Event & { placePrediction?: GooglePlacePrediction }).placePrediction;
            if (!prediction) return;

            try {
                const place = prediction.toPlace();
                await place.fetchFields({ fields: ['formattedAddress'] });
                if (!place.formattedAddress) {
                    setError('Google Maps no devolvió una dirección. Intenta elegir otra sugerencia.');
                    return;
                }

                setError('');
                onAddressChange(place.formattedAddress);
                setIsEditing(false);
            } catch {
                setError('No se pudo obtener la dirección. Intenta seleccionarla de nuevo.');
            }
        };

        void loadGoogleMapsApi(apiKey)
            .then(() => window.google?.maps.importLibrary('places'))
            .then((places) => {
                if (!isActive || !places || !autocompleteContainer.current) return;

                autocompleteElement = new places.PlaceAutocompleteElement();
                autocompleteElement.includedRegionCodes = ['mx'];
                autocompleteElement.placeholder = 'Busca la dirección del evento';
                autocompleteElement.addEventListener('gmp-select', handlePlaceSelection);
                autocompleteContainer.current.replaceChildren(autocompleteElement);
            })
            .catch(() => {
                if (isActive) setError('No se pudo conectar con Google Maps. Verifica la clave y las APIs habilitadas.');
            });

        return () => {
            isActive = false;
            autocompleteElement?.removeEventListener('gmp-select', handlePlaceSelection);
            autocompleteElement?.remove();
        };
    }, [apiKey, isEditing, onAddressChange]);

    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                    <MapPin size={16} className="text-pink-600 mt-1 shrink-0" />
                    <div className="min-w-0">
                        <span className="block text-xs text-slate-400 mb-0.5">Dirección del evento</span>
                        <p className="text-xs font-medium text-slate-800 leading-relaxed">
                            {address || 'Agrega la dirección del evento.'}
                        </p>
                    </div>
                </div>

                <div className="h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    {address ? (
                        <iframe
                            title="Mapa de la dirección del evento"
                            src={mapUrl}
                            width="100%"
                            height="100%"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-500">
                            El mapa aparecerá al agregar una dirección.
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="space-y-2">
                    {apiKey ? (
                        <>
                            <div ref={autocompleteContainer} />
                        </>
                    ) : (
                        <label className="block space-y-1">
                            <span className="text-xs font-medium text-slate-600">Escribe la dirección del evento</span>
                            <input
                                value={address}
                                onChange={(event) => onAddressChange(event.target.value)}
                                placeholder="Calle, número, colonia, ciudad"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                            />
                            <span className="block text-xs text-slate-500">
                                Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para activar las sugerencias de direcciones.
                            </span>
                        </label>
                    )}
                    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
                    {!apiKey && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="rounded-lg bg-pink-600 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-700"
                        >
                            Guardar dirección
                        </button>
                    )}
                </div>
            )}

            {!isEditing && (
                <button
                    type="button"
                    onClick={() => {
                        setError('');
                        setIsEditing(true);
                    }}
                    className="text-pink-600 hover:text-pink-700 text-xs font-semibold"
                >
                    Editar dirección
                </button>
            )}
        </div>
    );
}
