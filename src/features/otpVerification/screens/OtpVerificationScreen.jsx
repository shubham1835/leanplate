import React from "react";
import useOtpVerification from "../hooks/useOtpVerification";
import CommonButton from "@shared/components/CommonButton";
import ErrorMessage from "@shared/components/ErrorMessage";
import styles from "../styles/styles.module.css";

export default function OtpVerificationScreen() {
  const {
    phone, digits, timer, loading, error,
    inputRefs, handleDigitChange, handleKeyDown,
    handleResend, handleChangeNumber,
  } = useOtpVerification();

  return (
    <div className={styles.page}>
      <div className={styles.logoWrap}>
        <div className={styles.logoIcon}>⚡</div>
        <div className={styles.logoSub}>LEAN PLATE</div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.heading}>Verify OTP</h2>
        <p className={styles.subheading}>
          Sent to +91 {phone.slice(0, 5)}XXXXX
          <button className={styles.changeBtn} onClick={handleChangeNumber}>
            Change
          </button>
        </p>

        <ErrorMessage message={error} />

        <div className={styles.otpRow}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              className={`${styles.otpInput} ${d ? styles.otpFilled : ""}`}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              autoFocus={i === 0}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        {loading ? (
          <p className={styles.verifying}>✓ Verifying...</p>
        ) : (
          <p className={styles.resend}>
            {timer > 0 ? (
              <span>Resend OTP in <strong>{timer}s</strong></span>
            ) : (
              <button className={styles.resendBtn} onClick={handleResend}>
                Resend OTP
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
