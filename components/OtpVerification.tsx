import React, { useState, useRef, useEffect } from 'react';
import { SenikLogo, ArrowUturnLeftIcon } from './Icons';

interface OtpVerificationProps {
  mobile: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ mobile, onVerificationSuccess, onBack, onGoToLogin }) => {
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Focus previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      (e.currentTarget.previousSibling as HTMLInputElement)?.focus();
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const enteredOtp = otp.join("");
    // Mock OTP verification
    if (enteredOtp.length === 5) {
      console.log(`Verifying OTP: ${enteredOtp}`);
      // In a real app, you would verify this code against a server.
      // Mocking success.
      onVerificationSuccess();
    } else {
      setError('کد تایید باید ۵ رقم باشد.');
    }
  };
  
  const handleResend = () => {
      if (countdown === 0) {
          console.log("Resending OTP...");
          setCountdown(60);
          setOtp(new Array(5).fill(""));
          inputsRef.current[0]?.focus();
      }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)'}}>
      <div className="max-w-md w-full rounded-2xl shadow-xl p-8 space-y-6 border relative" style={{ backgroundColor: 'var(--color-card-background)', borderColor: 'var(--color-border)'}}>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Back to registration"
        >
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
          <SenikLogo className="w-16 h-16 mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-3xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
            تایید شماره موبایل
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            کد ۵ رقمی ارسال شده به شماره <span dir="ltr" className="font-mono">{mobile}</span> را وارد کنید.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 my-6" dir="ltr">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        type="text"
                        name="otp"
                        maxLength={1}
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        onFocus={e => e.target.select()}
                        // FIX: Ensure the ref callback function has a void return type. An arrow function without braces implicitly returns the result of the expression.
                        ref={el => { inputsRef.current[index] = el; }}
                        className="w-12 h-14 text-center text-2xl font-bold border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)'}}
                    />
                ))}
            </div>
             {error && (
                <p className="text-center text-sm text-red-600 mb-4">{error}</p>
            )}
            <div className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {countdown > 0 ? (
                    <p>ارسال مجدد کد تا {countdown} ثانیه دیگر</p>
                ) : (
                    <button type="button" onClick={handleResend} className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">ارسال مجدد کد</button>
                )}
            </div>
            <div className="mt-6">
                <button type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)'}}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                >
                تایید و ادامه
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

export default OtpVerification;