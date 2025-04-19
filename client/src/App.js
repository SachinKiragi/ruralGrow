import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function GoogleTranslate() {
  const location = useLocation();

  useEffect(() => {
    const allowedPaths = ["/", "/dashboard", "/progress", "/feedback", "/entrepreneurship", "/profile", "/resources"];
    if (!allowedPaths.includes(location.pathname)) return;

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,kn,mr,ta,ml,te,bn,gu,pa,ur',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    return () => {
      const el = document.getElementById("google_translate_element");
      if (el) el.innerHTML = "";
    };
  }, [location.pathname]);

  return <div id="google_translate_element" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}></div>;
}

function App() {
  return (
    <BrowserRouter>
      {/* Place GoogleTranslate outside of Routes to prevent interference */}
      <GoogleTranslate />
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:roomID" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
