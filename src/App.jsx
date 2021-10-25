import React from 'react';
import Modal from './components/modal/Modal';
import Gallery from './components/gallery/Gallery';
import { DispatchModalContext, initialModal, ModalContext } from './context/ModalContext';
import { getProjectJson } from './util/util';
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

  let [currentProject, setCurrentProject] = React.useState(
    (localStorage.getItem('project'))
      ? JSON.parse(localStorage.getItem('project'))
      : {}
  );

  // Load the project settings.
  React.useEffect(() => {
    const projectUrl = import.meta.env.VITE_BLOCKCHAIN_PROJECT_INDEX;

    getProjectJson(`https://${projectUrl}.ipfs.dweb.link`).then((res) => {
      setCurrentProject({
        ...res,
      });
    });
  }, []);

  // Cache the project settings.
  localStorage.setItem('project', JSON.stringify(currentProject));

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
