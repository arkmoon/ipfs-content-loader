import React from 'react';
import PropTypes from 'prop-types';
import { getJson } from '../../util/util';
import Button from '../button/Button';
import ArrowSvg from '../../assets/svg/arrows.svg';
import Image from '../image/Image';
import { DispatchModalContext } from '../../context/ModalContext';

function Gallery() {
  function getMore() {
    if (!endOfLine) {
      setActiveIndex(currentIndex);
      setCurrentIndex(currentIndex += loadImageAmount);
    }
  }

  function showModal(image) {
    return function (e) {
      function buildABody(img) {
        return (img?.attributes && img?.attributes?.length)
          ? (
            <React.Fragment key="modal-body">
              <h3 className="mb-4 font-bold text-xl flex items-center text-gray-500">Attributes:</h3>
              <ul className="text-base text-gray-600 font-normal text-left">
                {
                  img?.attributes?.map((att, i) => (
                    (att?.trait_type && att?.value)
                      ? (
                        <li className="mb-4" key={`${att?.trait_type}-${att?.value}-${i}`}>
                          <strong className="uppercase">{att?.trait_type}</strong><br />{att?.value}
                        </li>
                      )
                      : null
                  ))
                }
              </ul>
            </React.Fragment>
          )
          : null;
      }

      e && e.preventDefault();

      dispatchModal({
        altText: image?.name,
        body: [buildABody(image)],
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
  let [activeIndex, setActiveIndex] = React.useState();
  let [currentIndex, setCurrentIndex] = React.useState(loadImageAmount + 1);
  let [endOfLine, setEndOfLine] = React.useState(false);
  let [images, setImages] = React.useState(
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
        const response = await getJson(`https://${rootUrl}.ipfs.dweb.link/${i}.json`);
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
