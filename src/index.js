import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
// import cors from './getFeed';

const corsApiUrl = 'https://cors-anywhere.herokuapp.com';
const tempLink = 'https://ru.hexlet.io/blog.rss';

const cardTemplate = `<div class="mb-4 w-100" data-template="card">
<div class="card">
  <img src="..." class="card-img" alt="...">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <a href="#" class="btn btn-primary" target="_blank">Подробнее...</a>
  </div>
</div>
</div>`;

const cors = (link) => axios.get(`${corsApiUrl}/${link}`)
  .then((response) => response.data)
  .then((data) => {
    const domparser = new DOMParser();
    const rssHtml = domparser.parseFromString(data, 'text/html');
    return rssHtml;
  })
  .catch((error) => console.log('Error', error.message));

const feed = cors(tempLink);
feed.then((html) => {
  console.log(html);
  const top = document.getElementById('top');
  const card = document.createElement('div');
  card.innerHTML = cardTemplate;
  const items = [...html.getElementsByTagName('item')];

  items.forEach((item) => {
    const newCard = card.cloneNode(true);
    const cardImage = newCard.querySelector('img');
    const cardTitle = newCard.querySelector('.card-title');
    const description = newCard.querySelector('.card-text');
    const cardLink = newCard.querySelector('.btn');

    const itemImage = item.querySelector('[type="image/jpeg"]');

    const itemImageLink = itemImage ? itemImage.getAttribute('url') : 'https://dummyimage.com/600x400/000/fff';
    const itemTitle = item.querySelector('title');
    const itemText = item.querySelector('description');
    const itemLink = item.querySelector('link');

    cardTitle.innerHTML = itemTitle.innerHTML;
    description.innerHTML = itemText.innerHTML;
    cardLink.href = itemLink.nextSibling.textContent;
    cardImage.src = itemImageLink;
    top.append(newCard);
  });
});
