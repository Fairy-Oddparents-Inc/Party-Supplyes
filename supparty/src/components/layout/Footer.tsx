// src/components/layout/Footer.tsx
import Link from 'next/link';
import { siteConfig } from '@/config/site';

// Footer reutilizable: se coloca manualmente al final de cada página.
// Los datos (links, contacto, redes) se editan en src/config/site.ts
export default function Footer() {
  const year = new Date().getFullYear();
  const { contact, socials, footerColumns, legalName } = siteConfig;

  return (
    <footer className="bg-[#4B1B7D] text-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">

        {footerColumns.slice(0, 2).map((column) => (
          <FooterColumn key={column.title} title={column.title}>
            {column.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="font-semibold hover:text-pink-300 transition-colors">{link.label}</Link>
              </li>
            ))}
          </FooterColumn>
        ))}

        {/* Suppartners + Contáctanos comparten columna, como en el Figma */}
        <div className="space-y-8">
          {footerColumns.slice(2).map((column) => (
            <FooterColumn key={column.title} title={column.title}>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-semibold hover:text-pink-300 transition-colors">{link.label}</Link>
                </li>
              ))}
            </FooterColumn>
          ))}

          <FooterColumn title="Contáctanos">
            <li>
              <a href={`tel:${contact.phone}`} className="font-semibold hover:text-pink-300 transition-colors">{contact.phoneLabel}</a>
            </li>
            <li className="font-semibold">
              Correo electrónico<br />
              <a href={`mailto:${contact.email}`} className="hover:text-pink-300 transition-colors">{contact.email}</a>
            </li>
          </FooterColumn>
        </div>

        <FooterColumn title="Síguenos">
          <li className="flex items-center gap-3">
            {socials.map(({ name, icon: Icon, href }) =>
              href ? (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="hover:text-pink-300 transition-colors">
                  <Icon size={22} />
                </a>
              ) : (
                <span key={name} aria-label={name} title={name}>
                  <Icon size={22} />
                </span>
              )
            )}
          </li>
          <li className="font-semibold">
            Copyright {year} ©<br />
            {legalName}<br />
            Todos los derechos reservados
          </li>
        </FooterColumn>

      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h5 className="font-light text-base text-white/90">{title}</h5>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}
