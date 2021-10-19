import React from 'react';

const DispatchModalContext = React.createContext();
const ModalContext = React.createContext();

const initialModal = {
  altText: '',
  body: [],
  imgSrc: '',
  isActive: false,
  title: '',
  trigger: null,
};

export {
  DispatchModalContext,
  initialModal,
  ModalContext,
};
