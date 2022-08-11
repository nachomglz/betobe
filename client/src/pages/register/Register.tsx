// IMPORT HOOKS
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// IMPORT CUSTOM HOOKS
import useForm from "../../hooks/useForm";
import { IPassport, IPlayerResponse, IVideo } from "../../utils/types";
import { MutableRefObject } from "react";
// IMPORT TYPES
import { IPlayer } from "../../utils/types";
// IMPORT CSS
import styles from "./register.module.css";
import IndexStyles from "../../index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faChevronDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// import libraries
import { toast } from "react-toastify";
// import api routes
import { api_urls } from "../../utils/config";
import Swal from "sweetalert2";
import axios from "axios";
import PlayerValidator from "../../utils/PlayerValidator";

interface IErrorValidator {
  field: string;
  message: string;
}

const Register = () => {
  let navigate = useNavigate();

  const [player, updatePlayer, updateAgency] = useForm<IPlayer>();
  const [agency, setAgency] = useState<{}>();
  const [passports, setPassports] = useState<IPassport[]>([]);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [openAgency, setOpenAgency] = useState<boolean>(false);
  const [openVideos, setOpenVideos] = useState<boolean>(false);
  const [openPassports, setOpenPassports] = useState<boolean>(false);
  const [placeHolderImage, setPlaceHolderImage] = useState<string | ArrayBuffer | null>(
    require("../../assets/img/profile_placeholder.jpg")
  );
  const [selectedFile, setSelectedFile] = useState<File>();

  const videoNameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const videoUrlRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passportCountryRef = useRef() as MutableRefObject<HTMLInputElement>;

  const removeVideo = (e: any, videoIndex: number) => {
    e.preventDefault();
    setVideos((videos) => videos.filter((video, index) => index !== videoIndex));
  };

  const addVideo = (e: any): void => {
    e.preventDefault();
    const video_name = videoNameRef.current?.value;
    const video_url = videoUrlRef.current?.value;
    // Test if the video url is an actual url
    const urlRegexp: RegExp = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/g;

    if (
      !videos.some((video: IVideo) => video.video_name === video_name) &&
      video_url.match(urlRegexp) &&
      videos.length < 4
    ) {
      setVideos([...videos, { video_name: video_name ?? "", video_url: video_url ?? "" }]);
    } else if (!video_url.match(urlRegexp)) {
      toast.error("Url incorrecta, introduce una url de youtube!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (videos.some((video: IVideo) => video.video_name === video_name)) {
      toast.error("No pueden haber dos videos con el mismo nombre", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (videos.length > 3) {
      toast.error("Ya has añadido 4 videos!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const removePassport = (e: any, passportIndex: number) => {
    e.preventDefault();
    setPassports((passports) => passports.filter((passport, index) => index !== passportIndex));
  };

  const addPassport = (e: any): void => {
    e.preventDefault();
    const passport_country = passportCountryRef.current?.value;
    if (!passports.some((passport) => passport.country.toLowerCase() === passport_country.toLowerCase())) {
      setPassports([...passports, { country: passport_country ?? "" }]);
    } else {
      toast.error("Ya has añadido ese país!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSubmit = async (e: any): Promise<void> => {
    // clear all toasts that have opened before
    toast.dismiss();
    e.preventDefault();
    //assign the selected videos to the player
    player.videos = videos;
    player.passports = passports;
    player.image = "";

    // Validate player in frontend
    const validations: IErrorValidator[] = PlayerValidator(player);
    validations.forEach((validation) => {
      toast.error(validation.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    // if there are 0 errors we continue to the backend
    if (validations.length === 0) {
      const { data }: IPlayerResponse = await axios.post(api_urls.registerPlayer, player);
      if (data.status === "success") {
        // if the player is successfully updated, we upload the image to the db
        if (data.player) {
          // if there's a player, create formdata with the image
          var formData = new FormData();

          if (selectedFile) {
            formData.append("image", selectedFile, "image");

            const response = await axios({
              method: "post",
              url: api_urls.uploadImage + data.player._id,
              data: formData,
              headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response)
          }
        }
        navigate("/");

        Swal.fire({
          title: "Hecho",
          text: "Tus datos han sido enviados a un administrador, te contactaremos lo antes posible",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Ha ocurrido un error desconocido al registrar tus datos, por favor vuelve a intentarlo más tarde.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    /*
    } else {
       Swal.fire({
          title: "Ups!",
          text: "Ha ocurrido un error al guardar tus datos, comprueba que todos los campos sean correctos",
          icon: "success",
          confirmButtonText: "OK",
       });
    }
    } 
    */
  };

  const fileChange = (e: any) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPlaceHolderImage(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
      // the image fills successfuly
      setSelectedFile(e.target.files[0]);
    }
  };

  const agencyChange = (e: any) => {
    setAgency((agency) => ({ ...agency, [e.target.name]: e.target.value }));
    updateAgency(agency);
  };

  return (
    <div className={IndexStyles.container}>
      <div className={styles["register-container"]}>
        <h2>Añade tu información</h2>
        <form className={styles["register-form"]}>
          <div className={styles["register-form__field"]}>
            <div className={styles["register-form__field-name"]}>
              <label htmlFor="name">Nombre:</label>
              <input type="text" name="name" id="name" onChange={updatePlayer} />
            </div>
            <div className={styles["register-form__field-surname"]}>
              <label htmlFor="surname">Apellidos:</label>
              <input type="text" name="surname" id="surname" onChange={updatePlayer} />
            </div>
          </div>
          <div className={styles["register-form__field"]}>
            <div className={styles["register-form__field-email"]}>
              <label htmlFor="email">Correo electrónico:</label>
              <input type="text" name="email" id="email" onChange={updatePlayer} />
            </div>
            <div className={styles["register-form__field-country"]}>
              <label htmlFor="country">País:</label>
              <input type="text" name="country" id="country" onChange={updatePlayer} />
            </div>
          </div>
          <div className={styles["register-form__field"]}>
            <div className={styles["register-form__field-birthdate"]}>
              <label htmlFor="birthdate">Fecha de nacimiento:</label>
              <input type="date" name="birthdate" id="birthdate" onChange={updatePlayer} />
            </div>
            <div className={styles["register-form__field-image"]}>
              <label htmlFor="image">Seleccione una imagen</label>
              <input
                type="file"
                name="image"
                id="image"
                style={{
                  display: "none",
                }}
                onChange={fileChange}
              />
              <img
                className={styles["register-image-placeholder"]}
                src={placeHolderImage as string}
                alt="imagen del jugador"
              />
            </div>
          </div>
          <div className={styles["register-form__field"]}>
            <div className={styles["register-form__field-description"]}>
              <label htmlFor="description">Descripción del jugador:</label>
              <textarea name="description" id="description" onChange={updatePlayer}></textarea>
            </div>
          </div>
          <div className={styles["register-form__field"]}>
            <div className={styles["register-form__field-position"]}>
              <label htmlFor="position">Posición de campo:</label>
              <select name="position" id="position" onChange={updatePlayer}>
                <option defaultChecked>-- Seleccione posición --</option>
                <option value="portero">Portero</option>
                <option value="defensa">Defensa</option>
                <option value="centrocampista">Centrocampista</option>
                <option value="delantero">Delantero</option>
              </select>
            </div>
            <div className={styles["register-form__field-laterality"]}>
              <label htmlFor="laterality">Lateralidad:</label>
              <select name="laterality" id="laterality" onChange={updatePlayer}>
                <option defaultChecked>-- Seleccione lateralidad --</option>
                <option value="diestro">Diestro</option>
                <option value="zurdo">Zurdo</option>
                <option value="ambidiestro">Ambidiestro</option>
              </select>
            </div>
            <div className={styles["register-form__field-current_team"]}>
              <label htmlFor="current_team">Equipo actual(si tiene):</label>
              <input type="text" name="current_team" id="current_team" onChange={updatePlayer} />
            </div>
          </div>
          <div className={styles["register-form__field"]}>
            <div className={styles["register-form__field-height"]}>
              <label htmlFor="height">Altura:</label>
              <input type="number" name="height" id="height" step={0.01} onChange={updatePlayer} />
            </div>
            <div className={styles["register-form__field-weight"]}>
              <label htmlFor="weight">Peso:</label>
              <input type="number" name="weight" id="weight" step={0.01} onChange={updatePlayer} />
            </div>
          </div>
          <div className={styles["register-form__field"]}>
            <div
              className={styles["register-form__container-trigger"]}
              onClick={() => setOpenAgency((open) => !open)}
            >
              <FontAwesomeIcon icon={faChevronDown} />
              <p>Información de la agencia (si tiene)</p>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            <div className={`${styles["register-form__field-agency"]} ${openAgency ? styles.open : ""}`}>
              <div className={styles["register-form__field-agency-name"]}>
                <label htmlFor="agency_name">Nombre de la agencia:</label>

                <input type="text" name="agency_name" id="agency_name" onChange={agencyChange} />
              </div>
              <div className={styles["register-form__field-agency-email"]}>
                <label htmlFor="agency_email">Email de la agencia:</label>
                <input type="text" name="agency_email" id="agency_email" onChange={agencyChange} />
              </div>
              <div className={styles["register-form__field-agency-phone"]}>
                <label htmlFor="agency_phone">Teléfono de la agencia:</label>
                <input type="text" name="agency_phone" id="agency_phone" onChange={agencyChange} />
              </div>
              <div className={styles["register-form__field-agency-description"]}>
                <label htmlFor="agency_description">Descripción de la agencia:</label>
                <textarea name="agency_description" id="agency_description" onChange={agencyChange} />
              </div>
            </div>
          </div>
          <div className={styles["register-form__field"]}>
            <div
              className={styles["register-form__container-trigger"]}
              onClick={() => setOpenVideos((open) => !open)}
            >
              <FontAwesomeIcon icon={faChevronDown} />
              <p>Añade videos (máx: 4)</p>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            <div className={`${styles["register-form__field-videos"]} ${openVideos ? styles.open : ""}`}>
              <div className={styles["register-form__field-videos-video"]}>
                <div className={styles["register-form__field-videos-video-video_name"]}>
                  <label htmlFor="video_name">Nombre del video:</label>
                  <input type="text" ref={videoNameRef} name="video_name" id="video_name" />
                </div>
                <div className={styles["register-form__field-videos-video-video_url"]}>
                  <label htmlFor="video_url">Enlace al video:</label>
                  <input type="text" ref={videoUrlRef} name="video_url" id="video_url" />
                </div>
                <button onClick={addVideo} className={styles["register-form__field-video-add-btn btn-orange"]}>
                  <FontAwesomeIcon icon={faAdd} />
                </button>
              </div>
              {videos.map((video: IVideo, index: number) => (
                <div className={styles["register-form__field-videos-video-item"]} key={index}>
                  <div className={styles["register-form__field-videos-video-video_name"]}>
                    {video.video_name}
                  </div>
                  <div className={styles["register-form__field-videos-video-video_url"]}>
                    <Link to={{ pathname: video.video_url }} target="_blank">
                      {video.video_url}
                    </Link>
                  </div>
                  <button
                    className={`${IndexStyles.btn} ${IndexStyles["btn-remove"]}`}
                    onClick={(e: any) => removeVideo(e, index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles["register-form__field"]}>
            <div
              className={styles["register-form__container-trigger"]}
              onClick={() => setOpenPassports((open) => !open)}
            >
              <FontAwesomeIcon icon={faChevronDown} />
              <p>Añade tus pasaportes</p>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            <div className={`${styles["register-form__field-passports"]} ${openPassports ? styles.open : ""}`}>
              <div className={styles["register-form__field-passport"]}>
                <label htmlFor="passport_country">País del pasaporte:</label>
                <div>
                  <input type="text" name="passport_country" id="passport_country" ref={passportCountryRef} />
                  <button
                    onClick={addPassport}
                    className={`${styles["register-form__field-passport-add-btn"]} ${IndexStyles["btn-orange"]}`}
                  >
                    <FontAwesomeIcon icon={faAdd} />
                  </button>
                </div>
              </div>
              {passports.map((passport: IPassport, index: number) => (
                <div className={styles["register-form__field-passports-passport-item"]} key={index}>
                  <div className={styles["register-form__field-passports-passport-passport-country"]}>
                    {passport.country}
                  </div>
                  <button
                    className={`${styles.btn} ${IndexStyles["btn-remove"]}`}
                    onClick={(e: any) => removePassport(e, index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles["register-form__field"]} ${styles["register-button-field"]}`}>
            <button
              type="submit"
              className={`${IndexStyles.btn} ${IndexStyles["btn-orange"]}`}
              onClick={handleSubmit}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
