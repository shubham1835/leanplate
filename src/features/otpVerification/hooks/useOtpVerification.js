import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  verifyOtp, sendOtp,
  selectUserLoading, selectUserError, clearError,
} from "@core/store/reducers/userSlice";
import { SCREEN_NAMES } from "@core/navigation/routes";
import { setupFCM, onForegroundMessage, showLocalNotification } from "@core/services/fcmService";

const OTP_LENGTH = 6;

export default function useOtpVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading  = useSelector(selectUserLoading);
  const error    = useSelector(selectUserError);
  const inFlight = useRef(false);

  const phone = location.state?.phone || "";
  // Where to redirect after successful login (set by CartFAB / protected routes)
  const from  = location.state?.from  || null;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [timer,  setTimer]  = useState(30);
  const inputRefs = Array.from({ length: OTP_LENGTH }, () => useRef(null));

  // Countdown
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  // Listen for foreground FCM messages (OTP confirmation, etc.)
  useEffect(() => {
    let unsubscribe = () => {};
    onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      if (title) showLocalNotification(title, body, payload.data);
    }).then((fn) => { unsubscribe = fn; });
    return () => unsubscribe();
  }, []);

  // Auto-submit when all digits filled
  useEffect(() => {
    if (digits.every((d) => d !== "")) handleVerify(digits.join(""));
  }, [digits]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async (code) => {
    if (inFlight.current || code.length !== OTP_LENGTH) return;
    inFlight.current = true;
    try {
      const result = await dispatch(verifyOtp({ phone, otp: code }));
      if (verifyOtp.fulfilled.match(result)) {
        // Setup FCM after successful login (non-blocking)
        setupFCM().catch((e) => console.warn("[FCM] Setup error:", e));

        const role = result.payload?.user?.role;

        if (role === "ADMIN") {
          navigate(SCREEN_NAMES.ADMIN, { replace: true });
          return;
        }

        // Redirect to where they came from (e.g. checkout), or goal selection
        if (from && from !== SCREEN_NAMES.LOGIN) {
          navigate(from, { replace: true });
        } else {
          navigate(SCREEN_NAMES.GOAL_SELECTION, { replace: true });
        }
      }
    } finally {
      inFlight.current = false;
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    dispatch(clearError());
    setDigits(Array(OTP_LENGTH).fill(""));
    await dispatch(sendOtp(phone));
    setTimer(30);
    inputRefs[0].current?.focus();
  };

  const handleChangeNumber = () =>
    navigate(SCREEN_NAMES.LOGIN, { replace: true, state: { from } });

  return {
    phone, digits, timer, loading, error,
    inputRefs, handleDigitChange, handleKeyDown,
    handleResend, handleChangeNumber,
  };
}
