import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { filterFaqsByTags, type FaqTag } from '@/app/constants/faqData';

interface FaqSectionProps {
  /** 表示するFAQをフィルタリングするタグ */
  tags: FaqTag[];
  /** セクションのタイトル（デフォルト: "よくあるご質問"） */
  title?: string;
  /** セクションの説明文 */
  description?: string;
  /** 背景色のカスタマイズ（デフォルト: 'var(--color-neutral-50)'） */
  backgroundColor?: string;
  /** 最大表示件数（デフォルト: すべて表示） */
  maxQuestions?: number;
}

export function FaqSection({
  tags,
  title = 'よくあるご質問',
  description = 'お客様からよくいただくご質問をまとめました',
  backgroundColor = 'var(--color-neutral-50)',
  maxQuestions,
}: FaqSectionProps) {
  const filteredCategories = filterFaqsByTags(tags);

  // 最大表示件数が指定されている場合、質問を制限
  let displayCategories = filteredCategories;
  if (maxQuestions) {
    let count = 0;
    displayCategories = filteredCategories
      .map((category) => {
        const remainingQuestions = maxQuestions - count;
        if (remainingQuestions <= 0) return null;

        const questions = category.questions.slice(0, remainingQuestions);
        count += questions.length;

        return {
          ...category,
          questions,
        };
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null);
  }

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-32 px-4" style={{ backgroundColor }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background:
                'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)',
            }}
          >
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
            }}
          >
            {title}
          </h2>
          <p
            className="text-lg"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-600)',
              lineHeight: '1.8',
            }}
          >
            {description}
          </p>
        </motion.div>

        {displayCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-12 last:mb-0"
            >
              {/* カテゴリーヘッダー */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)',
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-neutral-900)',
                  }}
                >
                  {category.category}
                </h3>
              </div>

              {/* 質問アコーディオン */}
              <div
                className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg"
                style={{ border: '1px solid var(--color-neutral-200)' }}
              >
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border-b last:border-b-0"
                      style={{ borderColor: 'var(--color-neutral-200)' }}
                    >
                      <AccordionTrigger
                        className="text-left hover:no-underline group"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        <span
                          className="text-lg font-semibold group-hover:text-[color:var(--color-strawberry-600)] transition-colors duration-300"
                          style={{ color: 'var(--color-neutral-900)' }}
                        >
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p
                          className="text-base leading-relaxed pt-2"
                          style={{
                            fontFamily: 'var(--font-sans)',
                            color: 'var(--color-neutral-700)',
                            lineHeight: '1.9',
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
