"use client"; // importante! hooks só funcionam no client

import { useState, useEffect } from "react";

export default function Relogio() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <div>{hora.toLocaleTimeString()}</div>;
}
