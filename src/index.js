import { fetchBreeds } from './cat-api';
import { fetchCatByBreed } from './cat-api';

const select = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

loader.hidden = false;
error.hidden = true;
select.style.width = '180px';

function renderOptions(response) {
  const options = response.map(({ id, name }) => {
    return `<option value = "${id}" class="js-option">${name}</option>`;
  });
  options.unshift(
    '<option value="" disabled selected>Choose the breed</option>'
  );
  return (select.innerHTML = options.join(''));
}

fetchBreeds()
  .then(response => {
    loader.hidden = true;
    renderOptions(response);
  })
  .catch(() => {
    error.hidden = false;
    select.hidden = true;
  });

select.addEventListener('change', onChange);

function onChange(event) {
  error.hidden = true;
  if (event.target.value) {
    select.firstChild.remove();
    loader.hidden = true;
    catInfo.innerHTML = '';
  }
  fetchCatByBreed(event.target.value)
    .then(response => {
      loader.hidden = true;
      catInfo.innerHTML = markup(response) ?? (catInfo.innerHTML = '');
    })
    .catch(() => {
      error.hidden = false;
      select.hidden = true;
    });
}

function markup(response) {
  if (response.length) {
    const url = response[0].url;
    return response[0].breeds
      .map(({ name, description, temperament }) => {
        return `<img src="${url}" alt="Cat ${name}" width="400px"/>
        <div class="card">
        <h2 class="card-name">${name}</h2>
        <p class="card-desc">${description}</p>
        <p class="card-temp"><span class=card-temp-title>Temperamet: </span>${temperament}</p>        
        </div>`;
      })
      .join('');
  } else {
    error.hidden = false;
    select.hidden = true;
  }
}
