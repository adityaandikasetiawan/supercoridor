import { useLanguage } from '../contexts/LanguageContext';

export function Maintenance() {
  const { lang } = useLanguage();

  const content = {
    id: {
      title: 'Sedang Dalam Pemeliharaan',
      subtitle: 'Kami sedang melakukan peningkatan sistem',
      description:
        'Website SuperCorridor sedang dalam proses pemeliharaan dan peningkatan untuk memberikan pengalaman yang lebih baik bagi Anda.',
      estimate: 'Estimasi: Akan segera kembali online',
      contact: 'Hubungi Kami',
      contactDesc: 'Untuk pertanyaan mendesak, silakan hubungi:',
    },
    en: {
      title: 'Under Maintenance',
      subtitle: "We're improving our systems",
      description:
        'The SuperCorridor website is currently undergoing maintenance and upgrades to provide you with a better experience.',
      estimate: 'Estimated: Will be back online soon',
      contact: 'Contact Us',
      contactDesc: 'For urgent inquiries, please reach out:',
    },
  };

  const t = content[lang] || content.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Maintenance Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.78.929l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            {/* Animated pulse */}
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-blue-200 opacity-25 animate-ping" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-lg text-blue-600 font-medium">{t.subtitle}</p>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
          <p className="text-gray-600 leading-relaxed">{t.description}</p>

          {/* Estimate badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-700">{t.estimate}</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-gray-800">{t.contact}</h2>
          <p className="text-sm text-gray-500">{t.contactDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:info@supercorridor.co.id"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@supercorridor.co.id
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a
              href="https://wa.me/6282289986477"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.563 4.216 1.625 6.063l-1.5 5.5 5.688-1.469A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* SuperCorridor branding */}
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} PT Super Corridor. All rights reserved.
        </p>
      </div>
    </div>
  );
}
