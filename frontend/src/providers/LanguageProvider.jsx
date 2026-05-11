import { createContext, useContext, useState } from "react";

const dictionary = {
  English: {
    tagline: "Where Government School Students Showcase Innovation & Engineering",
    heroCta: "Explore Student Work"
  },
  Hindi: {
    tagline: "जहां सरकारी विद्यालय के छात्र नवाचार और प्रतिभा प्रदर्शित करते हैं",
    heroCta: "छात्र कार्य देखें"
  },
  Kannada: {
    tagline: "ಸರ್ಕಾರಿ ಶಾಲಾ ವಿದ್ಯಾರ್ಥಿಗಳು ತಮ್ಮ ನವೀನತೆ ಮತ್ತು ಪ್ರತಿಭೆಯನ್ನು ಪ್ರದರ್ಶಿಸುವ ವೇದಿಕೆ",
    heroCta: "ವಿದ್ಯಾರ್ಥಿಗಳ ಕೆಲಸಗಳನ್ನು ನೋಡಿ"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("English");

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionary[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
