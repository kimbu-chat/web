import React from 'react';

const LangCategory = () => {
  return (
    <div className="account-settings__language">
      <h2>Язык</h2>
      <div className="account-settings__select-block">
        <div className="account-settings__select-block__option">
          <input id="russian" type="radio" className="account-settings__radio" name="lang" />
          <label className="box" htmlFor="russian"></label>
          <span>Русский</span>
        </div>
        <div className="account-settings__select-block__option">
          <input id="english" type="radio" className="account-settings__radio" name="lang" />
          <label className="box" htmlFor="english"></label>
          <span>English</span>
        </div>
      </div>
    </div>
  );
};

export default LangCategory;
