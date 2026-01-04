import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ButtonDemo from "./components/button-demo";
import SelectDemo from "./components/select-demo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ButtonDemo>Button</ButtonDemo>
      <SelectDemo />
    </>
  );
}

export default App;
