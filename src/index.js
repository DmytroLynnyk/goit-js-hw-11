import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';

const paraments = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
};
let query = '';

Notiflix.Notify.init({
  position: 'top-right',
  timeout: 3000,
});

const MAIN_URL = 'https://pixabay.com/api/';
const KEY = '41296816-66b158bf0945ebd5221c62d2d';
const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  query = '';

  query = event.target.searchQuery.value.toLowerCase();

  await fetchQuery(query)
    .then(response => {
      createGallery(response);
    })
    .catch(error => console.log(error));
}

async function fetchQuery(response) {
  const instance = await axios(
    `${MAIN_URL}?key=${KEY}&q=${query}&image_type=${paraments.image_type}&orientation=${paraments.orientation}&safesearch=${paraments.safesearch}`
  );
  return instance;
}

function createGallery(response) {
  if (!response.data.total) {
    form.reset();
    gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    renderGallery(response.data);
  }
}

function renderGallery({ hits, totalHits }) {
  const result = hits
    .map(item => {
      return `<div class="photo-card">
         <img
         src="${item.webformatURL}"
         alt="${item.tags}"
         loading="lazy"
         class="card-image"
         />
         <div class="info">
            <p class="info-item">
              <b>Likes</b>${item.likes}
            </p>
            <p class="info-item">
              <b>Views</b>${item.views}
            </p>
            <p class="info-item">
             <b>Comments</b>${item.comments}
            </p>
            <p class="info-item">
             <b>Downloads</b>${item.downloads}
            </p>
      </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', result);
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}
