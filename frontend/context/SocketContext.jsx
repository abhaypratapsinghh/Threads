import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import { UserAtom } from "../atom/UserAtom";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(UserAtom);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      query: {
        userId: user?._id,
      },
    });

    setSocket(socketInstance);
    socketInstance.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socketInstance && socketInstance.close();
  }, [user?._id]);


  return (
    <SocketContext.Provider value={{ socket,onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
