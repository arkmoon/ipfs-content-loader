import React from 'react';
import PropTypes from 'prop-types';
import Image from '../image/Image';

function ModalBodyProject({
  description = '',
  image = '',
  name = '',
}) {
  const imgSrc = `https://ipfs.io/ipfs/${image?.split('//')[1]}`;

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <div className="w-12 float-left mr-2">
          <Image
            altText={`${name} logo`}
            imgSrc={imgSrc}
          />
        </div>
        <h3 className="text-lg font-bold">About {name}</h3>
      </div>
      <p className="clear-left mb-4">{description}</p>
    </div>
  );
}

ModalBodyProject.propTypes = {
  description: PropTypes.string,
  fee_recipient: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
  seller_fee_basis_points: PropTypes.number,
};

export default ModalBodyProject;
