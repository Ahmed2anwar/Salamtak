import { Routes } from '@angular/router';
import { AppLayoutComponent } from './@layouts/app-layout/app-layout.component';

import { BlogsComponent } from './components/blogs/blogs.component';
import { SalamtakcapComponent } from './components/salamtakcap/salamtakcap.component';
import { TrueOrfalseComponent } from './components/true-orfalse/true-orfalse.component';
import { ScopeComponent } from './components/scope/scope.component';
import { CareComponent } from './components/care/care.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { AboutComponent } from './components/about/about.component';
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

import { routeName, } from './routes.lang';
import { SitemapComponent } from './helpers/sitemap/sitemap.component';
import { QuestionsAnswersComponent } from './components/questions-answers/questions-answers.component';
import { MyReceiptComponent } from './components/my-receipt/my-receipt.component';
import { LabsComponent } from './components/labs/labs.component';
import { RadiologyComponent } from './components/radiology/radiology.component';
import { BookingServiceWithTypeComponent } from './components/booking-service-with-type/booking-service-with-type.component';
import { GuideComponent } from './guide/guide.component';

import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { MyQuestionsComponent } from './components/my-questions/my-questions.component';


export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      // auto redirect to home
      { path: '', redirectTo: '/en/home', pathMatch: 'full' },
      {
        path: routeName('home', 'en'), loadComponent: () =>
          import('./components/home/home.component')
            .then(c => c.HomeComponent)
      },
      {
        path: routeName('home', 'ar'), loadComponent: () =>
          import('./components/home/home.component')
            .then(c => c.HomeComponent)
      },

      {
        path: routeName('contact-us', 'en'),
        loadComponent: () =>
          import('./components/contact-us/contact-us.component')
            .then(c => c.ContactUsComponent)
      },
      {
        path: routeName('contact-us', 'ar'), loadComponent: () =>
          import('./components/contact-us/contact-us.component')
            .then(c => c.ContactUsComponent)
      },

      {
        path: routeName('hospitals', 'en'),
        loadComponent: () =>
          import('./components/hospitals/hospitals.component')
            .then(c => c.HospitalsComponent)
      },
      {
        path: routeName('hospitals', 'ar'),
        loadComponent: () =>
          import('./components/hospitals/hospitals.component')
            .then(c => c.HospitalsComponent)
      },

      // Polyclinics
      {
        path: routeName('polyclinics', 'en'),
        loadComponent: () =>
          import('./components/polyclinics/polyclinics.component')
            .then(c => c.PolyclinicsComponent)
      },
      {
        path: routeName('polyclinics', 'ar'),
        loadComponent: () =>
          import('./components/polyclinics/polyclinics.component')
            .then(c => c.PolyclinicsComponent)
      },

      // PolyDoctors
      {
        path: routeName('PolyDoctors', 'en'),
        loadComponent: () =>
          import('./components/poly-clinic-doctors/poly-clinic-doctors.component')
            .then(c => c.PolyClinicDoctorsComponent)
      },
      {
        path: routeName('PolyDoctors', 'ar'),
        loadComponent: () =>
          import('./components/poly-clinic-doctors/poly-clinic-doctors.component')
            .then(c => c.PolyClinicDoctorsComponent)
      },


      {
        path: routeName('pharmacies', 'en'),
        loadComponent: () =>
          import('./components/pharmacies/pharmacies.component')
            .then(c => c.PharmaciesComponent)
      },
      {
        path: routeName('pharmacies', 'ar'),
        loadComponent: () =>
          import('./components/pharmacies/pharmacies.component')
            .then(c => c.PharmaciesComponent)
      },
      {
        path: routeName('laboratories', 'en'),
        loadComponent: () =>
          import('./components/laboratories/laboratories.component')
            .then(c => c.LaboratoriesComponent)
      },
      {
        path: routeName('laboratories', 'ar'),
        loadComponent: () =>
          import('./components/laboratories/laboratories.component')
            .then(c => c.LaboratoriesComponent)
      },

      {
        path: routeName('radiology-center', 'en'),
        loadComponent: () =>
          import('./components/radiology-center/radiology-center.component')
            .then(c => c.RadiologyCenterComponent)
      },
      {
        path: routeName('radiology-center', 'ar'),
        loadComponent: () =>
          import('./components/radiology-center/radiology-center.component')
            .then(c => c.RadiologyCenterComponent)
      },

      {
        path: routeName('SalamtakAngel', 'en'),
        loadComponent: () =>
          import('./components/angel/angel.component')
            .then(c => c.AngelComponent)
      },
      {
        path: routeName('SalamtakAngel', 'ar'),
        loadComponent: () =>
          import('./components/angel/angel.component')
            .then(c => c.AngelComponent)
      },
      {
        path: routeName('emergency', 'en'),
        loadComponent: () =>
          import('./components/emergency/emergency.component')
            .then(c => c.EmergencyComponent)
      },
      {
        path: routeName('emergency', 'ar'),
        loadComponent: () =>
          import('./components/emergency/emergency.component')
            .then(c => c.EmergencyComponent)
      },



      // Success
      // { path: routeName('succ', 'en'), component: SuccesComponent },
      // { path: routeName('succ', 'ar'), component: SuccesComponent },

      // Booking Successfully
      // {
      //   path: routeName('booking-successfully', 'en'),
      //   component: BookingSuccessfullyComponent,
      // },
      // {
      //   path: routeName('booking-successfully', 'ar'),
      //   component: BookingSuccessfullyComponent,
      // },

      // Booking Successfully Offer
      // {
      //   path: routeName('booking-successfully-offer', 'en'),
      //   component: BookingSuccessfullyOfferComponent,
      // },
      // {
      //   path: routeName('booking-successfully-offer', 'ar'),
      //   component: BookingSuccessfullyOfferComponent,
      // },

      // Salamtak Gate
    {
  path: routeName('SalamtakGate', 'en'),
  loadComponent: () =>
    import('./components/blogs/blogs.component')
      .then(m => m.BlogsComponent),
},
{
  path: routeName('SalamtakGate', 'ar'),
  loadComponent: () =>
    import('./components/blogs/blogs.component')
      .then(m => m.BlogsComponent),
},

{
  path: routeName('SalamtakGuide', 'en'),
  loadComponent: () =>
    import('./guide/guide.component')
      .then(m => m.GuideComponent),
},
{
  path: routeName('SalamtakGuide', 'ar'),
  loadComponent: () =>
    import('./guide/guide.component')
      .then(m => m.GuideComponent),
},

{
  path: routeName('MyQuestions', 'en'),
  loadComponent: () =>
    import('./components/my-questions/my-questions.component')
      .then(m => m.MyQuestionsComponent),
},
{
  path: routeName('MyQuestions', 'ar'),
  loadComponent: () =>
    import('./components/my-questions/my-questions.component')
      .then(m => m.MyQuestionsComponent),
},
{
  path: routeName('SalamtakCapsola', 'en'),
  loadComponent: () =>
    import('./components/salamtakcap/salamtakcap.component')
      .then(m => m.SalamtakcapComponent),
},
{
  path: routeName('SalamtakCapsola', 'ar'),
  loadComponent: () =>
    import('./components/salamtakcap/salamtakcap.component')
      .then(m => m.SalamtakcapComponent),
},
{
  path: routeName('SalamtakScoop', 'en'),
  loadComponent: () =>
    import('./components/scope/scope.component')
      .then(m => m.ScopeComponent),
},
{
  path: routeName('SalamtakScoop', 'ar'),
  loadComponent: () =>
    import('./components/scope/scope.component')
      .then(m => m.ScopeComponent),
},
{
  path: routeName('SalamtakTrueOrFalse', 'en'),
  loadComponent: () =>
    import('./components/true-orfalse/true-orfalse.component')
      .then(m => m.TrueOrfalseComponent),
},
{
  path: routeName('SalamtakTrueOrFalse', 'ar'),
  loadComponent: () =>
    import('./components/true-orfalse/true-orfalse.component')
      .then(m => m.TrueOrfalseComponent),
},
{
  path: routeName('SalamtakCare', 'en'),
  loadComponent: () =>
    import('./components/care/care.component')
      .then(m => m.CareComponent),
},
{
  path: routeName('SalamtakCare', 'ar'),
  loadComponent: () =>
    import('./components/care/care.component')
      .then(m => m.CareComponent),
},

{
  path: routeName('SalamtakCare', 'en') + '/:id',
  loadComponent: () =>
    import('./components/blog-details/blog-details.component')
      .then(m => m.BlogDetailsComponent),
},
{
  path: routeName('SalamtakCare', 'ar') + '/:id',
  loadComponent: () =>
    import('./components/blog-details/blog-details.component')
      .then(m => m.BlogDetailsComponent),
},


      // Salamtak Promotions
{
  path: routeName('SalamtakPromotions', 'en'),
  loadComponent: () =>
    import('./components/promotion/promotion.component')
      .then(m => m.PromotionComponent),
},
{
  path: routeName('SalamtakPromotions', 'ar'),
  loadComponent: () =>
    import('./components/promotion/promotion.component')
      .then(m => m.PromotionComponent),
},

// About
{
  path: routeName('about', 'en'),
  loadComponent: () =>
    import('./components/about/about.component')
      .then(m => m.AboutComponent),
},
{
  path: routeName('about', 'ar'),
  loadComponent: () =>
    import('./components/about/about.component')
      .then(m => m.AboutComponent),
},

// Terms of Use
{
  path: routeName('termsOf', 'en'),
  loadComponent: () =>
    import('./components/terms-of-use/terms-of-use.component')
      .then(m => m.TermsOfUseComponent),
},
{
  path: routeName('termsOf', 'ar'),
  loadComponent: () =>
    import('./components/terms-of-use-ar/terms-of-use-ar.component')
      .then(m => m.TermsOfUseArComponent),
},

// Privacy Policy
{
  path: routeName('privacyPolicy', 'en'),
  loadComponent: () =>
    import('./components/privacy-policy/privacy-policy.component')
      .then(m => m.PrivacyPolicyComponent),
},
{
  path: routeName('privacyPolicy', 'ar'),
  loadComponent: () =>
    import('./components/privacy-policy-ar/privacy-policy-ar.component')
      .then(m => m.PrivacyPolicyArComponent),
},

// Doctor Privacy
{
  path: routeName('doctorPrivacy', 'en'),
  loadComponent: () =>
    import('./components/doctors-privacy-policy/doctors-privacy-policy.component')
      .then(m => m.DoctorsPrivacyPolicyComponent),
},
{
  path: routeName('doctorPrivacy', 'ar'),
  loadComponent: () =>
    import('./components/doctors-privacy-policy-ar/doctors-privacy-policy-ar.component')
      .then(m => m.DoctorsPrivacyPolicyArComponent),
},

// My Schedule
{
  path: routeName('my-schedule', 'en'),
  loadComponent: () =>
    import('./components/my-schedule/my-schedule.component')
      .then(m => m.MyScheduleComponent),
},
{
  path: routeName('my-schedule', 'ar'),
  loadComponent: () =>
    import('./components/my-schedule/my-schedule.component')
      .then(m => m.MyScheduleComponent),
},

// Change Password
{
  path: routeName('change-password', 'en'),
  loadComponent: () =>
    import('./components/change-password/change-password.component')
      .then(m => m.ChangePasswordComponent),
},
{
  path: routeName('change-password', 'ar'),
  loadComponent: () =>
    import('./components/change-password/change-password.component')
      .then(m => m.ChangePasswordComponent),
},

// Medical
{
  path: routeName('medical', 'en') + '/:AppointmentId',
  loadComponent: () =>
    import('./components/medical/medical.component')
      .then(m => m.MedicalComponent),
},
{
  path: routeName('medical', 'ar') + '/:AppointmentId',
  loadComponent: () =>
    import('./components/medical/medical.component')
      .then(m => m.MedicalComponent),
},

// Ask
{
  path: routeName('ask', 'en'),
  loadComponent: () =>
    import('./components/askes/askes.component')
      .then(m => m.AskesComponent),
},
{
  path: routeName('ask', 'ar'),
  loadComponent: () =>
    import('./components/askes/askes.component')
      .then(m => m.AskesComponent),
},

// Ask List
{
  path: routeName('askList', 'en'),
  loadComponent: () =>
    import('./components/askeslist/askeslist.component')
      .then(m => m.AskeslistComponent),
},
{
  path: routeName('askList', 'ar'),
  loadComponent: () =>
    import('./components/askeslist/askeslist.component')
      .then(m => m.AskeslistComponent),
},

      // Questions and Answers List
      {
  path: routeName('questionList', 'en'),
  loadComponent: () =>
    import('./components/questions-answers/questions-answers.component')
      .then(m => m.QuestionsAnswersComponent),
},
{
  path: routeName('questionList', 'ar'),
  loadComponent: () =>
    import('./components/questions-answers/questions-answers.component')
      .then(m => m.QuestionsAnswersComponent),
},

{
  path: routeName('receipt', 'en'),
  loadComponent: () =>
    import('./components/my-receipt/my-receipt.component')
      .then(m => m.MyReceiptComponent),
},
{
  path: routeName('receipt', 'ar'),
  loadComponent: () =>
    import('./components/my-receipt/my-receipt.component')
      .then(m => m.MyReceiptComponent),
},

{
  path: routeName('labs', 'en'),
  loadComponent: () =>
    import('./components/labs/labs.component')
      .then(m => m.LabsComponent),
},
{
  path: routeName('labs', 'ar'),
  loadComponent: () =>
    import('./components/labs/labs.component')
      .then(m => m.LabsComponent),
},

{
  path: routeName('radiology', 'en'),
  loadComponent: () =>
    import('./components/radiology/radiology.component')
      .then(m => m.RadiologyComponent),
},
{
  path: routeName('radiology', 'ar'),
  loadComponent: () =>
    import('./components/radiology/radiology.component')
      .then(m => m.RadiologyComponent),
},

{
  path: routeName('bookingserviceType', 'en'),
  loadComponent: () =>
    import('./components/booking-service-with-type/booking-service-with-type.component')
      .then(m => m.BookingServiceWithTypeComponent),
},
{
  path: routeName('bookingserviceType', 'ar'),
  loadComponent: () =>
    import('./components/booking-service-with-type/booking-service-with-type.component')
      .then(m => m.BookingServiceWithTypeComponent),
},


      {
        path: routeName('doctor', 'en') + '/:doctorId/:doctorName',
        loadComponent: () =>
          import('./components/doctor-profile/doctor-profile.component')
            .then(c => c.DoctorProfileComponent)
      },
      {
        path: routeName('doctor', 'ar') + '/:doctorId/:doctorName',
        loadComponent: () =>
          import('./components/doctor-profile/doctor-profile.component')
            .then(c => c.DoctorProfileComponent)
      },
      {
        path: routeName('services', 'ar'),
        loadComponent: () =>
          import('./services/services.component')
            .then(m => m.ServicesComponent),
      },
      {
        path: routeName('services', 'en'),
        loadComponent: () =>
          import('./services/services.component')
            .then(m => m.ServicesComponent),
      },

      {
        path: routeName('offers', 'ar'),
        loadComponent: () =>
          import('./offers/offers.component')
            .then(m => m.OffersComponent),
      },
      {
        path: routeName('offers', 'en'),
        loadComponent: () =>
          import('./offers/offers.component')
            .then(m => m.OffersComponent),
      },

      {
        path: routeName('offer', 'ar') + '/:offerId',
        loadComponent: () =>
          import('./components/offer/offer.component')
            .then(m => m.OfferComponent),
      },
      {
        path: routeName('offer', 'en') + '/:offerId',
        loadComponent: () =>
          import('./components/offer/offer.component')
            .then(m => m.OfferComponent),
      },

      // bookOffer
      {
        path: routeName('bookOffer', 'en') + '/:offerId',
        loadComponent: () =>
          import('./components/booked-offer/booked-offer.component')
            .then(m => m.BookedOfferComponent),
      },
      {
        path: routeName('bookOffer', 'ar') + '/:offerId',
        loadComponent: () =>
          import('./components/booked-offer/booked-offer.component')
            .then(m => m.BookedOfferComponent),
      },

      {
        path: '',
        loadComponent: () =>
          import('./@layouts/listing-layout/listing-layout.component')
            .then(c => c.ListingLayoutComponent),
        children: [
          {
            path: routeName('profile', 'en'),
            loadComponent: () =>
              import('./components/profile/profile.component')
                .then(c => c.ProfileComponent),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./components/profile/profile-steps/first-step/first-step.component')
                    .then(c => c.FirstStepComponent),
              },
              {
                path: routeName('personal-info', 'en'),
                loadComponent: () =>
                  import('./components/profile/profile-steps/first-step/first-step.component')
                    .then(c => c.FirstStepComponent),
              },
              {
                path: routeName('location', 'en'),
                loadComponent: () =>
                  import('./components/profile/profile-steps/second-step/second-step.component')
                    .then(c => c.SecondStepComponent),
              },
              {
                path: routeName('medical-state', 'en'),
                loadComponent: () =>
                  import('./components/profile/profile-steps/third-step/third-step.component')
                    .then(c => c.ThirdStepComponent),
              },
            ],
          },

          // AR
          {
            path: routeName('profile', 'ar'),
            loadComponent: () =>
              import('./components/profile/profile.component')
                .then(c => c.ProfileComponent),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./components/profile/profile-steps/first-step/first-step.component')
                    .then(c => c.FirstStepComponent),
              },
              {
                path: routeName('personal-info', 'ar'),
                loadComponent: () =>
                  import('./components/profile/profile-steps/first-step/first-step.component')
                    .then(c => c.FirstStepComponent),
              },
              {
                path: routeName('location', 'ar'),
                loadComponent: () =>
                  import('./components/profile/profile-steps/second-step/second-step.component')
                    .then(c => c.SecondStepComponent),
              },
              {
                path: routeName('medical-state', 'ar'),
                loadComponent: () =>
                  import('./components/profile/profile-steps/third-step/third-step.component')
                    .then(c => c.ThirdStepComponent),
              },
            ],
          },
        ],
      },

      {
        path: '',
        loadComponent: () =>
          import('./@layouts/doctors-layout/doctors-layout.component')
            .then(c => c.DoctorsLayoutComponent),

        children: [
          // FindADoctor EN
          {
            path: routeName('find-a-doctor', 'en'),
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'en') + '/:specialty',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'en') + '/:specialty/:city',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'en') + '/:specialty/:city/:area',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },

          // FindADoctor AR
          {
            path: routeName('find-a-doctor', 'ar'),
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'ar') + '/:specialty',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'ar') + '/:specialty/:city',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'ar') + '/:specialty/:city/:area',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
        ],
      }
      ,

      {
        path: '',
        loadComponent: () =>
          import('./@layouts/doctors-layout/doctors-layout.component')
            .then(c => c.DoctorsLayoutComponent),
        children: [
          {
            path: routeName('find-a-doctor', 'en'),
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'en') + '/:specialty',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'en') + '/:specialty/:city',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'en') + '/:specialty/:city/:area',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },

          // AR
          {
            path: routeName('find-a-doctor', 'ar'),
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
          {
            path: routeName('find-a-doctor', 'ar') + '/:specialty/:city/:area',
            loadComponent: () =>
              import('./components/find-a-doctor/find-a-doctor.component')
                .then(c => c.FindADoctorComponent),
          },
        ],
      },

    ],
  },
  { path: 'sitemap', component: SitemapComponent },

];
