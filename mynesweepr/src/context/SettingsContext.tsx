import React, { createContext, useContext, useState } from "react";

interface Settings {
  allowChording: boolean;
  allowFlagChording: boolean;
  swapLeftRightClick: boolean;
  useGuessing: boolean;
  selectedDifficulty: "beginner" | "intermediate" | "expert";
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  allowChording: true,
  allowFlagChording: true,
  swapLeftRightClick: false,
  useGuessing: false,
  selectedDifficulty: "beginner",
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider"
    );
  }
  return context;
};
