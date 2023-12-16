import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_L29djGtv1lF0NT0mClRarkdoGhfH7equBm4KwTFWhcS1rHpMlFAKS7AuvFIOg9PB';

export function fetchBreeds() {
  const instance = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    timeout: 2000,
  });
  return instance
    .get('/breeds')
    .then(response => {
      if (!response.ok) {
        return response.data;
      }
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

export function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      if (!response.ok) {
        return response.data;
      }
    })
    .catch(error => {
      return error;
    });
}
