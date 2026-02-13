import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Plus, Pencil, Trash2, Star, X, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { ShopifyAddress, AddressInput } from '@/utils/shopify-customer';

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県',
  '岐阜県','静岡県','愛知県','三重県',
  '滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県',
  '鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県',
  '福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県',
];

const emptyAddress: AddressInput = {
  lastName: '',
  firstName: '',
  company: '',
  zip: '',
  province: '',
  city: '',
  address1: '',
  address2: '',
  phone: '',
  country: 'JP',
};

export function AddressManagement() {
  const { customer, createAddress, updateAddress, deleteAddress, setDefaultAddress, error, clearError } = useAuth();

  const addresses = customer?.addresses.edges.map((e) => e.node) || [];
  const defaultAddressId = customer?.defaultAddress?.id;

  const [editingAddress, setEditingAddress] = useState<(AddressInput & { id?: string }) | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openNewForm = () => {
    clearError();
    setEditingAddress({ ...emptyAddress });
    setIsNew(true);
    setFormErrors({});
  };

  const openEditForm = (addr: ShopifyAddress) => {
    clearError();
    setEditingAddress({
      id: addr.id,
      lastName: addr.lastName,
      firstName: addr.firstName,
      company: addr.company || '',
      zip: addr.zip,
      province: addr.province,
      city: addr.city,
      address1: addr.address1,
      address2: addr.address2 || '',
      phone: addr.phone || '',
      country: 'JP',
    });
    setIsNew(false);
    setFormErrors({});
  };

  const closeForm = () => {
    setEditingAddress(null);
    setFormErrors({});
  };

  const validate = (): boolean => {
    if (!editingAddress) return false;
    const errors: Record<string, string> = {};
    if (!editingAddress.zip?.trim()) errors.zip = '郵便番号を入力してください';
    if (!editingAddress.province?.trim()) errors.province = '都道府県を選択してください';
    if (!editingAddress.city?.trim()) errors.city = '市区町村を入力してください';
    if (!editingAddress.address1?.trim()) errors.address1 = '住所を入力してください';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!editingAddress || !validate()) return;

    setSubmitting(true);
    clearError();
    try {
      const { id, ...input } = editingAddress;
      if (isNew) {
        await createAddress(input);
        setSuccess('住所を追加しました');
      } else if (id) {
        await updateAddress(id, input);
        setSuccess('住所を更新しました');
      }
      closeForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      // error is set by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この住所を削除しますか？')) return;
    setDeletingId(id);
    clearError();
    try {
      await deleteAddress(id);
      setSuccess('住所を削除しました');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      // error is set by AuthContext
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    clearError();
    try {
      await setDefaultAddress(id);
      setSuccess('デフォルト住所を設定しました');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      // error is set by AuthContext
    } finally {
      setSettingDefaultId(null);
    }
  };

  const updateField = (field: keyof AddressInput, value: string) => {
    if (!editingAddress) return;
    setEditingAddress({ ...editingAddress, [field]: value });
    if (formErrors[field]) {
      setFormErrors((p) => { const n = { ...p }; delete n[field]; return n; });
    }
  };

  const inputStyle = (field: string) => ({
    border: formErrors[field] ? '1px solid var(--color-strawberry-500)' : '1px solid var(--color-neutral-300)',
    fontFamily: 'var(--font-sans)',
    backgroundColor: 'white',
  });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--color-strawberry-500)';
    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    if (!formErrors[field]) e.target.style.borderColor = 'var(--color-neutral-300)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '1px solid #fca5a5' }}
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
          style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '1px solid #6ee7b7' }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#059669' }} />
          <p style={{ color: '#065f46', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>{success}</p>
        </motion.div>
      )}

      {/* 新しい住所ボタン */}
      <button
        onClick={openNewForm}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:opacity-80"
        style={{
          background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
          color: 'white',
          fontFamily: 'var(--font-sans)',
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
        }}
      >
        <Plus className="w-4 h-4" />
        新しい住所を追加
      </button>

      {/* 住所リスト */}
      {addresses.length === 0 && !editingAddress && (
        <div className="text-center py-16">
          <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-neutral-300)' }} />
          <p className="text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>
            登録済みの住所がありません
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="rounded-2xl p-6"
            style={{ background: 'white', border: '1px solid var(--color-neutral-200)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {addr.id === defaultAddressId && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2"
                    style={{ background: 'var(--color-strawberry-50)', color: 'var(--color-strawberry-700)', border: '1px solid var(--color-strawberry-200)' }}
                  >
                    <Star className="w-3 h-3" />
                    デフォルト
                  </span>
                )}
                <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}>
                  {addr.lastName} {addr.firstName}
                  {addr.company && <span className="text-sm ml-2" style={{ color: 'var(--color-neutral-500)' }}>({addr.company})</span>}
                </p>
                <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>
                  〒{addr.zip} {addr.province}{addr.city}{addr.address1}
                  {addr.address2 && ` ${addr.address2}`}
                </p>
                {addr.phone && (
                  <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-500)' }}>
                    TEL: {addr.phone}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {addr.id !== defaultAddressId && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={settingDefaultId === addr.id}
                    className="p-2 rounded-lg transition-colors duration-300 hover:bg-[color:var(--color-neutral-100)]"
                    style={{ color: 'var(--color-neutral-500)' }}
                    title="デフォルトに設定"
                  >
                    {settingDefaultId === addr.id ? (
                      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-neutral-400)', borderTopColor: 'transparent' }} />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => openEditForm(addr)}
                  className="p-2 rounded-lg transition-colors duration-300 hover:bg-[color:var(--color-neutral-100)]"
                  style={{ color: 'var(--color-neutral-500)' }}
                  title="編集"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={deletingId === addr.id}
                  className="p-2 rounded-lg transition-colors duration-300 hover:bg-[color:var(--color-strawberry-50)]"
                  style={{ color: 'var(--color-strawberry-500)' }}
                  title="削除"
                >
                  {deletingId === addr.id ? (
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-strawberry-400)', borderTopColor: 'transparent' }} />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 住所フォーム（ダイアログ） */}
      {editingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-8"
            style={{ background: 'white', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                {isNew ? '新しい住所を追加' : '住所を編集'}
              </h3>
              <button onClick={closeForm} className="p-2 rounded-lg transition-colors duration-300 hover:bg-[color:var(--color-neutral-100)]" style={{ color: 'var(--color-neutral-500)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>姓</label>
                  <input type="text" value={editingAddress.lastName || ''} onChange={(e) => updateField('lastName', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('lastName')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'lastName')} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>名</label>
                  <input type="text" value={editingAddress.firstName || ''} onChange={(e) => updateField('firstName', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('firstName')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'firstName')} />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>会社名</label>
                <input type="text" value={editingAddress.company || ''} onChange={(e) => updateField('company', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('company')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'company')} />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>
                  郵便番号 <span style={{ color: 'var(--color-strawberry-600)' }}>*</span>
                </label>
                <input type="text" value={editingAddress.zip || ''} onChange={(e) => updateField('zip', e.target.value)} placeholder="000-0000" className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('zip')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'zip')} />
                {formErrors.zip && <p className="mt-1 text-xs" style={{ color: 'var(--color-strawberry-600)' }}>{formErrors.zip}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>
                  都道府県 <span style={{ color: 'var(--color-strawberry-600)' }}>*</span>
                </label>
                <select value={editingAddress.province || ''} onChange={(e) => updateField('province', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('province')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'province')}>
                  <option value="">選択してください</option>
                  {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {formErrors.province && <p className="mt-1 text-xs" style={{ color: 'var(--color-strawberry-600)' }}>{formErrors.province}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>
                  市区町村 <span style={{ color: 'var(--color-strawberry-600)' }}>*</span>
                </label>
                <input type="text" value={editingAddress.city || ''} onChange={(e) => updateField('city', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('city')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'city')} />
                {formErrors.city && <p className="mt-1 text-xs" style={{ color: 'var(--color-strawberry-600)' }}>{formErrors.city}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>
                  住所1 <span style={{ color: 'var(--color-strawberry-600)' }}>*</span>
                </label>
                <input type="text" value={editingAddress.address1 || ''} onChange={(e) => updateField('address1', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('address1')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'address1')} />
                {formErrors.address1 && <p className="mt-1 text-xs" style={{ color: 'var(--color-strawberry-600)' }}>{formErrors.address1}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>住所2</label>
                <input type="text" value={editingAddress.address2 || ''} onChange={(e) => updateField('address2', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('address2')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'address2')} />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>電話番号</label>
                <input type="tel" value={editingAddress.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2" style={inputStyle('phone')} onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'phone')} />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <motion.button
                onClick={handleSave}
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{
                  background: submitting ? 'var(--color-neutral-400)' : 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: submitting ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.3)',
                }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存する
                  </>
                )}
              </motion.button>
              <button
                onClick={closeForm}
                className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[color:var(--color-neutral-100)]"
                style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)', border: '1px solid var(--color-neutral-300)' }}
              >
                キャンセル
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
