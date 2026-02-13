import { useState } from 'react';
import { motion } from 'motion/react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export function ProfileEdit() {
  const { customer, updateProfile, error, clearError } = useAuth();

  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string } = {};
    if (!email.trim()) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await updateProfile({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email,
        phone: phone || undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // error is set by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (hasError?: boolean) => ({
    border: hasError ? '1px solid var(--color-strawberry-500)' : '1px solid var(--color-neutral-300)',
    fontFamily: 'var(--font-sans)',
    backgroundColor: 'white',
  });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-strawberry-500)';
    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, hasError?: boolean) => {
    if (!hasError) e.target.style.borderColor = 'var(--color-neutral-300)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="profile-lastName"
            className="block mb-2 font-medium"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
          >
            姓
          </label>
          <input
            type="text"
            id="profile-lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
            style={inputStyle()}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e)}
          />
        </div>
        <div>
          <label
            htmlFor="profile-firstName"
            className="block mb-2 font-medium"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
          >
            名
          </label>
          <input
            type="text"
            id="profile-firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
            style={inputStyle()}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e)}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="profile-email"
          className="block mb-2 font-medium"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
        >
          メールアドレス <span style={{ color: 'var(--color-strawberry-600)' }}>*</span>
        </label>
        <input
          type="email"
          id="profile-email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setFormErrors({}); }}
          className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
          style={inputStyle(!!formErrors.email)}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, !!formErrors.email)}
        />
        {formErrors.email && (
          <p className="mt-2 text-sm" style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}>
            {formErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="profile-phone"
          className="block mb-2 font-medium"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
        >
          電話番号
        </label>
        <input
          type="tel"
          id="profile-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
          style={inputStyle()}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e)}
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '1px solid #fca5a5',
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#dc2626' }} />
          <p style={{ color: '#991b1b', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            border: '1px solid #6ee7b7',
          }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#059669' }} />
          <p style={{ color: '#065f46', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
            プロフィールを更新しました
          </p>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: submitting ? 1 : 1.02 }}
        whileTap={{ scale: submitting ? 1 : 0.98 }}
        className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: submitting
            ? 'var(--color-neutral-400)'
            : 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
          color: 'white',
          fontFamily: 'var(--font-sans)',
          boxShadow: submitting ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.3)',
        }}
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            保存中...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            保存する
          </>
        )}
      </motion.button>
    </form>
  );
}
