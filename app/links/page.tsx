import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Useful Links',
  description: 'A curated directory of resources for CANVAS syndrome — research databases, clinical trial registries, patient organisations, and community groups.',
}

type LinkItem = {
  name: string
  url: string
  description: string
}

type Category = {
  title: string
  links: LinkItem[]
}

const categories: Category[] = [
  {
    title: 'Research & journals',
    links: [
      {
        name: 'PubMed — RFC1 / CANVAS',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=RFC1+CANVAS+syndrome&sort=date',
        description: 'The US National Library of Medicine\'s database of peer-reviewed biomedical literature. Search results filtered to RFC1 and CANVAS syndrome.',
      },
      {
        name: 'Europe PMC',
        url: 'https://europepmc.org/search?query=CANVAS+syndrome+RFC1&sortBy=DATE',
        description: 'Open-access archive of life sciences research including preprints, conference papers and grey literature not always found on PubMed.',
      },
      {
        name: 'Cochrane Library',
        url: 'https://www.cochranelibrary.com/',
        description: 'Systematic reviews and meta-analyses of clinical evidence. The gold standard for evaluating whether treatments actually work.',
      },
      {
        name: 'GeneReviews — RFC1-related ataxia',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK582163/',
        description: 'A clinical summary of RFC1-related CANVAS from the NCBI GeneReviews series — covering diagnosis, management, and genetic counselling.',
      },
      {
        name: 'OMIM — RFC1',
        url: 'https://omim.org/entry/102579',
        description: 'Online Mendelian Inheritance in Man. The authoritative catalogue of human genes and genetic disorders — RFC1 gene entry with full clinical and molecular detail.',
      },
      {
        name: 'Orphanet — CANVAS syndrome',
        url: 'https://www.orpha.net/consor/cgi-bin/OC_Exp.php?lng=EN&Expert=521718',
        description: 'The European rare disease database. Covers prevalence, diagnostic criteria, and links to specialist centres.',
      },
    ],
  },
  {
    title: 'Clinical trials',
    links: [
      {
        name: 'ClinicalTrials.gov — CANVAS',
        url: 'https://clinicaltrials.gov/search?cond=CANVAS+syndrome',
        description: 'The US registry of clinical studies worldwide, including trials in Australia, France, Italy, and the UK. The most comprehensive single source for active trials.',
      },
      {
        name: 'ISRCTN Registry',
        url: 'https://www.isrctn.com/search?q=CANVAS',
        description: 'The UK\'s primary clinical trial registry, managed by the BMJ. Focuses on UK and European studies.',
      },
      {
        name: 'WHO International Clinical Trials Registry Platform',
        url: 'https://trialsearch.who.int/',
        description: 'A meta-registry that searches across 17 national and regional trial registries simultaneously. Useful for finding trials not listed on ClinicalTrials.gov.',
      },
      {
        name: 'NIHR — National Institute for Health Research',
        url: 'https://www.nihr.ac.uk/',
        description: 'The UK government\'s health research funder. Covers funded projects, patient involvement in research, and how to take part in UK studies.',
      },
    ],
  },
  {
    title: 'Patient organisations',
    links: [
      {
        name: 'Ataxia UK',
        url: 'https://www.ataxia.org.uk/',
        description: 'The UK\'s leading ataxia charity. Offers information on CANVAS, specialist clinic referrals, research funding, welfare advice, and a dedicated support team.',
      },
      {
        name: 'Euro Ataxia',
        url: 'https://www.euroataxia.org/',
        description: 'The European Federation of Hereditary Ataxias. Coordinates patient advocacy and research across European member organisations.',
      },
      {
        name: 'National Ataxia Foundation (NAF)',
        url: 'https://www.ataxia.org/',
        description: 'The main US ataxia patient organisation. Funds research, runs support groups, and publishes Generations magazine. Useful for US-based trials and resources.',
      },
      {
        name: 'Ataxia Australia',
        url: 'https://www.ataxia.org.au/',
        description: 'Australia\'s ataxia patient organisation — relevant given that RFC1/CANVAS research has strong Australian involvement (teams in Sydney and Melbourne).',
      },
    ],
  },
  {
    title: 'Community',
    links: [
      {
        name: 'Ataxia UK — HealthUnlocked community',
        url: 'https://healthunlocked.com/ataxia-uk',
        description: 'The peer support forum run by Ataxia UK. A good place to ask questions and read about lived experience from others with CANVAS and related conditions.',
      },
      {
        name: 'r/ataxia — Reddit',
        url: 'https://www.reddit.com/r/ataxia/',
        description: 'A Reddit community for people affected by ataxia of all types. Not CANVAS-specific, but active and candid — useful for day-to-day questions and shared experience.',
      },
    ],
  },
]

function LinkCard({ item }: { item: LinkItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group border border-[#d2d2d7] rounded-2xl p-6 hover:border-[#0071e3] transition-colors flex flex-col"
    >
      <h3 className="text-[17px] font-semibold text-[#1d1d1f] leading-snug mb-2 group-hover:text-[#0071e3] transition-colors">
        {item.name}
      </h3>
      <p className="text-[14px] text-[#6e6e73] leading-relaxed flex-1">{item.description}</p>
      <span className="mt-4 inline-block text-[14px] text-[#0071e3]">Visit →</span>
    </a>
  )
}

export default function LinksPage() {
  return (
    <main className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-[#d2d2d7] bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[17px] font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
            Life under CANVAS
          </Link>
          <Link href="/links" className="text-[14px] text-[#0071e3] font-medium">
            Useful links
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">
        <section>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1d1d1f] mb-6 leading-tight">
            Useful links.
          </h1>
          <p className="text-xl md:text-2xl text-[#6e6e73] max-w-2xl leading-relaxed">
            A curated directory of research databases, trial registries, patient organisations, and community resources for CANVAS syndrome.
          </p>
        </section>

        {categories.map((category) => (
          <section key={category.title}>
            <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-8 capitalize">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.links.map((item) => (
                <LinkCard key={item.name} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-[#d2d2d7] mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-[13px] text-[#6e6e73]">
            Information on this site is for general awareness only and does not replace advice from your neurologist or specialist.
          </p>
        </div>
      </footer>
    </main>
  )
}
