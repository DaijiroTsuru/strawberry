import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import reviewsData from '@/data/reviews.json';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  photoUrl?: string;
}

export function TestimonialsSection() {
  const testimonials: Review[] = reviewsData;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            お客様の声
          </h2>
          <p className="text-lg text-gray-600">
            多くのお客様にご愛顧いただいております
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* 引用符アイコン */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-red-600" />
              </div>

              {/* 星評価 */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* コメント */}
              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                {testimonial.comment}
              </p>

              {/* 顧客情報 */}
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
