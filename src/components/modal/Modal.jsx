import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import { DispatchModalContext, initialModal, ModalContext } from '../../context/ModalContext';

function Modal({
  activeModal = {
    ...initialModal,
  },
}) {
  function handleClose() {
    // Return focus to the original element.
    if (modalContext?.trigger?.current) {
      modalContext?.trigger?.current?.focus();
    } else if (modalContext?.trigger) {
      modalContext?.trigger?.focus();
    }

    // Reset the modal.
    dispatchModal({
      ...initialModal,
    });

  }

  // Global Modal Context.
  const modalContext = React.useContext(ModalContext);
  const dispatchModal = React.useContext(DispatchModalContext);

  // Reference to the close button so we can focus on it on-load.
  const closeRef = React.useRef();

  React.useEffect(() => {
    // On intial load, focus on the close button.
    closeRef.current.focus();
  }, []);

  return (
    <FocusTrap>
      <div className="fixed top-0 z-10 h-screen w-full flex justify-center items-center bg-black bg-opacity-70 backdrop-filter backdrop-blur overflow-scroll">
        <div className="absolute top-0 rounded-3xl bg-image w-full sm:w-9/12 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center z-10 overflow-hidden bg-center bg-cover bg-white">
          {
            /**
             * Close button
            */
          }
          <div className="modal-close cursor-pointer z-50 absolute top-3 right-3">
            <button onClick={handleClose} ref={closeRef}>
              <span className="sr-only">close modal</span>
              <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
              </svg>
            </button>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop">
            <img className="w-full" src={activeModal?.imgSrc} alt={activeModal?.altText} />
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-left bg-white py-5 md:py-8 px-4">
            <h2 className="mb-4 font-bold text-3xl pb-4">
              {
                activeModal?.title
              }
            </h2>

            {
              activeModal?.body.map((el) => (el))
            }
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}

Modal.propTypes = {
  activeModal: PropTypes.shape({
    altText: PropTypes.string,
    body: PropTypes.array,
    imgSrc: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default Modal;
