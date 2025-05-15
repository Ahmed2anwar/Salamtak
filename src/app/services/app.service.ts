import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { environment } from '../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { COMPONENT_KEYWORDS } from '../component-keywords';
import { Data } from '@angular/router';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private selectedOffer: any;
  titleKey: any;
  descriptionKey: any;

  public specialty: BehaviorSubject<Data> = new BehaviorSubject<Data>({});
  public SubSpecial: BehaviorSubject<Data> = new BehaviorSubject<Data>({});
  culture: any;

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
    private translocoService: TranslocoService
  ) {}
  setSpecialty(data: any) {
    this.specialty.next(data);
  }
  setSubSpecial(data: any) {
    this.SubSpecial.next(data);
  }

  getSpecialty() {
    return this.specialty;
  }
  getSubSpecial() {
    return this.SubSpecial;
  }
  // home - Our Services
  getMedicalExaminationType() {
    return this.http.get<any>(
      `${environment.apiUrl}/LookUp/GetMedicalExaminationType`
    );
  }
  findDoctorsByFilters(form: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/DoctorSearch/DoctorSearch`,
      form
    );
  }
  GetDoctorPolyClinic(ClinicId: any) {
    return this.http.get(
      `${
        environment.apiUrl
      }/Doctor/GetDoctorByClinicId?ClinicId=${ClinicId}&IsApproved=${true}`
    );
  }
  getDoctorDetail(
    doctorId: any,
    MedicalExaminationTypeId: any,
    SchedualDate: any,
    ClinicId: any = null
  ) {
    let url = `${environment.apiUrl}/Doctor/GetDoctorProfileByDoctorId?DoctorId=${doctorId}`;

    return this.http.get<any>(url);

    // return this.http.get<any>(`${environment.apiUrl}/Doctor/GetDoctorProfileByDoctorId?doctorId=${doctorId}&MedicalExaminationTypeId=${MedicalExaminationTypeId}&SchedualDate=${SchedualDate}&ClinicId=${ClinicId}`,)
  }
  GetDoctorVideos(DoctorID: any) {
    return this.http.get(
      `${environment.apiUrl}/Doctor/GetDoctorVideos?DoctorID=${DoctorID}`
    );
  }
  getClinicGalleryByClinicId(ClinicId: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/DoctorClinic/GetClinicGalleryByClinicId?ClinicId=${ClinicId}`
    );
  }
  getSeniorityLevel() {
    return this.http.get<any>(
      `${environment.apiUrl}/SeniorityLevel/GetSeniorityLevel`
    );
  }
  getspecialist() {
    return this.http.get<any>(`${environment.apiUrl}/Specialist/GetSpecialist`);
  }
  getSubSpecialist(SpecialistId: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/Specialist/GetSubSpecialist?SpecialistId=${SpecialistId}`
    );
  }
  // GET /api​/{culture}​/Specialist​/GetListOfSubSpecialistList
  getListOfSubSpecialistList(SpecialistId: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/Specialist/GetListOfSubSpecialistList?SpecialistId=${SpecialistId}`
    );
  }
  getClinicSchedualByClinicDayId(
    ClinicId: any,
    DayId: any,
    MedicalExaminationTypeId: any,
    BookDate: any
  ) {
    return this.http.get<any>(
      `${environment.apiUrl}/DoctorClinic/GetClinicSchedualByClinicDayId?ClinicId=${ClinicId}&DayId=${DayId}&MedicalExaminationTypeId=${MedicalExaminationTypeId}&BookDate=${BookDate}`
    );
  }
  getSchedualByClinicIdPolyClinic(
    ClinicId: any,
    DoctorID: any,
    DayId: any,
    MedicalExaminationTypeId: any,
    BookDate: any
  ) {
    return this.http.get(
      `${environment.apiUrl}/DoctorClinic/GetPolyClinicSchedualByClinicDayId?ClinicId=${ClinicId}&DoctorID=${DoctorID}&DayId=${DayId}&MedicalExaminationTypeId=${MedicalExaminationTypeId}&BookDate=${BookDate}`
    );
  }

  createPatientappointment(form: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/Patient/CreatePatientAppointment`,
      form
    );
  }

  editPatientappointment(
    AppointmentId: any,
    DoctorWorkingDayTimeId: any,
    AppointmentDate: any
  ) {
    return this.http.get<any>(
      `${environment.apiUrl}/PatientAppointment/EditPatientAppointment?AppointmentId=${AppointmentId}&DoctorWorkingDayTimeId=${DoctorWorkingDayTimeId}&AppointmentDate=${AppointmentDate}`
    );
  }
  // POST ​/api​/{culture}​/Doctor​/GetPopularDoctors
  getPopularDoctors() {
    return this.http.post<any>(
      `${environment.apiUrl}/Doctor/GetPopularDoctors`,
      {}
    );
  }
  // GET /api​/{culture}​/LookUp​/GetDoctorHealthTopics
  getDoctorHealthTopics() {
    return this.http.get<any>(
      `${environment.apiUrl}/LookUp/GetDoctorHealthTopics`
    );
  }
  // GET /api​/{culture}​/Ads​/GetWhatsAppAds
  getWhatsAppAds() {
    return this.http.get<any>(
      `${environment.apiUrl}/Ads/GetWhatsAppAds?DoctorApp=false`
    );
  }

  // GET /api​/{culture}​/PatientAppointment​/GetPatientAppointmentes
  getPatientAppointmentes() {
    return this.http.get<any>(
      `${environment.apiUrl}/PatientAppointment/GetPatientAppointmentes`
    );
  }

  getUpcomingAppointmentes() {
    return this.http.get<any>(
      `${environment.apiUrl}/PatientAppointment/GetUpcomingAppointmentes`
    );
  }
  getMedicalHistoryAppointmentes() {
    return this.http.get<any>(
      `${environment.apiUrl}/PatientAppointment/GetMedicalHistoryAppointmentes`
    );
  }
  getCanceledAppointmentes() {
    return this.http.get<any>(
      `${environment.apiUrl}/PatientAppointment/GetCanceledAppointmentes`
    );
  }

  // GET ​/api​/{culture}​/DoctorAppointment​/CancelAppointment | AppointmentId & CancelReason
  cancelAppointment(AppointmentId: any, CancelReason = 'No Reason') {
    return this.http.get<any>(
      `${environment.apiUrl}/PatientAppointment/CancelPatientAppointment?AppointmentId=${AppointmentId}&CancelReason=${CancelReason}`
    );
  }
  // GET
  // (/api/culture/DoctorRate/GetDoctorRateByDoctorIdPagedList)
  getDoctorRateByDoctorIdPagedList(
    DoctorId: any,
    PageNumber: any,
    PageSize: any
  ) {
    return this.http.get<any>(
      `${environment.apiUrl}/DoctorRate/GetDoctorRateByDoctorIdPagedList?DoctorId=${DoctorId}&PageNumber=${PageNumber}&PageSize=${PageSize}`
    );
  }
  // POST  ​/api​/{culture}​/DoctorRate​/CreateDoctorRate
  //   {
  //   "DoctorId": 0,
  //   "Rate": 5,
  //   "Comment": "string"
  // }
  createDoctorRate(form: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/DoctorRate/CreateDoctorRate`,
      form
    );
  }
  // ​/api​/{culture}​/Ads​/GetBlogs
  getBlogs() {
    // Api/en/lookup/getBlogs
    return this.http.get<any>(`${environment.apiUrl}/lookup/GetBlogs`);
  }
  getOffers() {
    return this.http.get<any>(`${environment.apiUrl}/Offers/GetActiveOffers`);
  }
  gerOffersByCategory(id: any) {
    return this.http.get(
      `${environment.apiUrl}/Offers/GetActiveOffersDetails?OfferCategoryID=${id}`
    );
  }
  // POST ​/api​/{culture}​/LookUp​/CreateContactUs
  createContactUs(form: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/LookUp/CreateContactUs`,
      form
    );
  }
  // GET ​/api​/{culture}​/PatientLookUp​/GetMedicineAllergy
  getMedicineAllergy() {
    return this.http.get<any>(
      `${environment.apiUrl}/PatientLookUp/GetMedicineAllergy`
    );
  }

  // GET  ​/api​/{culture}​/PatientLookUp​/GetFoodAllergy
  getFoodAllergy() {
    return this.http.get<any>(
      `${environment.apiUrl}/PatientLookUp/GetFoodAllergy`
    );
  }
  // GET  ​/api​/{culture}​/HealthEntity​/GetHealthEntityPagedList
  getHealthEntityPagedList(HealthEntityTypeId: any, prams: any) {
    var url = `${environment.apiUrl}/HealthEntity/GetHealthEntityPagedList?HealthEntityTypeId=${HealthEntityTypeId}`;
    for (const key in prams) {
      if (Object.prototype.hasOwnProperty.call(prams, key)) {
        const element = prams[key];
        url += `&${key}=${element}`;
      }
    }
    return this.http.get<any>(url);
  }
  getHealthEntityPagedListt(prams: any) {
    let url = `${environment.apiUrl}/HealthEntity/GetFilteredPolyClinics2?`;
    for (const key in prams) {
      if (Object.prototype.hasOwnProperty.call(prams, key)) {
        const element = prams[key];
        url += `&${key}=${element}`;
      }
    }
    return this.http.get<any>(url);
  }

  getCities() {
    return this.http.get(`${environment.apiUrl}/City/GetAllCities`);
  }
  getAreas(cityId: any) {
    return this.http.get(
      `${environment.apiUrl}/Area/GetAreasByCityId?cityId=${cityId}`
    );
  }
  getBlogss(id: any) {
    // Api/en/lookup/getBlogs
    return this.http.get<any>(
      `${environment.apiUrl}/lookup/GetBlogs?salamtakGateEnum=${id}`
    );
  }
  getCitiesBycountryId(countryId: any) {
    return this.http.get(
      `${environment.apiUrl}/City/GetCities?CountryId=${countryId}`
    );
  }
  getPatientEmrDetails(appointmentId: any) {
    return this.http.get(
      `${environment.apiUrl}/Patient/GetPatientEmrDetails?appointmentId=${appointmentId}`
    );
  }
  getOfferDetailsByOfferId(offerId: any) {
    return this.http.get(
      `${environment.apiUrl}/Offers/GetActiveOffersByOfferID?OfferID=${offerId}`
    );
  }

  //New In SSR
  getAllQandA() {
    return this.http.get(`${environment.apiUrl}/LookUp/GetAllQandA`);
  }
  getInvoicesForPatient() {
    return this.http.get<any>(
      `${environment.apiUrl}/Patient/GetAllInvoicesForPatient`
    );
  }

  //forOffer
  getSelectedOffer(): any {
    return this.selectedOffer;
  }

  setSelectedOffer(offer: any): void {
    this.selectedOffer = offer;
  }

  setDefaultMetaTags() {
    const lang = localStorage.getItem('lang');

    if (lang) {
      if (lang === 'ar') {
        this.titleKey =
          ' سلامتك | احجز الأن كشف أون لاين أو في عيادة عن طريق تطبيق سلامتك واحصل علي استشارة طبية موثوقة مع نخبة من أطباء سلامتك ';
        this.descriptionKey =
          'احجز دكتور الان مع أحد نخبة اطباء سلامتك  في العيادة أو أون لاين بكل سهولة وأمان مع سلامتك. قم بالحجز السريع لاستشارة طبية في العيادة او استشارة طبية اون لاين  مع أطباء متخصصين في مختلف التخصصات وعيادات مثل طب النساء والتوليد، الجلدية، التجميل، العيون، العلاج الطبيعي، طب الأطفال، الباطنة، العظام، وطب الأسنان. استفد من خدمة الحجز الطبي الآمنة والموثوقة للحصول على الرعاية الصحية التي تحتاجها بسهولة ويسر.  ';
      } else {
        this.titleKey =
          'Salamtak Group | reserve your doctor appointment, home visits doctors or online visit.';
        this.descriptionKey =
          'With Salamtak Group, you can reserve your home visits doctors, clinic appointments, or clinic visit in all medical specialties online.    (for online url) Salamtak group is a medical care application that provides you with an online reservation to the nearest doctor clinic, in all medical specialties, along with a free online medical advice and online doctor consultation through Salamtak teleservices(Video call, and call).';
      }
    }

    const defaultKeywords: any = COMPONENT_KEYWORDS.defaultKeywords.join(', ');
    this.updateMetaTags(this.titleKey, this.descriptionKey, defaultKeywords);
  }

  updateMetaTags(title: string, description: string, keywords: string) {
    try {
      // Translate title, description, and keywords if necessary
      const translatedTitle = this.translocoService.translate(title);
      const translatedDescription =
        this.translocoService.translate(description);
      const translatedKeywords = this.translocoService.translate(keywords);

      // Update meta tags with translated content
      this.titleService.setTitle(translatedTitle);
      this.metaService.updateTag({
        name: 'description',
        content: translatedDescription,
      });
      this.metaService.updateTag({
        name: 'keywords',
        content: translatedKeywords,
      });
    } catch (error) {
      console.error('Error updating meta tags:', error);
      // Handle error if translation fails or any other error occurs
    }
  }

  updateDynamicMetaTags(
    titleKey: string,
    descriptionKey: string,
    keywords: string
  ) {
    // Fetch translated meta title and description for the current page
    const translatedTitle = this.translocoService.translate(titleKey);
    const translatedDescription =
      this.translocoService.translate(descriptionKey);

    this.titleService.setTitle(translatedTitle);
    this.metaService.updateTag({
      name: 'description',
      content: translatedDescription,
    });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
  }
  getAllDoctors() {
    return this.http.post(
      `${environment.apiUrl}/Doctor/GetAllDoctors_ShortData`,
      {}
    );
  }
  // GET
  // ​/api​/{culture}​/Doctor​/GetDoctorProfileByDoctorId
  getDoctorProfileByDoctorId(DoctorId: number) {
    return this.http.get(
      `${environment.apiUrl}/Doctor/GetDoctorProfileByDoctorId?DoctorId=${DoctorId}`
    );
  }
  // GET ​/api​/{culture}​/LookUp​/GetNameInOtherLanguage
  getNameInOtherLanguage(tableType: number, name: string) {
    return this.http.get(
      `${environment.apiUrl}/LookUp/GetNameInOtherLanguage?tableType=${tableType}&name=${name}`
    );
  }
  // GET
  // ​/api​/{culture}​/Doctor​/GetDoctorProfileByDoctorIdAndClinicID
  getDoctorProfileByDoctorIdAndClinicID(DoctorId: any, ClinicId: any) {
    return this.http.get(
      `${environment.apiUrl}/Doctor/GetDoctorProfileByDoctorIdAndClinicID?DoctorId=${DoctorId}&ClinicId=${ClinicId}`
    );
  }

  //Labs Enpoints.

  getServicesByType(typeId: number): Observable<any> {
    const apiUrl = `${environment.apiUrl}/HealthEntity/GetServicesByType?typeId=${typeId}`;
    return this.http.get<any>(apiUrl);
  }

  getLabsByTypeId(typeId: number): Observable<any> {
    const apiUrl = `${environment.apiUrl}/HealthEntity/GetLabsByTypeId?typeId=${typeId}`;
    console.log('Fetching from:', apiUrl);
    return this.http.get<any>(apiUrl);
  }

  getLabsByFilters(payload: { typeId: number; serviceIds: number[] }) {
    return this.http.post(
      `${environment.apiUrl}/HealthEntity/GetLabsByFilters`,
      payload
    );
  }

  // getLabBranches(payload: { LabId: number, ServiceIds: number[], TypeId: number }): Observable<any> {
  //   const culture = 'en'; // Change dynamically if needed
  //   const apiUrl = `${environment.apiUrl}/api/${culture}/HealthEntity/GetLabBranches`;

  //   return this.http.post<any>(apiUrl, payload);
  // }

  // getLabBranches(payload: { LabId: number, ServiceIds: number[], TypeId: number }): Observable<any> {
  //   const culture = 'en'; // Change dynamically if needed
  //   const apiUrl = `${environment.apiUrl}/api/${culture}/HealthEntity/GetLabBranches`;

  //   console.log('Requesting:', apiUrl, 'with payload:', payload); // Debugging log

  //   return this.http.post<any>(apiUrl, payload).pipe(
  //     catchError(error => {
  //       console.error('Error fetching lab branches:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  getLabBranches(
    labId: number,
    serviceIds: number[],
    typeId: number = 1
  ): Observable<any> {
    const culture = 'en'; // Change dynamically if needed
    const apiUrl = `${environment.apiUrl}/api/${culture}/HealthEntity/GetLabBranches`;

    const body = {
      LabId: labId,
      ServiceIds: serviceIds,
      TypeId: typeId,
    };
    return this.http.post(apiUrl, body);
  }
}
