import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { TrailerConfigurator } from '@/components/boats/TrailerConfigurator'
import styles from './configurator.module.css'

export const metadata = {
  title: 'Build a New Trailer | Algarve Boat Sales',
  description:
    'Configure a brand-new Vanclaes boat trailer to your exact specification. Choose model, axles, options and finish, with supply, fitting and IVA registration across the Algarve.',
  alternates: { canonical: 'https://www.algarveboatsales.com/trailers/configurator' },
}

export default function TrailerConfiguratorPage() {
  return (
    <>
      <PageHero
        title="Build a New Trailer"
        subtitle="Configure a brand-new Vanclaes trailer to your exact specification with our live configurator"
        imageSrc="/services/trailer.jpg"
        imageAlt="A stainless steel Vanclaes boat trailer"
      />

      <div className="container py-8">
        <div className={styles.top}>
          <Link href="/trailers" className={styles.back}>
            &larr; Back to trailers
          </Link>
        </div>

        <TrailerConfigurator />

        <section className={styles.help}>
          <h2>Not sure which trailer you need?</h2>
          <p>
            Our team will match a Vanclaes trailer to your boat&apos;s weight and dimensions, then
            handle supply, fitting and IVA registration throughout Portugal. Send us your build and
            we&apos;ll take care of the rest.
          </p>
          <Link href="/contact" className="btn btn-gold">
            Talk to our team
          </Link>
        </section>
      </div>
    </>
  )
}
