import axios from 'axios';
import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let page = 1;
let query = '';

const queryParams = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 100,
};

form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  galleryList.innerHTML = '';
  query = '';
  page = 1;

  query = event.target.searchQuery.value.toLowerCase();

  fetchQuery(query, page)
    .then(({ data }) => {
      if (!data.total) {
        form.reset();
        gallery.innerHTML = '';
      } else {
        renderGallery(data);
      }
    })
    .catch(
      error =>
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        ),
      loadMore.classList.replace('load-more', 'load-more-hidden')
    );
}

function renderGallery(data) {
  galleryList.insertAdjacentHTML('beforeend', createMarkup(data.hits));
  loadMore.classList.replace('load-more-hidden', 'load-more');
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

async function fetchQuery(query, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '41296816-66b158bf0945ebd5221c62d2d';

  const instance = await axios(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=${queryParams.image_type}&orientation=${queryParams.orientation}&safesearch=${queryParams.safesearch}&per_page=${queryParams.per_page}&page=${page}`
  );
  return instance;
}

function createMarkup(arr) {
  return arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `
      <div class="photo-card">
         <img
         src="${webformatURL}"
         alt="${tags}"
         loading="lazy"
         class="card-image"
         />
         <div class="info">
            <p class="info-item">
              <b>Likes</b>${likes}
            </p>
            <p class="info-item">
              <b>Views</b>${views}
            </p>
            <p class="info-item">
             <b>Comments</b>${comments}
            </p>
            <p class="info-item">
             <b>Downloads</b>${downloads}
            </p>
      </div>
    </div>
    `
    )
    .join('');
}

function onLoadMore() {
  page += 1;
  fetchQuery(query, page).then(({ data }) => {
    galleryList.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    if (page > data.totalHits / data.hits.length) {
      loadMore.classList.replace('load-more', 'load-more-hidden');
    } else {
      loadMore.classList.replace('load-more-hidden', 'load-more');
    }
  });
}
