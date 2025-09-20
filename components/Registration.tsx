import React, { useState } from 'react';
import { SenikLogo, ArrowUturnLeftIcon } from './Icons';

interface RegistrationProps {
  onRegisterSuccess: (data: { mobile: string }) => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onRegisterSuccess, onBack, onGoToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const validateMobile = (mobile: string) => {
    // Simple validation for Iranian mobile numbers (e.g., starts with 09 and has 11 digits)
    return /^09\d{9}$/.test(mobile);
  };

  const validateNationalId = (id: string) => {
    // Simple validation for length
    return /^\d{10}$/.test(id);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('نام و نام خانوادگی نمی‌تواند خالی باشد.');
      return;
    }

    if (!validateNationalId(nationalId)) {
        setError('کد ملی باید ۱۰ رقم باشد.');
        return;
    }

    if (!validateMobile(mobile)) {
      setError('شماره موبایل وارد شده صحیح نیست. (مثال: 09123456789)');
      return;
    }

    // In a real app, you would probably check if the user exists, etc.
    // For now, just simulate success and move to OTP verification.
    console.log('Simulating sending OTP...');
    onRegisterSuccess({ mobile });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)'}}>
      <div className="max-w-md w-full rounded-2xl shadow-xl p-8 space-y-6 border relative" style={{ backgroundColor: 'var(--color-card-background)', borderColor: 'var(--color-border)'}}>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Back to homepage"
        >
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
          <SenikLogo className="w-16 h-16 mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-3xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
            ثبت نام کاربر جدید
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            اطلاعات خود را برای ایجاد حساب کاربری وارد کنید
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-right" style={{ color: 'var(--color-text-secondary)' }}>نام</label>
              <input id="firstName" name="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-sm"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)'}}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-right" style={{ color: 'var(--color-text-secondary)' }}>نام خانوادگی</label>
              <input id="lastName" name="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-sm"
                 style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)'}}
              />
            </div>
          </div>
          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-right" style={{ color: 'var(--color-text-secondary)' }}>کد ملی</label>
            <input id="nationalId" name="nationalId" type="text" maxLength={10} required value={nationalId} onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
              className="mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-sm text-left"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)'}}
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-right" style={{ color: 'var(--color-text-secondary)' }}>شماره موبایل</label>
            <input id="mobile" name="mobile" type="tel" autoComplete="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)}
              className="mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-sm text-left"
              style={{ direction: 'ltr', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)'}}
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          <div>
            <button type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)'}}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              ثبت اطلاعات و دریافت کد تایید
            </button>
          </div>
           <div className="text-center mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)'}}>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                حساب کاربری دارید؟{' '}
                <button
                    type="button"
                    onClick={onGoToLogin}
                    className="font-semibold transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary-hover)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                >
                    وارد شوید
                </button>
                </p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;