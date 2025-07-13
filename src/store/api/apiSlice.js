import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { baseQuery, responseHandler, requestHandler } from '../../config/interceptors';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    // Apply request interceptor
    const modifiedArgs = await requestHandler(args, api, extraOptions);

    // Make the request
    const result = await baseQuery(modifiedArgs, api, extraOptions);

    // Apply response interceptor
    return responseHandler(result);
  },
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (mobileNumber) => ({
        url: API_ENDPOINTS.SEND_OTP,
        method: 'POST',
        body: { mobile_num: mobileNumber },
      }),
    }),
    sendOtpOrganiserPhone: builder.mutation({
      query: (mobileNumber) => ({
        url: API_ENDPOINTS.SEND_OTP_ORGANISER_PHONE,
        method: 'POST',
        body: { mobileNumber: mobileNumber },
      }),
    }),
    verifyOtpOrganiserPhone: builder.mutation({
      query: ({ mobileNumber, otp }) => ({
        url: API_ENDPOINTS.VERIFY_OTP_ORGANISER_PHONE,
        method: 'POST',
        body: {
          mobileNumber: mobileNumber,
          otp: otp
        },
      }),
    }),
    sendOtpOrganiserEmail: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SEND_OTP_ORGANISER_EMAIL,
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtpOrganiserEmail: builder.mutation({
      query: ({ email, otp }) => ({
        url: API_ENDPOINTS.VERIFY_OTP_ORGANISER_EMAIL,
        method: 'POST',
        body: { email: email, otp: otp },
      }),
    }),
    organisationRegister: builder.mutation({
      query: (organisationData) => ({
        url: API_ENDPOINTS.ORGANISATION_REGISTER,
        method: 'POST',
        body: {
          name: organisationData.name,
          role: organisationData.role,
          mobileNumber: organisationData.mobileNumber,
          organiserName: organisationData.organiserName,
          organiserAddress: {
            addressLine1: organisationData.organiserAddress.addressLine1,
            addressLine2: organisationData.organiserAddress.addressLine2,
            cityDistrict: organisationData.organiserAddress.cityDistrict,
            pincode: organisationData.organiserAddress.pincode,
            country: organisationData.organiserAddress.country
          },
          organiserMobileNumber: organisationData.organiserMobileNumber,
          organiserEmail: organisationData.organiserEmail,
          organiserWebsite: organisationData.organiserWebsite,
          directorName: organisationData.directorName,
          directorMobileNumber: organisationData.directorMobileNumber,
          password: organisationData.password
        },
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ mobileNumber, otp }) => ({
        url: API_ENDPOINTS.VERIFY_OTP,
        method: 'POST',
        body: {
          mobile_num: mobileNumber,
          otp: otp
        },
      }),
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: API_ENDPOINTS.REGISTER_USER,
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    organisationlogin: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.ORGANISATION_LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    organisationforgetpassotp: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.SEND_FORGET_PASS,
        method: 'POST',
        body: credentials,
      }),
    }),
    organisationforgetpassotpverify: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.SEND_FORGET_PASS_OTP_VERIFY,
        method: 'POST',
        body: credentials,
      }),
    }),
    organisationresetpassword: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.ORGANISATION_RESET_PASS,
        method: 'POST',
        body: credentials,
      }),
    }),
    createCompetitionOverview: builder.mutation({
      query: (formData) => ({
        url: API_ENDPOINTS.COMPETITION_OVERVIEW,
        method: 'POST',
        body: formData,
        formData: true, // This tells RTK Query to handle the request as FormData
      }),
    }),
    getAllCompetitions: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.COMPETITIONS_ALL,
        method: 'GET',
        params,
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_PROFILE,
        method: 'GET',
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: API_ENDPOINTS.UPDATE_PROFILE,
        method: 'PUT',
        body: profileData,
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useSendOtpOrganiserPhoneMutation,
  useVerifyOtpOrganiserPhoneMutation,
  useSendOtpOrganiserEmailMutation,
  useVerifyOtpOrganiserEmailMutation,
  useOrganisationRegisterMutation,
  useVerifyOtpMutation,
  useRegisterUserMutation,
  useLoginMutation,
  useOrganisationloginMutation,
  useOrganisationforgetpassotpMutation,
  useOrganisationforgetpassotpverifyMutation,
  useOrganisationresetpasswordMutation,
  useCreateCompetitionOverviewMutation,
  useGetAllCompetitionsQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = apiSlice; 