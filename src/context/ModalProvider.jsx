import React, { useState } from 'react';
import { ModalContext } from './ModalContext';

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
