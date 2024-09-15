import { createContext, useReducer, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  status: "loading",
  currentCity: {},
  isLoading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "dataReceived":
      return {
        ...state,
        cities: action.payload,
        status: "ready",
        isLoading: false,
      };
    case "dataFailed":
      return { ...state, status: "failed" };
    case "cityReceived":
      return {
        ...state,
        currentCity: action.payload,
        status: "ready",
        isLoading: false,
      };
    case "addNewCity":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "deleteCity":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown Command");
  }
}
function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, status, currentCity, isLoading } = state;

  useEffect(
    function () {
      async function fetchCities() {
        dispatch({ type: "loading" });
        try {
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();
          dispatch({ type: "dataReceived", payload: data });
        } catch (err) {
          dispatch({
            type: "rejected",
            payload: "There was an error fetching cities",
          });
        }
      }
      fetchCities();
    },
    [dispatch]
  );

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "cityReceived", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error getting city data",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "addNewCity", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating a city",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, { method: "DELETE" });

      dispatch({
        type: "deleteCity",
        payload: id,
      });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting a city",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        dispatch,
        cities,
        status,
        currentCity,
        getCity,
        isLoading,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
