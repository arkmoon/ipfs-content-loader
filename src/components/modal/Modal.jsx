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
      <div className="fixed top-0 z-10 h-screen w-full flex justify-center items-center bg-black bg-opacity-70 backdrop-filter backdrop-blur overflow-y-scroll">
        <div className="modal-close cursor-pointer z-50 absolute top-3 right-3">
          <button onClick={handleClose} ref={closeRef}>
            <span className="sr-only">close modal</span>
            <svg className="fill-current text-black bg-white rounded-full text-4xl" xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </button>
        </div>
        <div className="z-10 overflow-hidden flex flex-col lg:grid lg:grid-cols-2 gap-5 top-10 lg:top-20 absolute px-6 xs:max-w-xs max-w-full">
          <img className="w-full rounded-3xl shadow-xl mb-10 lg:mb-20" src={activeModal?.imgSrc} alt={activeModal?.altText} />

          <div className="bg-white py-5 md:py-8 px-4 rounded-3xl shadow-xl mb-10 lg:mb-20">
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
