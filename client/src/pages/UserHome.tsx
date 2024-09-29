import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const UserHome = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Musijam!</h1>
      <p className="text-lg mb-4">This is your homepage. Start exploring and sharing music!</p>
      <Button onClick={logout} className="px-6 py-2">
        Logout
      </Button>
    </div>
  );
};

export default UserHome;
