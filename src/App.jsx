import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ButtonDemo from "./components/button-demo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ButtonDemo>Button</ButtonDemo>
    </>
  );
}

export default App;
