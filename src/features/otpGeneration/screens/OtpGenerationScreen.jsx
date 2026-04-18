import React from "react";
import useOtpGeneration from "../hooks/useOtpGeneration";
import CommonButton     from "@shared/components/CommonButton";
import CommonTextInput  from "@shared/components/CommonTextInput";
import ErrorMessage     from "@shared/components/ErrorMessage";
import styles           from "../styles/styles.module.css";

export default function OtpGenerationScreen() {
  const { formik, loading, error, handleClearError, handleSkip } = useOtpGeneration();

  return (
    <div className={styles.page}>
      {/* Logo */}
      <div className={styles.logoWrap}>
        <div className={styles.logoIcon}>⚡</div>
        <div className={styles.logoSub}>FIT FUEL</div>
        <div className={styles.logoTitle}>DIET CAFÉ</div>
        <p className={styles.logoTagline}>Fuel your goals. One meal at a time.</p>
      </div>

      {/* Form */}
      <div className={styles.card}>
        <h2 className={styles.heading}>Enter your mobile</h2>
        <p className={styles.subheading}>We'll send a 6-digit OTP to verify</p>

        <ErrorMessage message={error} onRetry={handleClearError} />

        <form onSubmit={formik.handleSubmit} noValidate>
          <CommonTextInput
            name="phone"
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            prefix="🇮🇳 +91"
            maxLength={10}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onKeyDown={(e) => e.key === "Enter" && formik.handleSubmit()}
            error={formik.errors.phone}
            touched={formik.touched.phone}
          />
          <div className={styles.btnWrap}>
            <CommonButton
              type="submit"
              size="lg"
              full
              loading={loading}
              disabled={!formik.isValid || !formik.dirty || loading}
            >
              Send OTP →
            </CommonButton>
          </div>
        </form>

        {/* Skip login — guest browsing */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <div className={styles.dividerLine} />
        </div>

        <button className={styles.skipBtn} onClick={handleSkip}>
          Browse Menu Without Login →
        </button>

        <p className={styles.legal}>
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>
      </div>

      <div className={styles.footer}>📍 PumpZone Gym, Baner, Pune</div>
    </div>
  );
}
