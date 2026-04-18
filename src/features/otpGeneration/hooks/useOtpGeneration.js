import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendOtp, selectUserLoading, selectUserError, clearError } from "@core/store/reducers/userSlice";
import { SCREEN_NAMES } from "@core/navigation/routes";

const schema = Yup.object({
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .required("Mobile number is required"),
});

export default function useOtpGeneration() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const loading   = useSelector(selectUserLoading);
  const error     = useSelector(selectUserError);
  const inFlight  = useRef(false);

  // Where to go after login — passed via navigation state or default to home
  const from = location.state?.from || SCREEN_NAMES.HOME;

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        const result = await dispatch(sendOtp(values.phone));
        if (sendOtp.fulfilled.match(result)) {
          navigate(SCREEN_NAMES.OTP_VERIFY, { state: { phone: values.phone, from } });
        }
      } finally {
        inFlight.current = false;
        helpers.setSubmitting(false);
      }
    },
  });

  // Allow guest to skip login and go directly to menu
  const handleSkip = () => navigate(SCREEN_NAMES.MENU, { replace: true });

  const handleClearError = () => dispatch(clearError());

  return { formik, loading, error, handleClearError, handleSkip, from };
}
