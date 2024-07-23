import React from "react";
import { useSettingsContext } from "../context/SettingsContext";
import styled from "styled-components";

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const SettingLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const SettingCheckbox = styled.input`
  margin-right: 10px;
`;

const SettingsComponent: React.FC = () => {
  const { settings, updateSettings } = useSettingsContext();

  const handleCheckboxChange =
    (setting: keyof typeof settings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateSettings({ [setting]: event.target.checked });
    };

  return (
    <SettingsContainer>
      <SettingLabel>
        <SettingCheckbox
          type="checkbox"
          checked={settings.allowChording}
          onChange={handleCheckboxChange("allowChording")}
        />
        Allow Chording
      </SettingLabel>
      <SettingLabel>
        <SettingCheckbox
          type="checkbox"
          checked={settings.allowFlagChording}
          onChange={handleCheckboxChange("allowFlagChording")}
        />
        Allow Flag Chording
      </SettingLabel>
      <SettingLabel>
        <SettingCheckbox
          type="checkbox"
          checked={settings.swapLeftRightClick}
          onChange={handleCheckboxChange("swapLeftRightClick")}
        />
        Swap Left/Right Click
      </SettingLabel>
      <SettingLabel>
        <SettingCheckbox
          type="checkbox"
          checked={settings.useGuessing}
          onChange={handleCheckboxChange("useGuessing")}
        />
        Use Guessing
      </SettingLabel>
    </SettingsContainer>
  );
};

export default SettingsComponent;
