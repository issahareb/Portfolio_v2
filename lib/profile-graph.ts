import { HREFLANG, langUrl, SITE_URL, type Lang } from './i18n'

const PERSON_ID = `${SITE_URL}/#issa-hareb`
const WEBSITE_ID = `${SITE_URL}/#website`
const ORGANIZATION_ID = `${SITE_URL}/#hareb-digital`

export function profileGraph(lang: Lang, name: string, description: string) {
  const url = langUrl(lang, '/portfolio')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Issa Hareb',
        givenName: 'Issa',
        familyName: 'Hareb',
        alternateName: ['Hareb, Issa'],
        url: `${SITE_URL}/`,
        jobTitle: 'Web Designer & Full-Stack Developer',
        disambiguatingDescription:
          'Issa Hareb entwickelt Webanwendungen und KI-Systeme in Essen und ist Gründer von Hareb Digital.',
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Full-Stack- und KI-Entwickler',
          occupationalCategory: '15-1252.00',
          responsibilities:
            'Entwicklung von Websites, Webanwendungen, KI-Agenten und Automatisierungen einschließlich Backend, Datenbank, Deployment und Betrieb.',
        },
        email: 'mailto:kontakt@hareb.digital',
        telephone: '+49-201-85393123',
        worksFor: { '@id': ORGANIZATION_ID },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Essen',
          addressRegion: 'Nordrhein-Westfalen',
          addressCountry: 'DE',
        },
        homeLocation: {
          '@type': 'Place',
          name: 'Essen, Nordrhein-Westfalen',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Essen',
            addressRegion: 'Nordrhein-Westfalen',
            addressCountry: 'DE',
          },
        },
        workLocation: {
          '@type': 'Place',
          name: 'Essen und Ruhrgebiet',
        },
        knowsAbout: [
          'Webdesign', 'Motion Design', 'Adobe Photoshop', 'Adobe After Effects', 'Blender',
          'Full-Stack-Entwicklung',
          'KI-Agenten',
          'Automatisierung',
          'Next.js',
          'TypeScript',
          'PostgreSQL',
          'Technisches SEO',
          'Answer Engine Optimization',
          'Generative Engine Optimization',
          '3D im Web',
        ],
        sameAs: [
          'https://github.com/issahareb',
          'https://www.linkedin.com/in/issa-hareb-10a61642b',
          'https://www.xing.com/profile/Issa_Hareb02082',
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': ORGANIZATION_ID,
        name: 'Hareb Digital',
        url: 'https://hareb.digital/',
        description:
          'Hareb Digital ist das Einzelunternehmen von Issa Hareb: Websites, Webanwendungen, KI-Agenten und Automatisierungen, entwickelt vom Entwurf bis zum laufenden Betrieb.',
        founder: { '@id': PERSON_ID },
        employee: { '@id': PERSON_ID },
        email: 'mailto:kontakt@hareb.digital',
        telephone: '+49-201-85393123',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Essen',
          addressRegion: 'Nordrhein-Westfalen',
          addressCountry: 'DE',
        },
        areaServed: [
          { '@type': 'City', name: 'Essen' },
          { '@type': 'City', name: 'Bonn' },
          { '@type': 'AdministrativeArea', name: 'Ruhrgebiet' },
          { '@type': 'Country', name: 'Germany' },
        ],
        knowsLanguage: ['de', 'en', 'es'],
        identifier: {
          '@type': 'PropertyValue',
          propertyID: 'Google Knowledge Graph',
          value: 'kg:/g/11zw_y65ct',
        },
        sameAs: ['https://share.google/EUZlSQOOkoXIK0AMM'],
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${SITE_URL}/#lukas-quelltext`,
        name: 'L.U.K.A.S.',
        description:
          'Autonomer KI-Agent mit dauerhaftem Gedächtnis in Form eines Wissensgraphen, eigenen Werkzeugen und einem Freigabesystem im Code.',
        codeRepository: 'https://github.com/issahareb/Lukas_autonom',
        programmingLanguage: ['TypeScript', 'Python'],
        author: { '@id': PERSON_ID },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: 'Issa Hareb',
        alternateName: ['Issa Hareb Portfolio', 'issahareb.me'],
        inLanguage: ['de-DE', 'en', 'es'],
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: HREFLANG[lang],
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        mainEntity: { '@id': PERSON_ID },
        mentions: [
          { '@id': `${SITE_URL}/#lukas-quelltext` },
          { '@id': ORGANIZATION_ID },
          { '@type': 'WebSite', name: 'Taxi B&B Essen', url: 'https://www.taxibbessen.de/' },
        ],
      },
    ],
  }
}
