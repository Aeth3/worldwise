// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from "react";
// import { useSearchParams } from "react-router-dom";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../hooks/useCities";
import Flag from "./Flag";
import { useNavigate } from "react-router-dom";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const initialState = {
  country: "",
  cityName: "",
  date: new Date(),
  notes: "",
  isLoadingGeocoding: false,
  emoji: "",
  geoCodingError: "",
  currentFlag: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "setCurrentFlag":
      return { ...state, currentFlag: action.payload };
    case "getCityData":
      return {
        ...state,
        cityName: action.payload.cityName,
        emoji: action.payload.emoji,
        country: action.payload.country,
        isLoadingGeocoding: true,
      };
    case "geoCodingError":
      return { ...state, geoCodingError: action.payload };
    case "fetchingCityDataFinish":
      return { ...state, isLoadingGeocoding: false };
    case "setCityName":
      return { ...state, cityName: action.payload };
    case "setDate":
      return { ...state, date: action.payload };
    case "setNotes":
      return { ...state, notes: action.payload };
    default:
  }
}
function Form() {
  // const [searchParams] = useSearchParams();
  // const lat = searchParams.get("lat");
  // const lng = searchParams.get("lng");
  const navigate = useNavigate();
  const { lat, lng } = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    country,
    cityName,
    date,
    notes,
    isLoadingGeocoding,
    emoji,
    geoCodingError,
    currentFlag,
  } = state;
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName && !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  useEffect(
    function () {
      async function fetchCityData() {
        if (lat && lng) {
          try {
            const res = await fetch(
              `${BASE_URL}?latitude=${lat}&longitude=${lng}`
            );
            const data = await res.json();
            dispatch({ type: "setCurrentFlag", payload: data.countryCode });
            if (!data.countryCode)
              throw new Error(
                "That doesn't seem to be a city. Click somewhere else"
              );
            dispatch({
              type: "getCityData",
              payload: {
                cityName: data.city || data.locality || "",
                emoji: data.countryCode,
                country: data.countryName,
              },
            });
          } catch (err) {
            dispatch({ type: "geoCodingError", payload: err.message });
          } finally {
            dispatch({ type: "fetchingCityDataFinish" });
          }
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );
  if (!lat && !lng)
    return <Message message={"Start by clicking somewhere in the map"} />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  return (
    <>
      {!isLoadingGeocoding ? (
        <form
          className={`${styles.form} ${isLoading ? styles.loading : ""}`}
          onSubmit={handleSubmit}
        >
          <div className={styles.row}>
            <label htmlFor="cityName">City name</label>
            <input
              id="cityName"
              onChange={(e) =>
                dispatch({ type: "setCityName", payload: e.target.value })
              }
              value={cityName}
            />
            <span className={styles.flag}>
              <Flag flag={currentFlag} />
            </span>
          </div>

          <div className={styles.row}>
            <label htmlFor="date">
              When did you go to {cityName ? cityName : "..."}?
            </label>
            {/* <input
              id="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            /> */}
            <DatePicker
              selected={date}
              onChange={(date) => dispatch({ type: "setDate", payload: date })}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="notes">Notes about your trip to {cityName}</label>
            <textarea
              id="notes"
              onChange={(e) =>
                dispatch({ type: "setNotes", payload: e.target.value })
              }
              value={notes}
            />
          </div>

          <div className={styles.buttons}>
            <Button type="primary">Add</Button>
            <BackButton type="back">&larr; Back</BackButton>
          </div>
        </form>
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default Form;
