import React from 'react';
import { DigikalaLogo, SnappLogo, CafeBazaarLogo, IrancellLogo, MelliBankLogo } from './Icons';
import type { SiteContent } from '../siteData';

interface ClientsProps {
  content: SiteContent['clients'];
}

const clientLogos = [
  { component: DigikalaLogo, name: 'دیجی‌کالا' },
  { component: SnappLogo, name: 'اسنپ' },
  { component: CafeBazaarLogo, name: 'کافه بازار' },
  { component: IrancellLogo, name: 'ایرانسل' },
  { component: MelliBankLogo, name: 'بانک ملی ایران' },
];

const ClientLogo: React.FC<{ LogoComponent: React.ElementType }> = ({ LogoComponent }) => (
  <div className="flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 h-28 transform hover:scale-110">
    <LogoComponent className="h-full w-auto max-w-full text-gray-500" />
  </div>
);

const Clients: React.FC<ClientsProps> = ({ content }) => {
  return (
    <section className="py-16 bg-[var(--color-card-background)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">{content.title}</h2>
          <p className="text-[var(--color-text-secondary)] mt-2">{content.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-12 items-center">
          {clientLogos.map((client) => (
            <ClientLogo key={client.name} LogoComponent={client.component} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;