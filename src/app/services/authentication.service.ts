import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { RoutesPipe } from '../pipes/routes.pipe';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpInterceptor } from '@angular/common/http';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  private step: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);
  public getStep(): Observable<Number> {
    return this.step.asObservable();
  }
  public setStep(value: Number): void {
    this.step.next(value);
  }

  // setRefreshToken(token: any) {
  constructor(
    private router: Router,
    private http: HttpClient,
    private StorageService: LocalStorageService,
    // RoutesPipe
    private route: RoutesPipe
  ) {
    // this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(this.StorageService.getItem('currentUser')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    if (this.currentUserSubject.value != null) {
      return this.currentUserSubject.value;
    }
  }
   private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasUser());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private hasUser(): boolean {
    return !! this.StorageService.getItem('currentUser');
  }

  setLoggedIn(state: boolean) {
    this.isLoggedInSubject.next(state);
  }

  getCurrentUser() {
    const user = this.StorageService.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }     
  login(form: any): Observable<any> {
    // https://salamtechapi.azurewebsites.net/api/en/User/Login
    return this.http.post<any>(`${environment.apiUrl}/User/Login`, form).pipe(
      map((user: any) => {
        if (user && user.Data.Token) {
          // localStorage.setItem('currentUser', JSON.stringify(user.Data));
          this.StorageService.setItem('currentUser', JSON.stringify(user.Data));
          this.currentUserSubject.next(user.Data);
        }
        return user.Data;
      })
    );
  }

  signup(form: any): Observable<any> {
    var newForm = {
      Email: form.Email,
      Phone: 0 + form.Phone,
      Password: form.Password,
      Name: form.FullNameEn,
      NameAR: form.FullNameAr,
      UserTypeId: 3,
    };

    return this.http.post<any>(`${environment.apiUrl}/User/Register`, newForm);
  }
  resend(form: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/User/ResetPassword`,
      form
    );
  }
  createUser(form: any): Observable<any> {
    var newForm = {
      Email: form.Email,
      Phone: 0 + form.Phone,
      Password: form.Password,
      Name: form.FullNameEn,
      UserTypeId: 3,
    };
    return this.http
      .post<any>(`${environment.apiUrl}/User/CreateUser`, newForm)
      .pipe(
        map((user: any) => {
          if (user && user.Data.Token) {
            // localStorage.setItem('currentWaitingUser', JSON.stringify(user.Data));
            localStorage.setItem('currentUser', JSON.stringify(user.Data));
            this.currentUserSubject.next(user.Data);
            // this.user.next(user.Data)
          }
          return user;
        })
      );
  }
  GetPatient() {
    return this.http.get(`${environment.apiUrl}/Patient/GetPatient`);
  }
  // GET /api​/{culture}​/Patient​/GetPatientMedicalInfo
  GetPatientMedicalInfo() {
    return this.http.get(`${environment.apiUrl}/Patient/GetPatientMedicalInfo`);
  }
  getCountries() {
    return this.http.get(`${environment.apiUrl}/LookUp/GetCountries`);
  }
  getSpecialist() {
    return this.http.get<any>(`${environment.apiUrl}/Specialist/GetSpecialist`);
  }
  // Occupation
  getOccupations() {
    return this.http.get(`${environment.apiUrl}/LookUp/GetOccupation`);
  }
  getCities(countryId: any) {
    return this.http.get(
      `${environment.apiUrl}/City/GetCities?CountryId=${countryId}`
    );
  }
  //     GET ​/api​/{culture}​/Area​/GetAreasByCityId
  getAreas(cityId: any) {
    return this.http.get(
      `${environment.apiUrl}/Area/GetAreasByCityId?CityId=${cityId}`
    );
  }
  // GET /api​/{culture}​/PatientLookUp​/GetBloodTypes
  getBloodTypes() {
    return this.http.get(`${environment.apiUrl}/PatientLookUp/GetBloodTypes`);
  }
  CreatePatientProfileFirstStep(form: any) {
    const formData: FormData = new FormData();
    formData.append('FullName', form.FullNameEn);
    formData.append('FullNameAr', form.FullNameAr);
    formData.append('OccupationId', form.OccupationId);
    formData.append('GenderId', form.GenderId);
    formData.append('Birthdate', form.Birthdate);
    formData.append('NationalityId', form.NationalityId);
    formData.append('profileImage', form.profileImage || null);
    return this.http.post(
      `${environment.apiUrl}/Patient/CreatePatientProfileFirstStep`,
      formData
    );
  }

  CreateQandAForPatient(form: any) {
    const formData: FormData = new FormData();
    formData.append('SpecialistID', form.SpecialistID);
    formData.append('Question', form.Question);
    formData.append('QDetails', form.QDetails);
    formData.append('GenderID', form.GenderID);
    formData.append('IsForMe', form.IsForMe);
    formData.append('Age', form.Age);
    formData.append('Answer', form.Answer || null);
    return this.http.post(
      `${environment.apiUrl}/Patient/CreateQandAForPatient`,
      formData
    );
  }
  UpdatePatientProfileFirstStep(form: any) {
    const formData: FormData = new FormData();
    formData.append('FullName', form.FullNameEn);
    formData.append('FullNameAr', form.FullNameAr);
    formData.append('OccupationId', form.OccupationId);
    formData.append('GenderId', form.GenderId);
    formData.append('Birthdate', form.Birthdate);
    formData.append('NationalityId', form.NationalityId);
    // formData.append('profileImage',form.profileImage || null)
    return this.http.post(
      `${environment.apiUrl}/Patient/UpdatePatientProfileFirstStep`,
      formData
    );
  }
  UpdatePatientProfileSecondStep(form: any) {
    form = {
      CountryId: form?.CountryId?.Id || 1,
      FloorNo: +form.FloorNo || null,
      CityId: form.CityId.Id,
      AreaId: form.AreaId.Id,
      BlockNo: String(form.BlockNo) || null,
      ApartmentNo: String(form.ApartmentNo) || null,
      Address: form.Address,
    };
    return this.http.post(
      `${environment.apiUrl}/Patient/CreateAndUpdatePatientProfileSecondStep`,
      form
    );
  }
  UpdatePatientProfileThirdStep(form: any) {
    return this.http.post(
      `${environment.apiUrl}/Patient/UpdatePatientMedicalInfo`,
      form
    );
  }
  updatePassword(form: any) {
    return this.http.post(`${environment.apiUrl}/User/UpdatePassword`, form);
  }
  CreatePatientProfileThirdStep(form: any) {
    return this.http.post(
      `${environment.apiUrl}/Patient/CreatePatientMedicallInfo`,
      form
    );
  }
  ResetPassword(form: any) {
    return this.http.post(`${environment.apiUrl}/User/ResetPassword`, form);
  }
  //     POST
  // ​/api​/{culture}​/User​/UpdatePassword

  UpdatePassword(form: any) {
    return this.http.post(`${environment.apiUrl}/User/ChangePassword`, form);
  }
  getQandAQuestien() {
    return this.http.get(
      `${environment.apiUrl}/Patient/GetAllQandAByPatientId`
    );
  }
  logout() {
    this.router.navigate([this.route.transform('home')]);
    this.StorageService.removeItem('currentUser');
    this.StorageService.removeItem(`${environment.localStorageUserKey}`);
    this.currentUserSubject.next(null);
  }
  getUnreadDoctorResponsesByUserIdAsync() {
    return this.http.get(
      `${environment.apiUrl}/Patient/GetUnreadDoctorResponses`
    );
  }
  markAllDoctorResponsesAsReadAsync() {
    return this.http.post(
      `${environment.apiUrl}/Patient/MarkAllDoctorResponses`,
      null
    );
  }
  getSypmptoms(specialityID: any) {
    return this.http.get(
      `${environment.apiUrl}/Patient/GetSymptomsBySpecialityId?specialityId=${specialityID}`
    );
  }
  createPatientSymptoms(form: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/Patient/CreatePatientSymptoms`,
      form
    );
  }
}
