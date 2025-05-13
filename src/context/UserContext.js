// import React, { createContext, useState, useContext } from 'react';

// // Tạo context
// const UserContext = createContext();

// // Provider để bọc ứng dụng
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState({
//     avatar: "https://i.pravatar.cc/100",
//     name: "Alex Trainer",
//     membership: "Premium Member",
//   });

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Hook để sử dụng context
// export const useUser = () => useContext(UserContext);