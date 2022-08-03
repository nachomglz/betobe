import express from "express";
// Import Interfaces and Types
import { IBodyValidator, IErrorValidator } from "../utils/validations.types";
// Import validation functions
import {
   validateName,
   validateSurname,
   validateDescription,
   validateEmail,
   validatePhone,
   validateBirthdate,
   validateWeight,
   validateHeight,
   validateCountry,
   validateAgencyName,
   validateAgencyEmail,
   validateAgencyPhone,
   validateAgencyDescription,
   validateLaterality,
   validatePosition,
   validateCurrentTeam,
   validateVideos,
   validatePassports,
} from "../utils/validations.functions";

const validateData = (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) => {
   // Validate data
   const {
      name,
      surname,
      description,
      email,
      phone,
      birthdate,
      weight,
      height,
      country,
      agency,
      laterality,
      position,
      passports,
      videos,
      current_team,
   }: IBodyValidator = req.body;
   console.log(req.body);

   let errors: IErrorValidator[] = [];
   // Validate name
   if (!validateName(name))
      errors.push({
         field: "name",
         message: "El nombre debe tener más de 2 caracteres",
      });
   // Validate surname
   if (!validateSurname(surname))
      errors.push({
         field: "surname",
         message: "El apellido debe tener más de 2 caracteres",
      });
   // Validate description
   if (!validateDescription(description))
      errors.push({
         field: "description",
         message: "La descripción debe tener más de 10 caracteres",
      });
   // Validate email
   if (!validateEmail(email))
      errors.push({
         field: "email",
         message: "El email no es válido",
      });
   // Validate phone
   if (!validatePhone(phone))
      errors.push({
         field: "phone",
         message: "El teléfono debe tener más de 9 caracteres",
      });
   // Validate birthdate
   if (!validateBirthdate(birthdate))
      errors.push({
         field: "birthdate",
         message: "La fecha de nacimiento no es válida",
      });
   // Validate weight
   if (!validateWeight(weight))
      errors.push({
         field: "weight",
         message: "El peso debe ser al menos 40kg",
      });
   // Validate height
   if (!validateHeight(height))
      errors.push({
         field: "height",
         message: "La altura debe ser al menos 1.4m",
      });
   // Validate country
   if (!validateCountry(country)) {
      errors.push({
         field: "country",
         message: "El país debe tener más de 2 caracteres",
      });
   }

   if (agency !== undefined && agency !== null) {
      if (!validateAgencyName(agency?.agency_name))
         errors.push({
            field: "agency.agency_name",
            message: "El nombre de la agencia debe tener más de 2 caracteres",
         });
      if (!validateAgencyEmail(agency?.agency_email))
         errors.push({
            field: "agency.agency_email",
            message: "El email de la agencia no es válido",
         });
      if (!validateAgencyDescription(agency?.agency_description))
         errors.push({
            field: "agency.agency_description",
            message:
               "La descripción de la agencia debe tener más de 10 caracteres",
         });
      if (!validateAgencyPhone(agency?.agency_phone))
         errors.push({
            field: "agency.agency_phone",
            message: "El teléfono de la agencia debe tener más de 6 caracteres",
         });
   }

   // Validate agency data

   // Validate laterality
   if (!validateLaterality(laterality))
      errors.push({
         field: "laterality",
         message: "La lateralidad no es válida",
      });
   // Validate position
   if (!validatePosition(position))
      errors.push({
         field: "position",
         message: "La posición no es válida",
      });
   // Validate current team
   if (!validateCurrentTeam(current_team))
      errors.push({
         field: "current_team",
         message: "El nombre del equipo actual no es válido",
      });
   // Validate videos
   if (!validateVideos(videos))
      errors.push({
         field: "videos",
         message: "La url de uno de los videos no es válida",
      });
   // Validate passports
   if (!validatePassports(passports))
      errors.push({
         field: "passports",
         message: "El país de uno de los pasaportes no es válido",
      });

   if (errors.length === 0) return next();
   return res.send({
      errors,
   });
};

export default validateData;
