import React from 'react';
import PropTypes from 'prop-types';

function Button({
  handleClick = () => {},
  label = '',
  svgIcon = '',
}) {
  function preClickHandler() {
    setStartSpinning(true);

    handleClick();
  }

  function stopSpin() {
    setStartSpinning(false);
  }

  // Local state.
  let [startSpinning, setStartSpinning] = React.useState(false);

  const spinnerRef = React.useRef();

  return (
    <button
      className="p-2 pl-4 pr-6 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300 text-center"
      onClick={preClickHandler}
    >
      {
        (svgIcon)
          ? (
            <img
              alt="refresh icon"
              aria-hidden="true"
              className={`${(startSpinning) ? 'refresh-icon--spin' : ''} refresh-icon float-left mr-4`}
              onAnimationEnd={() => {
                stopSpin();
              }}
              ref={spinnerRef}
              src={svgIcon}
              style={{
                height: '1.7rem',
                width: '2rem',
              }}
            />
          )
          : null
      }
      { label }
    </button>
  );
}

Button.propTypes = {
  handleClick: PropTypes.func,
  label: PropTypes.string,
  svgIcon: PropTypes.string,
};

export default Button;
