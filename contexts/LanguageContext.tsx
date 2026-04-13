import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'id' | 'en';

type TranslationKey =
  | 'nav.personal'
  | 'nav.business'
  | 'nav.contactUs'
  | 'nav.support'
  | 'nav.careers'
  | 'nav.home'
  | 'nav.technology'
  | 'nav.solution'
  | 'nav.aboutUs'
  | 'nav.network'
  | 'nav.resources'
  | 'nav.login'
  | 'nav.search'
  | 'nav.searchPlaceholder'
  | 'nav.fiberOpticNetwork'
  | 'nav.cloudInfrastructure'
  | 'nav.networkSecurity'
  | 'nav.dedicatedConnectivity'
  | 'nav.backboneNetworkInfrastructure'
  | 'nav.cloudInterconnectionServices'
  | 'nav.valueAddedServices'
  | 'nav.tgcs'
  | 'nav.companyOverview'
  | 'nav.visionMission'
  | 'nav.leadershipTeam'
  | 'nav.milestones'
  | 'nav.articlesInsights'
  | 'nav.caseStudies'
  | 'nav.faq';

type TranslationDict = Record<TranslationKey, string>;

const translations: Record<Language, TranslationDict> = {
  id: {
    'nav.personal': 'Personal',
    'nav.business': 'Bisnis',
    'nav.contactUs': 'Hubungi kami',
    'nav.support': 'Bantuan',
    'nav.careers': 'Karir',
    'nav.home': 'Beranda',
    'nav.technology': 'Teknologi',
    'nav.solution': 'Solusi',
    'nav.aboutUs': 'Tentang Kami',
    'nav.network': 'Jaringan',
    'nav.resources': 'Sumber Daya',
    'nav.login': 'Masuk',
    'nav.search': 'Cari SuperCorridor',
    'nav.searchPlaceholder': 'Apa yang bisa kami bantu hari ini?',
    'nav.fiberOpticNetwork': 'Jaringan Fiber Optik',
    'nav.cloudInfrastructure': 'Infrastruktur Cloud',
    'nav.networkSecurity': 'Keamanan Jaringan',
    'nav.dedicatedConnectivity': 'Konektivitas Dedicated',
    'nav.backboneNetworkInfrastructure': 'Backbone & Infrastruktur Jaringan',
    'nav.cloudInterconnectionServices': 'Layanan Cloud & Interkoneksi',
    'nav.valueAddedServices': 'Layanan Nilai Tambah',
    'nav.tgcs': 'TGCS',
    'nav.companyOverview': 'Profil Perusahaan',
    'nav.visionMission': 'Visi & Misi',
    'nav.leadershipTeam': 'Tim Kepemimpinan',
    'nav.milestones': 'Pencapaian',
    'nav.articlesInsights': 'Artikel & Insight',
    'nav.caseStudies': 'Studi Kasus',
    'nav.faq': 'FAQ',
  },
  en: {
    'nav.personal': 'Personal',
    'nav.business': 'Business',
    'nav.contactUs': 'Contact us',
    'nav.support': 'Support',
    'nav.careers': 'Careers',
    'nav.home': 'Home',
    'nav.technology': 'Technology',
    'nav.solution': 'Solution',
    'nav.aboutUs': 'About Us',
    'nav.network': 'Network',
    'nav.resources': 'Resources',
    'nav.login': 'Log in',
    'nav.search': 'Search SuperCorridor',
    'nav.searchPlaceholder': 'What can we help you find today?',
    'nav.fiberOpticNetwork': 'Fiber Optic Network',
    'nav.cloudInfrastructure': 'Cloud Infrastructure',
    'nav.networkSecurity': 'Network Security',
    'nav.dedicatedConnectivity': 'Dedicated Connectivity',
    'nav.backboneNetworkInfrastructure': 'Backbone & Network Infrastructure',
    'nav.cloudInterconnectionServices': 'Cloud & Interconnection Services',
    'nav.valueAddedServices': 'Value-Added Services',
    'nav.tgcs': 'TGCS',
    'nav.companyOverview': 'Company Overview',
    'nav.visionMission': 'Vision & Mission',
    'nav.leadershipTeam': 'Leadership Team',
    'nav.milestones': 'Milestones',
    'nav.articlesInsights': 'Articles & Insights',
    'nav.caseStudies': 'Case Studies',
    'nav.faq': 'FAQ',
  },
};

function guessDefaultLanguage(): Language {
  const nav = typeof navigator !== 'undefined' ? navigator.language : '';
  if (nav.toLowerCase().startsWith('id')) return 'id';
  return 'en';
}

const STORAGE_KEY = 'sc_lang';

type LanguageContextValue = {
  lang: Language;
  setLang: (next: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw === 'id' || raw === 'en') return raw;
    return guessDefaultLanguage();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      void 0;
    }
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'id' ? 'en' : 'id'));
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[lang][key] ?? translations.en[key] ?? key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}

