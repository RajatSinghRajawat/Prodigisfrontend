export const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  SEND_OTP: '/api/otp/send',
  VERIFY_OTP: '/api/otp/verify',
  REGISTER_USER: '/api/users/register',
  LOGIN: '/api/users/login',
  SEND_OTP_ORGANISER_PHONE: '/api/organisations/send-mobile-otp',
  VERIFY_OTP_ORGANISER_PHONE: '/api/organisations/verify-mobile-otp',
  SEND_OTP_ORGANISER_EMAIL: '/api/organisations/send-email-otp',
  VERIFY_OTP_ORGANISER_EMAIL: '/api/organisations/verify-email-otp',
  ORGANISATION_REGISTER: '/api/organisations/register',
  ORGANISATION_LOGIN: '/api/organisations/login',
  ORGANISATION_LOGOUT: '/api/organisations/logout',
  SEND_FORGET_PASS: '/api/organisations/forget-password/send-otp',
  SEND_FORGET_PASS_OTP_VERIFY: '/api/organisations/forget-password/verify-otp',
  ORGANISATION_RESET_PASS: '/api/organisations/forget-password/reset',
  COMPETITION_OVERVIEW: '/api/competitions/overview',
  COMPETITIONS_ALL: '/api/competitions/all',
  GET_PROFILE: '/api/users/profile',
  UPDATE_PROFILE: '/api/users/Updateprofile',
  // Add more endpoints here as needed
}; 