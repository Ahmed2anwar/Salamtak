export interface Specialty {
  Id: number;
  Name: string;
  Image: string;
  inactive: boolean;
}
export interface Doctor {
  DoctorId: number;
  DoctorName: string;
  DoctorSpeciality: string;
  DoctorImage: string;
  Rate: number;
  DoctorNameEn: string;
  DoctorNameAr: string;
  DoctorSpec: string;
  DoctorSpecAr: string;
  FeesTo: number;
  clinicDto: ClinicDto;
}
export interface ClinicDto {
  ClinicId: number;
  Name: string;
  Address: string;
  AreaName: string;
  CityName  : string;
}
export interface ApiResponse {
  Data: Doctor[];
  Message?: string;
  Success?: boolean;
  MessageCode?: number;
}
