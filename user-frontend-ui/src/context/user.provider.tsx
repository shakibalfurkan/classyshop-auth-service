import { getUserFromDB } from "@/services/AuthService";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  following: string[];
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TUserProviderValues = {
  user: TUser | null;
  setUser: Dispatch<SetStateAction<TUser | null>>;
  isUserLoading: boolean;
  setIsUserLoading: Dispatch<SetStateAction<boolean>>;
};

const UserContext = createContext<TUserProviderValues | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  console.log(user);

  const handleUser = async () => {
    try {
      const response = await getUserFromDB();
      setUser(response?.data || null);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    handleUser();
  }, [isUserLoading]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isUserLoading,
        setIsUserLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined || context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
