This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Google Maps para reservaciones

La sección de ubicación de `/resumen-reservacion` permite buscar direcciones en México con Google Places y mostrar el mapa integrado. Para activar esas funciones:

1. Crea una clave de API en Google Cloud, configura la facturación y habilita **Maps JavaScript API** y **Places API (New)** para las sugerencias de direcciones. El mapa incrustado usa directamente la dirección escrita y no necesita **Maps Embed API**.
2. Restringe la clave por sitios web (HTTP referrers) y limita su uso a esas APIs.
3. Agrega la clave al archivo `.env.local` en la raíz del proyecto:

   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps
   ```

4. Reinicia el servidor de desarrollo con `npm run dev`.

La clave `NEXT_PUBLIC_` se envía al navegador; no uses una clave privada de servidor. Sin la clave, se puede escribir la dirección manualmente y el mapa seguirá mostrando esa dirección, pero no estarán disponibles las sugerencias de Places.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
