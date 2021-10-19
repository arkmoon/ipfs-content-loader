import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

function Image({
  altText = '',
  imgSrc = '',
}) {
  const [file, setFile] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getImage(src) {
      await Axios
        .get(src, {
          responseType: 'blob',
          timeout: 30000,
        })
        .then((response) => {
          setFile(URL.createObjectURL(response.data));
          setLoading(false);
        });
    }

    if (!file && loading) {
      getImage(imgSrc);
    }
  }, [file, imgSrc, loading]);

  return (
    (loading)
      ? (
        <div className="h-16">
          <span className="sr-only">Loading image {altText}</span>
          <div className="flex items-center justify-center relative">
            <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin absolute" />
          </div>
          <div className="flex items-center justify-center ">
            <div className="w-16 h-16 border-l-2 border-gray-900 rounded-full animate-spin absolute" />
          </div>
          <div className="flex items-center justify-center ">
            <div className="w-32 h-32 border-t-4 border-b-4 border-green-900 rounded-full animate-spin absolute" />
          </div>
        </div>
      )
      : (file)
        ? (
          <img
            alt={altText}
            className="
              duration-500
              hover:scale-105
              hover:shadow-xl
              object-center
              object-cover
              rounded-3xl
              shadow
              transform
              transition
              w-100
            "
            src={file}
          />
        )
        : (
          <p>Image failed to load.</p>
        )
  );
}

Image.propTypes = {
  altText: PropTypes.string,
  imgSrc: PropTypes.string,
};

export default Image;
