import {
   IVideosValidator,
   IPassportValidator,
} from "../utils/validations.types";

export const validateName = (name: string): boolean =>
   name !== null && name !== undefined && name.length > 2;
export const validateSurname = (surname: string): boolean =>
   surname !== null && surname !== undefined && surname.length > 2;
export const validateDescription = (description: string): boolean =>
   description !== null && description !== undefined && description.length > 10;
export const validateEmail = (email: string): boolean =>
   email !== null &&
   email !== undefined &&
   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
      email
   );
export const validatePhone = (phone?: string): boolean =>
   phone === null || !phone || phone.length === 0 || phone.length >= 7;
export const validateBirthdate = (birthdate: Date): boolean => {
   // replace slash with a - just in case
   var str_birthdate = birthdate.toString().replace("/", "-");
   var split_birthdate: Array<any> = str_birthdate.split("-");
   split_birthdate.forEach(
      (element, index) => (split_birthdate[index] = parseInt(element))
   );

   const personBirthDate: Date = new Date(
      split_birthdate[0],
      split_birthdate[1] - 1,
      split_birthdate[2]
   );
   console.log(split_birthdate);
   console.log(birthdate);
   console.log(personBirthDate);

   // Get valid date to have 16 years old
   const today = new Date();

   const validDate: Date = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
   );
   // Test if personBirthDate is over 16 years old
   return personBirthDate <= validDate;
};
export const validateWeight = (weight: number): boolean =>
   !isNaN(weight) && weight !== null && weight !== undefined && weight >= 40;
export const validateHeight = (height: number): boolean =>
   !isNaN(height) && height !== null && height !== undefined && height >= 1.4;
export const validateCountry = (country: string): boolean =>
   country !== null && country !== undefined && country.length > 2;
export const validateAgencyName = (agencyName?: string): boolean =>
   agencyName !== null && agencyName !== undefined && agencyName.length > 2;
export const validateAgencyEmail = (agencyEmail?: string): boolean =>
   agencyEmail !== null &&
   agencyEmail !== undefined &&
   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
      agencyEmail
   );
export const validateAgencyPhone = (agencyPhone?: string): boolean =>
   agencyPhone === null ||
   !agencyPhone ||
   agencyPhone.length === 0 ||
   agencyPhone.length >= 7;
export const validateAgencyDescription = (agecyDescription?: string): boolean =>
   agecyDescription !== null &&
   agecyDescription !== undefined &&
   agecyDescription.length > 10;
export const validateLaterality = (laterality: string): boolean => {
   const LATERALITIES: Array<string> = ["diestro", "zurdo", "ambidiestro"];
   return (
      laterality !== null &&
      laterality !== undefined &&
      LATERALITIES.includes(laterality.toLowerCase())
   );
};
export const validatePosition = (position: string): boolean => {
   const POSITIONS: Array<string> = [
      "portero",
      "defensa",
      "medio",
      "centrocampista",
      "delantero",
   ];
   return (
      position !== null &&
      position !== undefined &&
      POSITIONS.includes(position.toLowerCase())
   );
};
export const validateCurrentTeam = (current_team?: string): boolean =>
   current_team === undefined ||
   current_team === null ||
   current_team === "" ||
   current_team.length > 0;
export const validateVideos = (videos?: IVideosValidator[]): boolean =>
   videos === null ||
   !videos ||
   videos.length === 0 ||
   videos.every(({ video_url }: IVideosValidator) =>
      video_url.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/g)
   );
export const validatePassports = (passports?: IPassportValidator[]): boolean =>
   passports === null ||
   !passports ||
   passports.length === 0 ||
   passports.every(({ country }: IPassportValidator) =>
      validateCountry(country)
   );
