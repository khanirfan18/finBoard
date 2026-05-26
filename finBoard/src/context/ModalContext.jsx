import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null);

  const showModal = (config) => {
    setModalConfig(config);
  };

  const hideModal = () => {
    setModalConfig(null);
  };

  return (
    <ModalContext.Provider value={{ modalConfig, showModal, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
};
