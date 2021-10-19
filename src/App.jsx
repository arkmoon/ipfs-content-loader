import React from 'react';
import Modal from './components/modal/Modal';
import Gallery from './components/gallery/Gallery';
import { DispatchModalContext, initialModal, ModalContext } from './context/ModalContext';
import './App.css';

function App() {
  function toggleModal(modalOpts) {
    setActiveModal({
      ...modalOpts,
    });

    // Add or remove some class to the body to prevent the background from scrolling.
    if (modalOpts?.isActive) {
      document.querySelector('body').classList.add('active-modal');
    } else {
      document.querySelector('body').classList.remove('active-modal');

      // If they set the originating trigger of the modal, return focus to it for accessibility.
      modalOpts?.trigger?.current?.focus();
    }
  }

  // Local state.
  let [activeModal, setActiveModal] = React.useState({
    ...initialModal,
  });

  return (
    <div className="App">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
        <h1 className="sr-only">
          Check our awesome NFTs!
        </h1>
        <ModalContext.Provider value={activeModal}>
          <DispatchModalContext.Provider value={toggleModal}>
            <Gallery />
          </DispatchModalContext.Provider>
        </ModalContext.Provider>
      </section>
      {
        (activeModal?.isActive)
          ? (
            <ModalContext.Provider value={activeModal}>
              <DispatchModalContext.Provider value={toggleModal}>
                <Modal activeModal={activeModal} />
              </DispatchModalContext.Provider>
            </ModalContext.Provider>
          )
          : null
      }
    </div>
  );
}

export default App;
