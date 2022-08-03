// import react and hooks
import React, { useState, useEffect, useRef } from "react";
// Import styles
import styles from "./filtersMenu.module.css";
import IndexStyles from "../../index.module.css";

type Laterality = "zurdo" | "diestro" | "ambidiestro";
type Position = "centrocampista" | "defensa" | "delantero" | "portero";

interface Props {
   filtersButtonRef: React.MutableRefObject<HTMLButtonElement>;
   isMenuOpened: boolean;
   onApplyFilters: (filters: Filters) => void;
   closeMenu: () => void;
}

export interface Filters {
   age: number;
   minHeight: number;
   maxHeight: number;
   minWeight: number;
   maxWeight: number;
   laterality: Laterality | null;
   position: Position | null;
   available: boolean;
}

const FiltersMenu = ({ filtersButtonRef, isMenuOpened, onApplyFilters, closeMenu }: Props) => {
   const DEFAULT_VALUES: Filters = {
      age: 0,
      minHeight: 0,
      maxHeight: 0,
      minWeight: 0,
      maxWeight: 0,
      laterality: null,
      position: null,
      available: false,
   };

   /* STATE */
   const [fromTop, setFromTop] = useState<number>();
   const [fromLeft, setFromLeft] = useState<number>();

   /* FILTERS */
   const [filters, setFilters] = useState<Filters>(DEFAULT_VALUES);

   useEffect(() => {
      setFromTop(filtersButtonRef.current.offsetTop + 30);
      setFromLeft(filtersButtonRef.current.offsetLeft - 350);
   }, [filtersButtonRef]);

   const handleFiltersChange = ({ target }: any): void => {
      let name = target.name;
      let value =
         target.type === "checkbox" ? target.checked : target.type === "date" ? target.valueAsDate : target.value;
      // update the filters state
      setFilters((filters) => ({ ...filters, [name]: value }));
   };

   const resetFilters = (): void => {
      // set the filters to the default value
      setFilters(DEFAULT_VALUES);

      // empty the inputs
      let inputs = Array.from(document.querySelectorAll(".filter-menu input, .filter-menu select"));

      inputs.forEach((el: any) => {
         el.value = "";
         el.checked = false;
      });
   };

   return (
      <div
         className={styles["filter-menu"]}
         style={{
            display: isMenuOpened ? "block" : "none",
            top: fromTop,
            left: fromLeft,
            width: "40rem",
         }}
      >
         <button onClick={closeMenu} className={styles["closing-button"]}>
            <span></span>
            <span></span>
         </button>
         <div className={styles["filter-menu-field"]}>
            <div className={styles["filter-menu-field-title"]}>Edad:</div>
            <div className={styles["filter-menu-field-filter"]}>
               <input name="age" type="number" onChange={handleFiltersChange} />
            </div>
         </div>
         <div className={`${styles["filter-menu-field"]} ${styles["double-field"]}`}>
            <div>
               <div className={styles["filter-menu-field-title"]}>Altura(min):</div>
               <div className={styles["filter-menu-field-filter"]}>
                  <input
                     name="minHeight"
                     type="number"
                     step={0.01}
                     onChange={handleFiltersChange}
                     /* max={filters.maxHeight - 1} */
                  />
               </div>
            </div>
            <div>
               <div className={styles["filter-menu-field-title"]}>Altura(max):</div>
               <div className={styles["filter-menu-field-filter"]}>
                  <input
                     name="maxHeight"
                     /* min={filters.minHeight + 1} */
                     type="number"
                     step={0.01}
                     onChange={handleFiltersChange}
                  />
               </div>
            </div>
         </div>
         <div className={`${styles["filter-menu-field"]} ${styles["double-field"]}`}>
            <div>
               <div className={styles["filter-menu-field-title"]}>Peso(min):</div>
               <div className={styles["filter-menu-field-filter"]}>
                  <input name="minWeight" type="number" onChange={handleFiltersChange} />
               </div>
            </div>
            <div>
               <div className={styles["filter-menu-field-title"]}>Peso(max):</div>
               <div className={styles["filter-menu-field-filter"]}>
                  <input name="maxWeight" type="number" onChange={handleFiltersChange} />
               </div>
            </div>
         </div>
         <div className={styles["filter-menu-field"]}>
            <div className={styles["filter-menu-field-title"]}>Lateralidad</div>
            <div className={styles["filter-menu-field-filter"]}>
               <select defaultValue={""} name="laterality" onChange={handleFiltersChange}>
                  <option value={""} disabled>
                     -- Selecciona una lateralidad --
                  </option>
                  <option value="zurdo">Zurdo</option>
                  <option value="diestro">Diestro</option>
                  <option value="ambidiestro">Ambidiestro</option>
               </select>
            </div>
         </div>
         <div className={styles["filter-menu-field"]}>
            <div className={styles["filter-menu-field-title"]}>Posición</div>
            <div className={styles["filter-menu-field-filter"]}>
               <select defaultValue={""} name="position" onChange={handleFiltersChange}>
                  <option value={""} disabled>
                     -- Selecciona la posición --
                  </option>
                  <option value="portero">Portero</option>
                  <option value="defensa">Defensa</option>
                  <option value="centrocampista">Centrocampista</option>
                  <option value="delantero">Delantero</option>
               </select>
            </div>
         </div>
         <div className={`${styles["filter-menu-field"]} ${styles["checkbox-field"]}`}>
            <div className={IndexStyles["custom-checkbox"]}>
               <input
                  type="checkbox"
                  name="available"
                  id="filter-availability-trigger"
                  onChange={handleFiltersChange}
               />
               <label htmlFor="filter-availability-trigger">
                  <div>
                     <div></div>
                  </div>
               </label>
            </div>
            Disponibles (sin equipo)
         </div>
         <div className={styles["filter-menu-field"]}>
            <button className={IndexStyles.btn} onClick={resetFilters}>
               Borrar filtros
            </button>
         </div>
         <div className={styles["filter-menu-field"]}>
            <button className={IndexStyles.btn} onClick={() => onApplyFilters(filters)}>
               Aplicar
            </button>
         </div>
      </div>
   );
};
export default FiltersMenu;
