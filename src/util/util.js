import Axios from 'axios';

async function getItemJson(url) {
  try {
    const res = await Axios.get(url);

    return ({
      attributes: [...res?.data?.attributes || {}],
      image: res?.data?.image || '',
      name: res?.data?.name || '',
      tokenId: res?.data?.tokenId || '',
    });
  } catch (err) {
    // Handle Error Here
    console.error(err);
    return null;
  }
}

async function getProjectJson(url) {
  try {
    const res = await Axios.get(url);

    return ({
      description: res?.data?.description || '',
      fee_recipient: res?.data?.fee_recipient || '',
      image: res?.data?.image || '',
      name: res?.data?.name || '',
      seller_fee_basis_points: res?.data?.seller_fee_basis_points || 0,
    });
  } catch (err) {
    // Handle Error Here
    console.error(err);
    return null;
  }
}

export {
  getItemJson,
  getProjectJson,
};
