let input = document.querySelector(".search-box input");
let btn = document.querySelector(".btn");
let images = document.querySelector(".images");
let loadMore = document.querySelector(".load-more");
let lightbox = document.querySelector(".lightbox");
let lightboxImg = document.querySelector(".pre-img");
let photographerName = document.querySelector(".photographer-name");
let closeLightbox = document.querySelector(".close-lightbox");

const apiKey = "yK5x27vGsAgNnVxb0xE00j5yZiRvMmjLDwMLJAhtvhk";
const perPage= 20;
let keyword = "";
let currentpage = 1;
function download(imgurl){
  fetch(imgurl).then(res=>res.blob()).then(file=>{
    let a =document.createElement("a");
    a.href=URL.createObjectURL(file);
    a.download=new Date().getTime();
    a.click();
  }).catch(()=>alert("Faild to download"))
}
 
function openLightbox(imgSrc, name) {
  lightboxImg.src = imgSrc;
  photographerName.textContent = name;
  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeLightboxFunc() {
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
}

images.addEventListener("click", function (event) {
  let clickedImg = event.target.closest(".photo");
  if (!clickedImg) return;

  let photographer = clickedImg.closest(".card").querySelector(".photographer span").textContent;
  openLightbox(clickedImg.src, photographer);
  
});

closeLightbox.addEventListener("click", closeLightboxFunc);
lightbox.addEventListener("click", function (event) {
  if (event.target === lightbox) closeLightboxFunc();
});


async function getResponse() {
  
  keyword = input.value;
  let url = `https://api.unsplash.com/search/photos?page=${currentpage}&query=${keyword}&client_id=${apiKey}&per_page=${perPage}`;
  let response = await fetch(url);
  let data = await response.json();
  let results = data.results;
  if(currentpage==1){
    images.innerHTML="";
  }
  loadMore.style.display="block";
  // console.log(results);
  results.map((results) => {
    let li = document.createElement("li");
    li.classList.add("card");
  
    let html = `<img src="${results.urls.full}" alt="img" class="photo">
          <div class="details">
            <div class="photographer">
              <img src="camera.svg" alt="img">
              <span>${results.user.username}</span>
            </div>
            <div class="download" onclick=download('${results.urls.full}')>
              <img src="download.svg" alt="img">
            </div>
          </div>`;
    li.innerHTML = html;
    images.appendChild(li);
  });
}
btn.addEventListener("click", () => {
  currentpage = 1;
  getResponse();
});
loadMore.addEventListener("click",()=>{
   currentpage ++;
   getResponse();
})

input.addEventListener("keyup",(e)=>{
  currentpage = 1;
  if(e.key=="Enter"){
    getResponse();
  }
})