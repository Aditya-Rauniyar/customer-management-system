import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // checking whether user is already logged in
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await API.get("/auth/me");

                setUser(response.data.user || response.data);

            } catch (error) {
                localStorage.removeItem("token");
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // login
    const login = async (email, password) => {
        const response = await API.post("/auth/login", {
            email,
            password
        });

        localStorage.setItem("token", response.data.token);

        const userResponse = await API.get("/auth/me");

        setUser(userResponse.data.user || userResponse.data);
    };

    // signup
    const signup = async (name, email, password) => {
        const response = await API.post("/auth/signup", {
            name,
            email,
            password
        });

        localStorage.setItem("token", response.data.token);

        const userResponse = await API.get("/auth/me");

        setUser(userResponse.data.user || userResponse.data);
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};