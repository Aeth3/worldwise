import { createContext, useReducer } from "react";
const FAKE_USER = {
  name: "AJ",
  email: "ajdamalan@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isError: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isError: false,
      };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    case "incorrectCredentials":
      return { ...state, isError: true };
    default:
      throw new Error("Unknown action");
  }
}
function AuthProvider({ children }) {
  const [{ user, isAuthenticated, isError }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    if (FAKE_USER.email === email && FAKE_USER.password === password) {
      dispatch({ type: "login", payload: FAKE_USER });
    } else {
      dispatch({ type: "incorrectCredentials" });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, FAKE_USER, isError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
