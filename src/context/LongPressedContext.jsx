import { useState } from "react";
import LongPressedContext from "./LongPressContext";

const LongPressedContextProvider = ({ children }) => {
  const [longPressed, setLongPressed] = useState(false);

  const [selectedIndexes, setSelectedIndexes] = useState([]);
  return (
    <LongPressedContext.Provider
      value={{
        longPressed,
        setLongPressed,
        selectedIndexes,
        setSelectedIndexes,
      }}
    >
      {children}
    </LongPressedContext.Provider>
  );
};

export default LongPressedContextProvider;
