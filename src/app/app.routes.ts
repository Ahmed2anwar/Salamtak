import { Routes } from '@angular/router';
import { LanguageGuard } from './guards/language.guard';
import { AppLayoutComponent } from './@layouts/app-layout/app-layout.component';
import { HomeComponent } from './components/home/home.component';
import { FindADoctorComponent } from './components/find-a-doctor/find-a-doctor.component';
import { ListingLayoutComponent } from './@layouts/listing-layout/listing-layout.component';
import { HospitalsComponent } from './components/hospitals/hospitals.component';
import { PolyclinicsComponent } from './components/polyclinics/polyclinics.component';
import { PolyClinicDoctorsComponent } from './components/poly-clinic-doctors/poly-clinic-doctors.component';
import { PharmaciesComponent } from './components/pharmacies/pharmacies.component';
import { LaboratoriesComponent } from './components/laboratories/laboratories.component';
import { RadiologyCenterComponent } from './components/radiology-center/radiology-center.component';
import { AngelComponent } from './components/angel/angel.component';
import { EmergencyComponent } from './components/emergency/emergency.component';
import { SuccesComponent } from './components/succes/succes.component';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import { BookingSuccessfullyComponent } from './components/booking-successfully/booking-successfully.component';
import { BookingSuccessfullyOfferComponent } from './components/booking-successfully-offer/booking-successfully-offer.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { SalamtakcapComponent } from './components/salamtakcap/salamtakcap.component';
import { TrueOrfalseComponent } from './components/true-orfalse/true-orfalse.component';
import { ScopeComponent } from './components/scope/scope.component';
import { CareComponent } from './components/care/care.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { AboutComponent } from './components/about/about.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { TermsOfUseArComponent } from './components/terms-of-use-ar/terms-of-use-ar.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { PrivacyPolicyArComponent } from './components/privacy-policy-ar/privacy-policy-ar.component';
import { DoctorsPrivacyPolicyComponent } from './components/doctors-privacy-policy/doctors-privacy-policy.component';
import { DoctorsPrivacyPolicyArComponent } from './components/doctors-privacy-policy-ar/doctors-privacy-policy-ar.component';
import { MyScheduleComponent } from './components/my-schedule/my-schedule.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MedicalComponent } from './components/medical/medical.component';
import { AskesComponent } from './components/askes/askes.component';
import { AskeslistComponent } from './components/askeslist/askeslist.component';
import { OfferComponent } from './components/offer/offer.component';
import { BookedOfferComponent } from './components/booked-offer/booked-offer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FirstStepComponent } from './components/profile/profile-steps/first-step/first-step.component';
import { SecondStepComponent } from './components/profile/profile-steps/second-step/second-step.component';
import { ThirdStepComponent } from './components/profile/profile-steps/third-step/third-step.component';
import { AuthenticationLayoutComponent } from './@layouts/authentication-layout/authentication-layout.component';
import { LoginComponent } from './components/@authentication/login/login.component';
import { ForgotPasswordComponent } from './components/@authentication/forgot-password/forgot-password.component';
import { VerificationCodeComponent } from './components/@authentication/verification-code/verification-code.component';
import { NewPasswordComponent } from './components/@authentication/new-password/new-password.component';
import { ResetSuccessfullyComponent } from './components/@authentication/reset-successfully/reset-successfully.component';
import { SignUpComponent } from './components/@authentication/sign-up/sign-up.component';
import { routeName, routesKeys } from './routes.lang';
import { SitemapComponent } from './helpers/sitemap/sitemap.component';
import { DoctorsLayoutComponent } from './@layouts/doctors-layout/doctors-layout.component';
import { FindADoctorBySubSpecialtyComponent } from './components/find-a-doctor-by-sub-specialty/find-a-doctor-by-sub-specialty.component';
import { QuestionsAnswersComponent } from './components/questions-answers/questions-answers.component';
import { MyReceiptComponent } from './components/my-receipt/my-receipt.component';
import { LabsComponent } from './components/labs/labs.component';
import { RadiologyComponent } from './components/radiology/radiology.component';
import { BookingServiceWithTypeComponent } from './components/booking-service-with-type/booking-service-with-type.component';
// import { SitemapComponent } from './helpers/sitemap/sitemap.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      // auto redirect to home
      { path: '', redirectTo: '/en/home', pathMatch: 'full' },
      { path: routeName('home', 'en'), component: HomeComponent },
      { path: routeName('home', 'ar'), component: HomeComponent },
      //

      { path: routeName('contact-us', 'en'), component: ContactUsComponent },
      { path: routeName('contact-us', 'ar'), component: ContactUsComponent },

      { path: routeName('hospitals', 'en'), component: HospitalsComponent },
      { path: routeName('hospitals', 'ar'), component: HospitalsComponent },

      // Polyclinics
      { path: routeName('polyclinics', 'en'), component: PolyclinicsComponent },
      { path: routeName('polyclinics', 'ar'), component: PolyclinicsComponent },

      // PolyDoctors
      {
        path: routeName('PolyDoctors', 'en'),
        component: PolyClinicDoctorsComponent,
      },
      {
        path: routeName('PolyDoctors', 'ar'),
        component: PolyClinicDoctorsComponent,
      },

      // Pharmacies
      { path: routeName('pharmacies', 'en'), component: PharmaciesComponent },
      { path: routeName('pharmacies', 'ar'), component: PharmaciesComponent },

      // Laboratories
      {
        path: routeName('laboratories', 'en'),
        component: LaboratoriesComponent,
      },
      {
        path: routeName('laboratories', 'ar'),
        component: LaboratoriesComponent,
      },

      // Radiology Center
      {
        path: routeName('radiology-center', 'en'),
        component: RadiologyCenterComponent,
      },
      {
        path: routeName('radiology-center', 'ar'),
        component: RadiologyCenterComponent,
      },

      // Salamtak Angel
      { path: routeName('SalamtakAngel', 'en'), component: AngelComponent },
      { path: routeName('SalamtakAngel', 'ar'), component: AngelComponent },

      // Emergency
      { path: routeName('emergency', 'en'), component: EmergencyComponent },
      { path: routeName('emergency', 'ar'), component: EmergencyComponent },

      // Success
      { path: routeName('succ', 'en'), component: SuccesComponent },
      { path: routeName('succ', 'ar'), component: SuccesComponent },

      // Booking Successfully
      {
        path: routeName('booking-successfully', 'en'),
        component: BookingSuccessfullyComponent,
      },
      {
        path: routeName('booking-successfully', 'ar'),
        component: BookingSuccessfullyComponent,
      },

      // Booking Successfully Offer
      {
        path: routeName('booking-successfully-offer', 'en'),
        component: BookingSuccessfullyOfferComponent,
      },
      {
        path: routeName('booking-successfully-offer', 'ar'),
        component: BookingSuccessfullyOfferComponent,
      },

      // Salamtak Gate
      { path: routeName('SalamtakGate', 'en'), component: BlogsComponent },
      { path: routeName('SalamtakGate', 'ar'), component: BlogsComponent },

      // Salamtak Capsola
      {
        path: routeName('SalamtakCapsola', 'en'),
        component: SalamtakcapComponent,
      },
      {
        path: routeName('SalamtakCapsola', 'ar'),
        component: SalamtakcapComponent,
      },

      // Salamtak True or False
      {
        path: routeName('SalamtakTrueOrFalse', 'en'),
        component: TrueOrfalseComponent,
      },
      {
        path: routeName('SalamtakTrueOrFalse', 'ar'),
        component: TrueOrfalseComponent,
      },

      // Salamtak Scoop
      { path: routeName('SalamtakScoop', 'en'), component: ScopeComponent },
      { path: routeName('SalamtakScoop', 'ar'), component: ScopeComponent },

      // Salamtak Care
      { path: routeName('SalamtakCare', 'en'), component: CareComponent },
      { path: routeName('SalamtakCare', 'ar'), component: CareComponent },

      // Salamtak Promotions
      {
        path: routeName('SalamtakPromotions', 'en'),
        component: PromotionComponent,
      },
      {
        path: routeName('SalamtakPromotions', 'ar'),
        component: PromotionComponent,
      },

      // About
      { path: routeName('about', 'en'), component: AboutComponent },
      { path: routeName('about', 'ar'), component: AboutComponent },

      // Contact Us          // Terms of Use
      { path: routeName('termsOf', 'en'), component: TermsOfUseComponent },
      { path: routeName('termsOf', 'ar'), component: TermsOfUseArComponent },

      // Privacy Policy
      {
        path: routeName('privacyPolicy', 'en'),
        component: PrivacyPolicyComponent,
      },
      {
        path: routeName('privacyPolicy', 'ar'),
        component: PrivacyPolicyArComponent,
      },

      // Doctor Privacy
      {
        path: routeName('doctorPrivacy', 'en'),
        component: DoctorsPrivacyPolicyComponent,
      },
      {
        path: routeName('doctorPrivacy', 'ar'),
        component: DoctorsPrivacyPolicyArComponent,
      },

      // My Schedule
      { path: routeName('my-schedule', 'en'), component: MyScheduleComponent },
      { path: routeName('my-schedule', 'ar'), component: MyScheduleComponent },

      // Change Password
      {
        path: routeName('change-password', 'en'),
        component: ChangePasswordComponent,
      },
      {
        path: routeName('change-password', 'ar'),
        component: ChangePasswordComponent,
      },

      // Medical
      {
        path: routeName('medical', 'en') + '/:AppointmentId',
        component: MedicalComponent,
      },
      {
        path: routeName('medical', 'ar') + '/:AppointmentId',
        component: MedicalComponent,
      },

      // Ask
      { path: routeName('ask', 'en'), component: AskesComponent },
      { path: routeName('ask', 'ar'), component: AskesComponent },

      // Ask List
      { path: routeName('askList', 'en'), component: AskeslistComponent },
      { path: routeName('askList', 'ar'), component: AskeslistComponent },

      // Questions and Answers List
      {
        path: routeName('questionList', 'en'),
        component: QuestionsAnswersComponent,
      }, //New
      {
        path: routeName('questionList', 'ar'),
        component: QuestionsAnswersComponent,
      },

      { path: routeName('receipt', 'en'), component: MyReceiptComponent }, //New
      { path: routeName('receipt', 'ar'), component: MyReceiptComponent },

      { path: routeName('labs', 'en'), component: LabsComponent }, //New Labs
      { path: routeName('labs', 'ar'), component: LabsComponent },

      { path: routeName('radiology', 'en'), component: RadiologyComponent }, //New radiology
      { path: routeName('radiology', 'ar'), component: RadiologyComponent },

      {
        path: routeName('bookingserviceType', 'en'),
        component: BookingServiceWithTypeComponent,
      }, //New radiology
      {
        path: routeName('bookingserviceType', 'ar'),
        component: BookingServiceWithTypeComponent,
      },

      // {path:routeName('doctor-profile/:doctorId/:doctorName'),component:DoctorProfileComponent}, // فيه مشكله عايز يتهندل تقريبا بسبب ال الكي بتاع اسم الدكتور
      {
        path: routeName('doctor', 'en') + '/:doctorId/:doctorName',
        component: DoctorProfileComponent,
      },
      {
        path: routeName('doctor', 'ar') + '/:doctorId/:doctorName',
        component: DoctorProfileComponent,
      },

      {
        path: routeName('offer', 'ar') + '/:offerId',
        component: OfferComponent,
      },
      {
        path: routeName('offer', 'en') + '/:offerId',
        component: OfferComponent,
      },

      // bookOffer

      {
        path: routeName('bookOffer', 'en') + '/:offerId',
        component: BookedOfferComponent,
      },
      {
        path: routeName('bookOffer', 'ar') + '/:offerId',
        component: BookedOfferComponent,
      },

      // without search bar
      {
        path: '',
        component: ListingLayoutComponent,
        children: [
          // hospitals

          // // Profile Redirect
          {
            path: routeName('profile', 'en'),
            component: ProfileComponent,
            children: [
              { path: '', component: FirstStepComponent },
              {
                path: routeName('personal-info', 'en'),
                component: FirstStepComponent,
              },
              {
                path: routeName('location', 'en'),
                component: SecondStepComponent,
              },
              {
                path: routeName('medical-state', 'en'),
                component: ThirdStepComponent,
              },
            ],
          },
          {
            path: routeName('profile', 'ar'),
            component: ProfileComponent,
            children: [
              { path: '', component: FirstStepComponent },
              {
                path: routeName('personal-info', 'ar'),
                component: FirstStepComponent,
              },
              {
                path: routeName('location', 'ar'),
                component: SecondStepComponent,
              },
              {
                path: routeName('medical-state', 'ar'),
                component: ThirdStepComponent,
              },
            ],
          },

        ],
      },
      {
        path: '',
        component: DoctorsLayoutComponent,
        children: [
          // FindADoctor
          {
            path: routeName('find-a-doctor', 'en'),
            component: FindADoctorComponent,
          },
          {
            path: routeName('find-a-doctor', 'en') + '/:specialty',
            component: FindADoctorComponent,
          },
           

          {
            path: routeName('find-a-doctor', 'en') + '/:specialty/:city',
            component: FindADoctorComponent,
          },
          {
            path: routeName('find-a-doctor', 'en') + '/:specialty/:city/:area',
            component: FindADoctorComponent,
          },
          {
            path: routeName('find-a-doctor', 'ar'),
            component: FindADoctorComponent,
          },
          {
            path: routeName('find-a-doctor', 'ar') + '/:specialty',
            component: FindADoctorComponent,
          },
          {
            path: routeName('find-a-doctor', 'ar') + '/:specialty/:city',
            component: FindADoctorComponent,
          },
          {
            path: routeName('find-a-doctor', 'ar') + '/:specialty/:city/:area',
            component: FindADoctorComponent,
          },
        ],
      },

      // "find-a-doctor-by-sub-specialty": {
      //   "ar": "ar/التخصصات",
      //   "en": "en/sub-specialities"
      // },
      {
        path: '',
        component: DoctorsLayoutComponent,
        children: [
          // FindADoctor
          {
            path: routeName('find-a-doctor-by-sub-specialty', 'en'),
            component: FindADoctorBySubSpecialtyComponent,
          },
          {
            path:
              routeName('find-a-doctor-by-sub-specialty', 'en') +
              '/:sub-specialty',
            component: FindADoctorBySubSpecialtyComponent,
          },
          {
            path:
              routeName('find-a-doctor-by-sub-specialty', 'en') +
              '/:sub-specialty/:specialty',
            component: FindADoctorBySubSpecialtyComponent,
          },
          {
            path:
              routeName('find-a-doctor-by-sub-specialty', 'en') +
              '/:sub-specialty/:specialty/:city',
            component: FindADoctorBySubSpecialtyComponent,
          },
          {
            path:
              routeName('find-a-doctor-by-sub-specialty', 'en') +
              '/:sub-specialty/:specialty/:city/:area',
            component: FindADoctorBySubSpecialtyComponent,
          },

          {
            path: routeName('find-a-doctor-by-sub-specialty', 'ar'),
            component: FindADoctorBySubSpecialtyComponent,
          },
          {
            path:
              routeName('find-a-doctor-by-sub-specialty', 'ar') +
              '/:sub-specialty',
            component: FindADoctorBySubSpecialtyComponent,
          },
          {
            path:
              routeName('find-a-doctor-by-sub-specialty', 'ar') +
              '/:sub-specialty/:specialty',
            component: FindADoctorBySubSpecialtyComponent,
          },
          {
            path:
              routeName('find-a-doctor-by-sub-specialty', 'ar') +
              '/:sub-specialty/:specialty/:city',
            component: FindADoctorBySubSpecialtyComponent,
          },
          {
            path:
              routeName('find-a-doctor-by-sub-specialty', 'ar') +
              '/:sub-specialty/:specialty/:city/:area',
            component: FindADoctorBySubSpecialtyComponent,
          },
        ],
      },
    ],
  },

  {
    path: '',
    component: AuthenticationLayoutComponent,
    children: [
      { path: routeName('login', 'en'), component: LoginComponent },
      { path: routeName('login', 'ar'), component: LoginComponent },
      {
        path: routeName('forgot-password', 'en'),
        component: ForgotPasswordComponent,
      },
      {
        path: routeName('verification-code', 'en'),
        component: VerificationCodeComponent,
      },
      {
        path: routeName('new-password/:token', 'en'),
        component: NewPasswordComponent,
      },
      {
        path: routeName('reset-successfully', 'en'),
        component: ResetSuccessfullyComponent,
      },
      { path: routeName('sign-up', 'en'), component: SignUpComponent },
      {
        path: routeName('forgot-password', 'ar'),
        component: ForgotPasswordComponent,
      },
      {
        path: routeName('verification-code', 'ar'),
        component: VerificationCodeComponent,
      },
      {
        path: routeName('new-password/:token', 'ar'),
        component: NewPasswordComponent,
      },
      {
        path: routeName('reset-successfully', 'ar'),
        component: ResetSuccessfullyComponent,
      },
      { path: routeName('sign-up', 'ar'), component: SignUpComponent },
    ],
  },
  { path: 'sitemap', component: SitemapComponent },
];
