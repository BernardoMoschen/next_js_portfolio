import React from 'react';
import { useI18n } from '../../i18n';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();

  const toggle = () => {
    setLocale(locale === 'en' ? 'pt-br' : 'en');
  };

  return (
    <button
      onClick={toggle}
      aria-label={locale === 'en' ? 'Switch to Portuguese' : 'Mudar para Ingles'}
      className="theme-toggle mono"
      style={{ fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em' }}
    >
      {locale === 'en' ? 'PT' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher;
