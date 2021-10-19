import Axios from 'axios';

async function getJson(jsonUrl) {
  // Get all JSON until we hit an error.
  return await Axios
    .get(jsonUrl)
    .then((response) => {
      return {
        attributes: [...response?.data?.attributes || {}],
        image: response?.data?.image || '',
        name: response?.data?.name || '',
        tokenId: response?.data?.tokenId || '',
      };
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
}

export {
  getJson,
};
