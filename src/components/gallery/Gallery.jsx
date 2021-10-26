import React from 'react';
import PropTypes from 'prop-types';
import { getItemJson } from '../../util/util';
import Button from '../button/Button';
import ArrowSvg from '../../assets/svg/arrows.svg';
import Image from '../image/Image';
import { DispatchModalContext } from '../../context/ModalContext';
import ModalBodyAttributes from './ModalBodyAttributes';
import ModalBodyProject from './ModalBodyProject';

function Gallery() {
  function getMore() {
    if (!endOfLine) {
      setActiveIndex(currentIndex);
      setCurrentIndex(currentIndex + loadImageAmount);
    }
  }

  function showModal(image) {
    return function (e) {
      function buildABody(img) {
        // Fetch images.
        return (img?.attributes && img?.attributes?.length)
          ? (
            <ModalBodyAttributes attributes={img?.attributes} key="gallery-item-attributes" />
          )
          : null;
      }

      e && e.preventDefault();

      const project = (localStorage.getItem('project'))
        ? JSON.parse(localStorage.getItem('project'))
        : {};

      dispatchModal({
        altText: image?.name,
        body: [
          buildABody(image),
          <hr className="border-1 my-4" key="hr" />,
          <ModalBodyProject
            description={project?.description}
            image={project?.image}
            key={`${image?.name} project-gallery-properties`}
            name={project?.name}
          />
        ],
        imgSrc: image?.imgSrc,
        isActive: true,
        title: image?.name,
        trigger: linkRefs?.current[image?.index],
      });

    };
  }

  // Define your root JSON location in .env.
  const rootUrl = import.meta.env.VITE_BLOCKCHAIN_BASE_INDEX;

  // Set how many images you want to load at a time in .env.
  const loadImageAmount = Number(import.meta.env.VITE_LOAD_X_IMAGES_AT_A_TIME);

  // Global Modal Context.
  const dispatchModal = React.useContext(DispatchModalContext);

  // Local State
  const [activeIndex, setActiveIndex] = React.useState();
  const [currentIndex, setCurrentIndex] = React.useState(loadImageAmount + 1);
  const [endOfLine, setEndOfLine] = React.useState(false);
  const [images, setImages] = React.useState(
    (localStorage.getItem('images'))
      ? JSON.parse(localStorage.getItem('images'))
      : [{}]
  );

  // Fetch images based on current index.
  React.useEffect(() => {
    async function getAllJson() {
      const nextSet = [];

      // Get the next numberOfImagesToLoadAtATime indexes to pull from.
      for (let nextIndex = images.length; nextIndex < currentIndex; nextIndex++) {
        nextSet.push(nextIndex);
      }

      // Build out our next array of promises.
      const promises = nextSet.map(async (i) => {
        const response = await getItemJson(`https://${rootUrl}.ipfs.dweb.link/${i}.json`);
        return response;
      });

      const imageSet = await Promise.all(promises);

      // Only add elements now if they're not null.
      const cleanedImageSet = [...images.filter((img) => (img)), ...imageSet.filter((img) => (img))];

      // Stop letting them hit the data if they've hit nulls.
      if (imageSet.filter((img) => (!img)).length > 0) {
        setEndOfLine(true);
      }

      // Set whatever is left.
      setCurrentIndex(cleanedImageSet.length);
      setImages(cleanedImageSet);
    }

    // Only ping if the index has changed.
    if (currentIndex !== images.length && !endOfLine) {
      getAllJson();
    }
  }, [currentIndex, endOfLine, images, rootUrl]);

  // Focus on the appropriate item if we just loaded more.
  React.useEffect(() => {
    if (activeIndex < currentIndex) {
      linkRefs?.current[activeIndex - 1]?.focus();
    }
  }, [activeIndex, currentIndex]);

  localStorage.setItem('images', JSON.stringify(images));

  // Anchor link refs.
  const linkRefs = React.useRef(new Array());

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {
          images.map((img, index) => {
            const imgLabel = `${img?.name}-${img?.tokenId}-${index}`;
            const imgSrc = `https://ipfs.io/ipfs/${img?.image?.split('//')[1]}`;

            return (
              (img?.tokenId)
                ? (
                  <div className="w-full p-6 flex flex-col justify-center items-center" key={img?.tokenId}>
                    <div className="mb-8">
                      <a
                        aria-labelledby={imgLabel}
                        href="#0"
                        onClick={showModal({
                          ...img,
                          imgSrc,
                          index,
                        })}
                        ref={(element) => {
                          linkRefs.current[index] = element;
                        }}
                      >
                        <Image
                          altText={img?.name}
                          imgSrc={imgSrc}
                        />
                      </a>
                      <h2 className="text-gray-500 font-bold mb-2 text-sm mt-4" id={imgLabel}>{img?.name}</h2>
                    </div>
                  </div>
                )
                : null
            );
          })
        }
      </div>
      {
        (!endOfLine)
          ? (
            <div className="text-center my-10">
              <Button
                handleClick={getMore}
                svgIcon={ArrowSvg}
                label="Load More"
              />
            </div>
          )
          : null
      }
    </>
  );
}

Gallery.propTypes = {
  altText: PropTypes.string,
};

export default Gallery;
