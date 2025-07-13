import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./components/Home";
import Registration from "./components/Registration";
import OtpVerification from "./components/OtpVerification";
import EmailRegistration from "./components/EmailRegistration";
import RegistrationSuccess from "./components/RegistrationSuccess";
import AdditionalDetails from "./components/AdditionalDetails";
import StudentLogin from "./components/StudentLogin";
import UserLoginpage from "./components/UserLoginpage";
import ForgotPasswordSendOtp from "./components/ForgotPasswordSendOtp";
import ForgotPasswordVerifyOTP from "./components/ForgotPasswordVerifyOTP";
import ForgotPasswordResetPassword from "./components/ForgotPasswordResetPassword";
import Compition from "./components/Competition";
// import Competitionpaymentsummary from "./components/Competitionpaymentsummary";
// import Competitionsplans from "./components/Competitionsplans";
// import Competitionpayment from "./components/Competitionpayment";
import Competitionsdetail from "./components/Competitionsdetail";
import SchoolHome from "./components/schoolHome";
import Schoolmobile from "./components/Schoolmobile";
// import Competitionpayment from './components/Competitionpayment';
import Schoolverifyotp from "./components/Schoolverifyotp";
import Cardpayw from "./components/cardpay";
import SchoolDetails from "./components/SchoolDetails";
import Schoollogin from "./components/Schoollogin";
import Schoolforgatpassword from "./components/Schoolforgatpassword";
import Schoolverifaiemailotp from "./components/schoolverifaiemailotp";
import Schoolnewpassword from "./components/schoolnewpassword";
import Thankyou from "./components/Thankyou";
import Organiser from "./components/Organiserhome";
import Organiserveriemail from "./components/Organiserveriemail";
import Organiserotpveri from "./components/Organiserotpveri";
import Organiserdetails from "./components/Organiserdetails";
import Organiserlogin from "./components/Organiserlogin";
import Organiservefiemail from "./components/Organiservefiemail";
import Organisernewpassword from "./components/Organisernewpassword";
import Organiserforgetpassword from "./components/Organiserforgetpassword";
import OrganiserHomepage from "./components/OrganiserHomepage";
import OverviewZero from "./components/OverviewZero";
import Ocompetitionsdetail from "./components/Ocompetitionsdetail";
import AboutUs from "./components/AboutUs";
import OrganiserEmailOtosend from "./components/OrganiserEmailOtosend";
import Organiserforgetvefiemail from "./components/Organiserforgetvefiemail";
import OrganiserProfile from "./components/OrganiserProfile";
import OraganiserProfileUpdate from "./components/OraganiserProfileUpdate";
import OrganiserPersonaolsettingpage from "./components/OrganiserPersonaolsettingpage";
import BankAcount from "./components/BankAcount";
import FilterModal from "./components/FilterModal";
import StudentContactus from "./components/StudentContactus";
import StudentPersnolSetting from "./components/StudentPersnolSetting";
import CompitionsPlans from "./components/CompitionsPlans";
import CompitionsPayment from "./components/CompitionsPayment";
import CompitionsPlansSummery from "./components/CompitionsPlansSummery";
import CompetitionsPlanSummary from "./components/CompitionsPlansSummery";
// import Competitiondetail from "./components/Competitiondetail";
// import Ocompetitionsdetail from './components/Ocompetitionsdetail';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student/register/mobile" element={<Registration />} />
          <Route
            path="/student/register/verify-mobile-otp"
            element={<OtpVerification />}
          />
          <Route
            path="/student/register/email-registration"
            element={<EmailRegistration />}
          />
          <Route path="/additional-details" element={<AdditionalDetails />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<UserLoginpage />} />
          <Route
            path="/ForgotPasswordSendOtp"
            element={<ForgotPasswordSendOtp />}
          />
          <Route
            path="/ForgotPasswordVerify"
            element={<ForgotPasswordVerifyOTP />}
          />
          <Route
            path="/ForgotPasswordResetPassword"
            element={<ForgotPasswordResetPassword />}
          />
          <Route path="/compition" element={<Compition />} />
          {/* <Route
            path="/Competitionpaymentsummary"
            element={<Competitionpaymentsummary />}
          /> */}
          {/* <Route path="/Competitionsplans" element={<Competitionsplans />} />
          <Route path="/Competitionpayment" element={<Competitionpayment />} /> */}
          <Route path="/Competitionsdetail/:competitionsid" element={<Competitionsdetail />} />
          <Route path="/cardpay" element={<Cardpayw />} />
          <Route path="/schoolHome" element={<SchoolHome />} />
          <Route path="/Schoolmobile" element={<Schoolmobile />} />
          <Route path="/Schoolverifyotp" element={<Schoolverifyotp />} />

          <Route path="/SchoolDetails" element={<SchoolDetails />} />
          <Route path="/Schoollogin" element={<Schoollogin />} />
          <Route
            path="/Schoolforgatpassword"
            element={<Schoolforgatpassword />}
          />
          <Route
            path="/schoolverifaiemailotp"
            element={<Schoolverifaiemailotp />}
          />
          <Route path="/schoolnewpassword" element={<Schoolnewpassword />} />
          <Route path="/Thankyou" element={<Thankyou />} />
          <Route path="/organiser" element={<Organiser />} />
          <Route path="/organiser/register" element={<Organiserveriemail />} />
          <Route path="/organiser/verify-opt" element={<Organiserotpveri />} />
          <Route
            path="/organiser/register-details"
            element={<Organiserdetails />}
          />
          <Route
            path="/organiser/register-email"
            element={<OrganiserEmailOtosend />}
          />
          <Route path="/organiser/login" element={<Organiserlogin />} />
          <Route
            path="/organiser/verify-email-otp"
            element={<Organiservefiemail />}
          />
          <Route
            path="/organiser/create-new-password"
            element={<Organisernewpassword />}
          />
          <Route
            path="/organiser/verify-forget-email-otp"
            element={<Organiserforgetvefiemail />}
          />
          <Route
            path="/organiser/forgetpassword"
            element={<Organiserforgetpassword />}
          />
          <Route path="/organiser/dashboard" element={<OrganiserHomepage />} />
          <Route path="/organiser/competition" element={<OverviewZero />} />
          <Route path="/organiser/competition/:id" element={<OverviewZero />} />
          <Route
            path="/Ocompetitionsdetail/:competitionsid"
            element={<Ocompetitionsdetail />}
          />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/filter" element={<FilterModal/>} />  
          <Route path="/StudentContactus" element={<StudentContactus/>} /> 
          <Route path="/student/persnol-setting" element={<StudentPersnolSetting/>} />   
          <Route path="/cardpay" element={<cardpay/>} />
          {/* <Route path="/Competitiondetail" element={<Competitiondetail />} /> */}
          <Route path="/OrganiserProfile" element={<OrganiserProfile />} />
          <Route
            path="/OraganiserProfileUpdate"
            element={<OraganiserProfileUpdate />}
          />
          <Route
            path="/OrganiserPersonaolsettingpage"
            element={<OrganiserPersonaolsettingpage />}
          />
          <Route path="/BankAcount" element={<BankAcount />} />
          <Route path="/compitions-plans" element={<CompitionsPlans />} />
          <Route path="/compitions-plans/:competitionsid" element={<CompitionsPlans />} />
          <Route path="/compitions-payment/:competitionsid" element={<CompitionsPayment />} />
          <Route path="/Competitionpaymentsummary" element={<CompetitionsPlanSummary />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
