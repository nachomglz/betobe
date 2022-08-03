export interface IVideosValidator {
  video_name: string;
  video_url: string;
}
export interface IPassportValidator {
  country: string;
}
export interface IAgencyValidator {
  agency_name: string;
  agency_email: string;
  agency_phone: string;
  agency_description: string;
}
export interface IBodyValidator {
  name: string;
  surname: string;
  description: string;
  email: string;
  phone?: string;
  birthdate: Date;
  weight: number;
  height: number;
  country: string;
  agency?: IAgencyValidator;
  laterality: string;
  position: string;
  passports?: Array<IPassportValidator>;
  videos?: Array<IVideosValidator>;
  current_team?: string;
}
export interface IErrorValidator {
  field: string;
  message: string;
}
