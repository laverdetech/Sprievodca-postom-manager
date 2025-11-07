import React from 'react';
import DigitalClock from './DigitalClock';
import LifeTimer from './LifeTimer';
import { LifeTimerSettings } from '../types';

interface HeaderProps {
    isFastActive: boolean;
    lifeTimerSettings: LifeTimerSettings;
}

const Header: React.FC<HeaderProps> = ({ isFastActive, lifeTimerSettings }) => (
    <header className="py-8 text-center">
        <div className="flex justify-center items-center mb-4">
            <a 
                href="https://sprievodca-postom.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-transform hover:scale-105 block"
                aria-label="Sprievodca Pôstom Hlavná Stránka"
            >
              <img 
                src="https://res.cloudinary.com/ddqrq1sf6/image/upload/v1757424550/Sprievodca%20P%C3%B4stom%20-%20Logo.png" 
                alt="Sprievodca Pôstom Logo" 
                className="h-24 md:h-32 w-auto" 
              />
            </a>
        </div>
        <div className="animate-scale-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
              Mesačný Pôstny Manažér
            </h1>
            <p className="text-gray-500 dark:text-brand-text-muted mt-2 text-lg">
              Naplánujte, sledujte a analyzujte si svoj pôstny kalendár na celý mesiac.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center mt-6 gap-4">
            <DigitalClock isFastActive={isFastActive} />
            <LifeTimer settings={lifeTimerSettings} />
        </div>
    </header>
  );

export default Header;