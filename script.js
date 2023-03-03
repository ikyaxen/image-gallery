const imageContainer = document.querySelector(".image-container");
const rows = document.querySelectorAll(".row");
const searchForm = document.getElementById("search-form");
const search = document.getElementById("search");

const PIXABAY_API_KEY = "33942706-aadfb989b398a0b4965c477f0";

window.addEventListener("load", () => {
  update("");
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  update(search.value);
});

// Cards hover effect
imageContainer.onmousemove = (e) => {
  for (const card of document.querySelectorAll(".card")) {
    const rect = card.getBoundingClientRect(),
    x = e.clientX - rect.left,
    y = e.clientY - rect.top;
  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
  }
};

/*
window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight;
  document.querySelectorAll('.card').forEach(card => {
    const cardTop = card.getBoundingClientRect().bottom;
    if (cardTop < triggerBottom) {
      card.classList.add('show');
    } else {
      card.classList.remove('show');
    }
  });
});
*/

// Create image card base on data
function createImageCard(data) {
  let imageURL = data.largeImageURL;
  let userImageURL = "";
  let username = data.user;
  let likes = data.likes;
  let views = data.views;
  let downloads = data.downloads;

  if (data.userImageURL === "") {
    userImageURL =
      "https://web.gs.emory.edu/vulnerability/_includes/images/no-image.jpg";
  } else {
    userImageURL = data.userImageURL;
  }

  return `
  <div class="card">
    <div class="content">
      <a class="image_link" href="${imageURL}">
        <img class="image" src="${imageURL}" alt="image-by-${username}" />
      </a>
      <div class="user_info">
        <div class="user_profile">
          <img class="user_image" src="${userImageURL}" alt="profile-of-${username}" />
          <h3 class="username">${username}</h3>
        </div>
        <div class="user_details">
          <h3><span><ion-icon name="heart-outline"></ion-icon></span> ${likes}</h3>
          <h3><span><ion-icon name="eye-outline"></ion-icon></span> ${views}</h3>
          <h3><span><ion-icon name="arrow-down-outline"></ion-icon></span> ${downloads}</h3>
        </div>
      </div>
    </div>
  </div>
  `;
}

function gen_image_api_key(query, type) {
  return `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=${type}&pretty=true`;
}

// Search images by query and type
async function searchImagesData(query) {
  let url = gen_image_api_key(query, "all");
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    alert("Sorry, Something went wrong!");
    console.log(err);
  }
}

function clearImages() {
  rows.forEach((row) => {
    row.innerHTML = "";
  });
}

function renderImages(data) {
  let current = 0;
  data.map((data) => {
    rows.forEach((row, index) => {
      if (current == index) {
        row.innerHTML += createImageCard(data);
      }
    });
    current += 1;
    if (current == rows.length) {
      current = 0;
    }
  });
}

function update(query) {
  searchImagesData(query).then((data) => {
    if (data.hits.length != 0) {
      clearImages();
      renderImages(data.hits);
    } else {
      alert("No image found!");
    }
    console.log(data);
  });
}
