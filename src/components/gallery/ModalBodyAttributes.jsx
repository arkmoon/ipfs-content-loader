import React from 'react';
import PropTypes from 'prop-types';

function ModalBodyAttributes({
  attributes = [],
}) {
  return (
    <>
      <h3 className="mb-4 font-bold text-xl flex items-center text-gray-500">Attributes:</h3>
      <ul className="grid grid-cols-3 gap-5 text-xs md:text-base xl:text-xl ">
        {
          attributes?.map((att, i) => (
            (att?.trait_type && att?.value)
              ? (
                <li className="mb-4 bg-gray-200 text-gray-800 rounded-lg p-4" key={`${att?.trait_type}-${att?.value}-${i}`}>
                  <strong className="uppercase">{att?.trait_type}</strong>
                  <br />
                  {att?.value}
                </li>
              )
              : null
          ))
        }
      </ul>
    </>
  );
}

ModalBodyAttributes.propTypes = {
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      trait_type: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

export default ModalBodyAttributes;
