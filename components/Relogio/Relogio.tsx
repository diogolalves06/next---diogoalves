"use client"; // obrigatorio!

import { useState, useEffect } from "react";

export default function Relogio() {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div>{hora}</div>;
}
