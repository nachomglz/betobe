import { IPlayer } from "./types";

interface IErrorValidator {
  field: string;
  message: string;
}
interface IVideosValidator {
  video_name: string;
  video_url: string;
}
interface IPassportValidator {
  country: string;
}

const PlayerValidator = (player: IPlayer): IErrorValidator[] => {
  let errors: IErrorValidator[] = [];
  // Validate name
  if (!validateName(player.name))
    errors.push({
      field: "name",
      message: "El nombre debe tener más de 2 caracteres",
    });
  // Validate surname
  if (!validateSurname(player.surname))
    errors.push({
      field: "surname",
      message: "El apellido debe tener más de 2 caracteres",
    });
  // Validate description
  if (!validateDescription(player.description))
    errors.push({
      field: "description",
      message: "La descripción debe tener más de 10 caracteres",
    });
  // Validate email
  if (!validateEmail(player.email))
    errors.push({
      field: "email",
      message: "El email no es válido",
    });
  // Validate phone
  if (!validatePhone(player.phone))
    errors.push({
      field: "phone",
      message: "El teléfono debe tener más de 9 caracteres",
    });
  // Validate birthdate
  if (!validateBirthdate(player.birthdate))
    errors.push({
      field: "birthdate",
      message: "La fecha de nacimiento no es válida",
    });
  // Validate weight
  if (!validateWeight(player.weight))
    errors.push({
      field: "weight",
      message: "El peso debe ser al menos 40kg",
    });
  // Validate height
  if (!validateHeight(player.height))
    errors.push({
      field: "height",
      message: "La altura debe ser al menos 1.4m",
    });
  // Validate country
  if (!validateCountry(player.country)) {
    errors.push({
      field: "country",
      message: "El país debe tener más de 2 caracteres",
    });
  }

  if (player.agency !== undefined && player.agency !== null) {
    if (!validateAgencyName(player.agency?.agency_name))
      errors.push({
        field: "agency.agency_name",
        message: "El nombre de la agencia debe tener más de 2 caracteres",
      });
    if (!validateAgencyEmail(player.agency?.agency_email))
      errors.push({
        field: "agency.agency_email",
        message: "El email de la agencia no es válido",
      });
    if (!validateAgencyDescription(player.agency?.agency_description))
      errors.push({
        field: "agency.agency_description",
        message:
          "La descripción de la agencia debe tener más de 10 caracteres",
      });
    if (!validateAgencyPhone(player.agency?.agency_phone))
      errors.push({
        field: "agency.agency_phone",
        message: "El teléfono de la agencia debe tener más de 6 caracteres",
      });
  }

  // Validate agency data

  // Validate laterality
  if (!validateLaterality(player.laterality))
    errors.push({
      field: "laterality",
      message: "La lateralidad no es válida",
    });
  // Validate position
  if (!validatePosition(player.position))
    errors.push({
      field: "position",
      message: "La posición no es válida",
    });
  // Validate current team
  if (!validateCurrentTeam(player.current_team))
    errors.push({
      field: "current_team",
      message: "El nombre del equipo actual no es válido",
    });
  // Validate videos
  if (!validateVideos(player.videos))
    errors.push({
      field: "videos",
      message: "La url de uno de los videos no es válida",
    });
  // Validate passports
  if (!validatePassports(player.passports))
    errors.push({
      field: "passports",
      message: "El país de uno de los pasaportes no es válido",
    });
  return errors;
};

const validateName = (name: string): boolean =>
  name !== null && name !== undefined && name.length > 2;
const validateSurname = (surname: string): boolean =>
  surname !== null && surname !== undefined && surname.length > 2;
const validateDescription = (description: string): boolean =>
  description !== null && description !== undefined && description.length > 10;
const validateEmail = (email: string): boolean =>
  email !== null &&
  email !== undefined &&
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
    email
  );
const validatePhone = (phone?: string): boolean =>
  phone === null || !phone || phone.length === 0 || phone.length >= 7;
const validateBirthdate = (birthdate: Date): boolean => {
  if (!birthdate) return false;

  var split_birthdate: Array<any> = birthdate.toString().split("-");
  split_birthdate.forEach(
    (element, index) => (split_birthdate[index] = parseInt(element))
  );

  const personBirthDate: Date = new Date(
    split_birthdate[0],
    split_birthdate[1] - 1,
    split_birthdate[2]
  );

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
const validateWeight = (weight: number): boolean =>
  !isNaN(weight) && weight !== null && weight !== undefined && weight >= 40;
const validateHeight = (height: number): boolean =>
  !isNaN(height) && height !== null && height !== undefined && height >= 1.4;
const validateCountry = (country: string): boolean =>
  country !== null && country !== undefined && country.length > 2;
const validateAgencyName = (agencyName?: string): boolean =>
  agencyName !== null && agencyName !== undefined && agencyName.length > 2;
const validateAgencyEmail = (agencyEmail?: string): boolean =>
  agencyEmail !== null &&
  agencyEmail !== undefined &&
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
    agencyEmail
  );
const validateAgencyPhone = (agencyPhone?: string): boolean =>
  agencyPhone === null ||
  !agencyPhone ||
  agencyPhone.length === 0 ||
  agencyPhone.length >= 7;
const validateAgencyDescription = (agecyDescription?: string): boolean =>
  agecyDescription !== null &&
  agecyDescription !== undefined &&
  agecyDescription.length > 10;
const validateLaterality = (laterality: string): boolean => {
  const LATERALITIES: Array<string> = ["diestro", "zurdo", "ambidiestro"];
  return (
    laterality !== null &&
    laterality !== undefined &&
    LATERALITIES.includes(laterality.toLowerCase())
  );
};
const validatePosition = (position: string): boolean => {
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
const validateCurrentTeam = (current_team?: string): boolean =>
  current_team === undefined ||
  current_team === null ||
  current_team === "" ||
  current_team.length > 0;
const validateVideos = (videos?: IVideosValidator[]): boolean =>
  videos === null ||
  !videos ||
  videos.length === 0 ||
  videos.every(({ video_url }: IVideosValidator) =>
    video_url.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/g)
  );
const validatePassports = (passports?: IPassportValidator[]): boolean =>
  passports !== null &&
  passports !== undefined &&
  passports.length > 0 &&
  passports.every((passport: IPassportValidator) => {
    if (passport.country !== undefined) {
      return validateCountry(passport.country)
    } else {
      return false
    }
  }
  );

export default PlayerValidator;
