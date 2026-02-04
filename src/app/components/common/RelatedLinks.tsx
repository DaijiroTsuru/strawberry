import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export interface RelatedLink {
  title: string;
  description: string;
  href: string;
}

interface RelatedLinksProps {
  links: RelatedLink[];
}

export function RelatedLinks({ links }: RelatedLinksProps) {
  return (
    <section className="py-16 lg:py-20 px-4" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2
            className="text-2xl lg:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
          >
            関連ページ
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={link.href}
                className="group block p-6 rounded-2xl bg-white transition-all duration-300 hover:shadow-lg h-full"
                style={{ border: '1px solid var(--color-neutral-200)' }}
              >
                <h3
                  className="font-bold text-lg mb-2 group-hover:text-[color:var(--color-strawberry-600)] transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
                >
                  {link.title}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.7' }}
                >
                  {link.description}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all duration-300"
                  style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}
                >
                  詳しく見る
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
