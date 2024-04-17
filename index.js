// Selectors
const themeToggleBtn = document.querySelector(".theme-toggle");
const checkBox = document.querySelector("#darkmode-toggle");
let dots = document.querySelectorAll(".dots");
let overlay = document.getElementById("overlay");
let outsideClickListener;
// let title = document.querySelector(".title");
// let details = document.querySelector(".details");
const theme = localStorage.getItem("theme");

const imagePreview = document.querySelector('.image-preview');
const fileInput = document.querySelector("input[type='file']");
let addDiv = document.querySelector(".add-div");
let createPostForm = document.querySelector(".popup");
let editPostForm = document.querySelector(".edit__popup");
// let closeBtns = document.querySelectorAll(".close-btn");
let footerAddPost = document.getElementById("add-button");
let footerHomeBtn = document.getElementById("home-button");
let footerProfileBtn = document.getElementById("profile-button");
let cards = document.querySelectorAll(".card");
let currentPageDB = 1;
let currentPage = document.body.dataset.currentpage;
// let cancelDeleteBtns = document.querySelectorAll(".close");
let currentUrl = window.location.href;
let lastPage = 0;
let deleteDiv = document.getElementById("delete-div");
let deleteButton = document.querySelector(".confirm__delete");
let token = localStorage.getItem("token");
const alert = document.querySelector(".alert");
const alertCloseBtn = document.querySelector(".alert .close-btn");
const alertMsg = document.querySelector(".alert .msg");
let commentInputButtons = document.querySelectorAll("#comment");
let editPostObj;
let createPostButtons;
let editPostTemplate;
let thePost = document.querySelector(".post__comments");
let commentsContainer = document.querySelector(".comments__info");
let commentsPhoneSection = document.querySelector(".swipe__comments");
let swipeCommentInput = document.querySelector(".comment__input");
let iconHolder = document.querySelector(".icon__holder");
const loader = document.querySelector(".loader");
let user = getCurrentUser();
let postObj = {};
let touchStartY
let touchMovement;
let comment;
// let postViewPortHeights;
// console.log(postViewPortHeights)
let renew = false;
let formData;
let commentInput
let url;
let baseURL = "https://tarmeezacademy.com/api/v1";

// console.log(postObj)
getPosts(currentPage);
// Checking theme
if (theme && checkBox) {
  document.body.classList.add(theme);
  checkBox.checked = true;
}
loginCheck()
function loginCheck() {
  if(!getCurrentUser() && alert) {
    alertMsg.textContent = "You have to log in first";
    alert.classList.add("danger-alert", "show", "showAlert");
    alert.classList.remove("hide");
    document.querySelector(".alert .close-btn").classList.add("active");
    window.location = "login.html";
  }
}
if(!window.location.pathname === "/Space/register.html" && !window.location.pathname === "/Space/login.html") {
  getPosts(currentPage);
  console.log("c")
}
user = getCurrentUser();
// console.log(user);
if(window.location.pathname === "/Space/index.html" && user && typeof user.profile_image === 'string' && user.profile_image.startsWith('http')) {
  document.querySelector(".add-post img").src = user.profile_image
}

// Handling theme toggler
if(themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark-mode");
    } else {
      localStorage.removeItem("theme");
    };
  });
}


function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alertMsg.textContent = `You have logged out successfully.`;
  alert.classList.add("success-alert", "show", "showAlert");
  alert.classList.remove("hide");
  document.querySelector(".alert .close-btn").classList.add("active");
  setTimeout(() => {
    alert.classList.add("hide");
    alert.classList.remove( "show");
  }, 5000);
  window.location = "login.html";
};

document.body.onload = (e) => {
  editPostTemplate = document.createElement("div");
  editPostTemplate.className = "edit__popup";
  // template.classList.add("active");
  editPostTemplate.innerHTML = `
    <div class="edit-header">
      <div class="close close-icon">X</div>
      <h2>Edit The Post</h2>
    </div>
    <div class="form">
      <div class="form-element">
        <label for="edit__title">Title</label>
        <input value="" class="type type__title" type="text" data-el="input" id="title" placeholder="Write a title...">
      </div>
      <div class="form-element">
        <label for="edit__details">Body</label>
        <textarea value="" class="type type__details" data-el="textarea" id="details" placeholder="Write the details..."></textarea>
      </div>
      <div class="form-element">
        <label for="edit__img">Image</label>
        <input type="file" id="img">
        <button class="custom-file-button">Choose File</button>
      </div>
      <div class="form-element fixed">
        <div class="submit-div">
          <button id="edited" type="submit">Edit</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(editPostTemplate);
    const customFileButtons = document.querySelectorAll(".custom-file-button");
    customFileButtons.forEach(el => {
      el.addEventListener("click", (e) => {
        console.log(e.target.parentElement)
        e.target.previousElementSibling.click();
      });
    });
    createPostButtons = document.querySelectorAll(".submit-div button");
    // console.log(createPostButtons)
    createPostButtons.forEach(el => {
      el.addEventListener("click", (e) => {
        let title;
        let body;
        let image;
        let functionality;
        let form = e.target.parentElement.parentElement.parentElement;
    
        title = form.querySelector("#title").value;
        body = form.querySelector("#details").value;
        image = form.querySelector("#img").files[0];
    
      //   if (e.target.id === "created") {
      //     title = document.getElementById("title").value;
      //     body = document.getElementById("details").value;
      //     image = document.getElementById("img").files[0];
      //   } else if(e.target.id === "edited") {
      // // watch over here!!!!!!!!!!!!!!!!!!!!!!!!!
      //   }
        functionality = e.target.id;
        formData = new FormData();
          formData.append('title', title);
      
          formData.append('body', body);
      
          if (image) {
              formData.append("image", image);
          };
        createNewPost(formData, functionality, e);
    
      });
    });
    let commentInput = document.querySelector(".comments__section input");
    if(commentInput) {
      // console.log(commentInput);
      commentInput.addEventListener("keyup", (e) => {
        console.log(e.target);
        if(e.key === "Enter" && !e.shiftKey) {
          comment = e.target.value;  
          console.log(comment)
          // console.log(comment)
          // let id = e.target.dataset.postid;
          let id = thePost.dataset.id;
          console.log(id)
          createComment(id, comment);
          e.target.value = "";
        };
      });
    }
};


window.addEventListener("scroll", function (e) {
  // renew = false;
  // if (!renew) {
  //   postViewPortHeights = 0;
  // } else {
  //   postViewPortHeights = window.scrollY;
  // }
  // console.log(postViewPortHeights)
  if (commentsPhoneSection.classList.contains("active")) {

    e.preventDefault();

  }
  let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

  let nothing = undefined;

  if (document.documentElement.scrollTop >= scrollHeight && currentPageDB < lastPage) {
      getPosts(currentPage, nothing, currentPageDB + 1);
      currentPageDB = currentPageDB + 1;
  };
});

function preventDefaultListener (e) {
    e.preventDefault();
};

function userClicked(userId) {
  window.location = `profile.html?userId=${userId}`;
};

async function postClicked(postId) {

  loader.classList.add("active");
  console.log(postId)
  console.log(postId)
  document.body.style.overflowY = "hidden";
  overlay.classList.add("showup");
  thePost.classList.add("open");
  try {
    let response = await fetch(`${baseURL}/posts/${postId}`, {
      "Accept": "application/json"
    });
    console.log(response);
    let result = await response.json();
    console.log(result.data.comments);
    let data = result.data;
    thePost.dataset.id = postId;
    loader.classList.remove("active");
    console.log(data)
    editPostObj = data;

    let userImage = document.querySelector(".post__comments .user__info img");

    commentsContainer.innerHTML = "";
    let title;
    let profileImage;
    console.log(data.author.profile_image)
    if (typeof data.author.profile_image === "string") {
      console.log("here")
      profileImage = data.author.profile_image;
      console.log(profileImage)
    } else {
      console.log("here twice")
      profileImage = 'unknownPerson.jpg';
    };
    let user = getCurrentUser();

    let isMyPost = user != null && data.author.id == user.id;
    let postAuth = ``;
    if (isMyPost) {
        postAuth = `
        <div class="sub-menu-wrap-post">
          <div class="sub-menu">
            <div id="edit" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(data))}">
              <i class="fa-solid fa-pen-to-square"></i>
              Edit post
            </div>
            <div id="delete" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(data))}">
              <i id="delete-i" class="fa-solid fa-trash"></i>
              Delete
            </div>
            <div id="go" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(data))}">
              <div>></div>
              Go to post
            </div>
            <div id="copy" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(data))}">
              <i class="fa-solid fa-copy"></i>
              Copy link
            </div>
            <div id="cancel" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(data))}">
              <i class="fa-solid fa-xmark"></i>
              Cancellation
            </div>
          </div>
        </div>
        `;
    } else {
      postAuth = `
        <div class="sub-menu-wrap-post">
          <div class="sub-menu">
            <div id="go" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(data))}">
              <div>></div>
              Go to post
            </div>
            <div id="copy" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(data))}">
              <i class="fa-solid fa-copy"></i>
              Copy link
            </div>
            <div id="cancel" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(data))}">
              <i class="fa-solid fa-xmark"></i>
              Cancellation
            </div>
          </div>
        </div>
      `;
    };
    commentsContainer.innerHTML += postAuth;
    let postHeader;
      postHeader = `
        <div class="every__comment">
          <div class="every__comment__header" data-user="${data.author.id}">
            <img class="cursor" src="${profileImage}" alt="">
            <div class="username cursor">${data.author.name}</div>
          </div>
          <div class="post__title" data-id="${data.id}">${data.body}</div>
        </div>
      `
    commentsContainer.innerHTML += postHeader;
    if (data.title) {
      title = `
        <div class="every__comment">
          <div class="post__title" data-id="${data.id}">${data.title}</div>
        </div>
      `
      commentsContainer.innerHTML += title;
    };
    console.log(postObj)
    // checkPost(data);
    for(let comment of data.comments) {
      let image;
      console.log(comment)
      if(comment.author.profile__image) {
        image = comment.author.profile__image;
      } else {
        image = 'unknownPerson.jpg';
      };
      let content = `
          <div class="every__comment">
            <div class="every__comment__header" data-user="${comment.author.id}">
              <img class="cursor" src="${image}" alt="">
              <div class="username cursor">${comment.author.name}</div>
            </div>
            <div class="post__title" data-id="${comment.id}">${comment.body}</div>
          </div>
        `;
        commentsContainer.innerHTML += content;
    };

    let img = document.querySelector(".post__section img");
    document.querySelector(".post__comments .username").innerHTML = data.author.name;
    document.querySelector(".post__comments .user__info img").src = profileImage;
    document.querySelector(".post__comments .user__info").dataset.user = data.author.id;

    if (typeof data.image === "string") {

      img.src = data.image;
    } else {

      img.src = "";
    };
  } catch (err) {
    console.log(err);
  };
};
let id;
function triggerTyping () {
  id = commentsPhoneSection.dataset.post;
  console.log(id)
  swipeCommentInput.querySelector("input").addEventListener("keyup", (e) => {
    if(e.key === "Backspace" && !swipeCommentInput.querySelector("input").value) {
      console.log("yes")
      iconHolder.classList.remove("active");
    } else if(swipeCommentInput.querySelector("input").value) {
        iconHolder.classList.add("active");
        
        if(e.key === "Enter" && !e.shiftKey) {
          comment = e.target.value;
          console.log(comment)
          let functionality = "phoneComment";
          createComment(commentsPhoneSection.dataset.post, comment, functionality);

          console.log(id)
          e.target.value = "";
          iconHolder.classList.remove("active");
        };

        iconHolder.addEventListener("click", (e) => {
          comment = swipeCommentInput.querySelector("input").value;
          let functionality = "phoneComment";
          console.log(id);
          createComment(id, comment, functionality);
          swipeCommentInput.querySelector("input").value = "";
          iconHolder.classList.remove("active");
        });
    };
  });
};


function openSwipeComments () {
  commentsPhoneSection.classList.add("active");
  swipeCommentInput.classList.add("active");
  // touchStartY = 0;


  document.querySelector(".swipe__comments .header__section").addEventListener("touchstart", (e) => {
    commentsPhoneSection.classList.add("no-transition");
    let touch = e.touches[0];
    if (!touchStartY) {

      touchStartY = touch.clientY; // Assign initial touch position

    };
  });


  document.querySelector(".swipe__comments .header__section").addEventListener("touchmove", (e) => {
    const estimatedViewportHeight = window.innerHeight;
    // Access the current touch position
    const currentTouchY = e.touches[0].clientY;
    // console.log(estimatedViewportHeight - currentTouchY)
    // Calculate the movement since the touch began
    touchMovement = currentTouchY - touchStartY;

    const movementPercentage = (touchMovement / estimatedViewportHeight) * 100;
    commentsPhoneSection.style.transform = `translateY(${movementPercentage}%)`;
  });


  document.querySelector(".swipe__comments .header__section").addEventListener("touchend", (e) => {

    let touchEndY = e.changedTouches[0].clientY;

    const swipeDistance = touchStartY - touchEndY;
    const collapseThreshold = 550; // Upward swipe to fully show comments
    const expandThreshold = 390; // Downward swipe to partially hide comments
    // touchStartY = touchEndY;
    // const currentTouchY = e.touches[0].clientY;

    // Calculate the movement since the touch began
    // const touchMovement = currentTouchY - touchStartY;
    // Update CSS classes based on movement
    if (touchEndY > collapseThreshold) {

        commentsPhoneSection.classList.remove("no-transition");
        commentsPhoneSection.style.transform = `translateY(100%)`;
        swipeCommentInput.classList.remove("active");
        focusOut();

    } else if (touchEndY < expandThreshold) {
      commentsPhoneSection.classList.remove("no-transition");

      commentsPhoneSection.style.transform = `translateY(-49%)`;
    }

  });
};

function toggleReadMoreSpans(element, span) {

  var el = element;
  var comp = el.currentStyle || getComputedStyle(el, null);
  var divHeight = el.offsetHeight
  var lineHeight = parseInt(comp.lineHeight);
  var lines = divHeight / lineHeight;
  // alert( comp.lineHeight );
  if (lines > 1.4) {
    span.classList.remove("hidden");
    element.classList.add("cut")
  } else if (lines < 1.4) {
    element.classList.remove("cut");
    span.classList.add("hidden");
  };
};
function css(element, style) {
  for (const property in style)
      element.style[property] = style[property];
};


if(alertCloseBtn) {
  alertCloseBtn.onclick = () => {
    alert.classList.add("hide");
    alert.classList.remove( "show");
    if(commentsPhoneSection.classList.contains("active")) {
      commentsPhoneSection.classList.remove("active");
      swipeCommentInput.classList.remove("active");
    };
    setTimeout(() => {
        alert.classList.remove("danger-alert", "warning-alert", "success-alert");
        console.log(alert.classList)
    }, 5000);
  };
}

function focusIn (e) {

  document.body.style.overflow = "hidden";
  overlay.classList.add("showup");
};

function focusOut (e) {

  overlay.classList.remove("showup")

  document.body.style.overflowY = "auto";
  document.querySelectorAll(".sub-menu-wrap").forEach(el => el.classList.remove("open-menu"));
  document.body.classList.remove("no-scroll");
}


if(footerAddPost) {
  footerAddPost.onclick = (e) => {
    if (!createPostForm.classList.contains("active")) {
      createPostForm.classList.add("active");
      overlay.classList.toggle("showup");
      document.body.classList.add('no-scroll');
      e.stopPropagation();
    };
  };


  footerHomeBtn.onclick = (e) => {
    if(currentPage === "profile") {
      let userId = getCurrentUser().id;
      window.location = `index.html`;
    } else {
      if (window.scrollY != 0) {
        setTimeout(function () {
          window.scrollTo({
            "behavior": "smooth",
            "top": "0"
          });
        }, 10);
      };
    };
  };

  footerProfileBtn.onclick = (e) => {
    if(currentPage === "home") {
      let userId = getCurrentUser().id;
      window.location = `profile.html?userId=${userId}`;
    } else {
      if (window.scrollY != 0) {
        setTimeout(function () {
          window.scrollTo({
            "behavior": "smooth",
            "top": "0"
          });
        }, 10);
      };
    };
  };
};
if (document.body.dataset && document.body.dataset.currentPage) {
  let currentPage = document.body.dataset.currentpage;
  // console.log(currentPage);
} else {
  // console.log("currentPage attribute not found");
}
function moveTo() {
  currentPage = document.body.dataset.currentpage;
  if (currentPage === "home") {
    document.querySelector("#container").innerHTML = "";
  } else if (currentPage === "profile") {
    document.querySelector("#container").innerHTML = "";
  }
}


async function fetchTheComments(postId) {
  loader.classList.add("active");
  document.querySelector(".body__section").innerHTML = "";
  console.log(postId)
  try {
    let response = await fetch(`${baseURL}/posts/${postId}`, {
      "Accept": "application/json"
    });
    // console.log(response);
    let result = await response.json();
    console.log(result.data.comments);
    let data = result.data;
    let comments = data.comments
    console.log(data);
    commentsPhoneSection.dataset.post = postId;
    triggerTyping(postId);
    loader.classList.remove("active");
    let image;
    let content = ``;
    if (data) {
      for(let comment of comments) {
        if (comment.author.profile_image && typeof comment.author.profile_image === 'string' && comment.author.profile_image.startsWith('http')) {

          image = comment.author.profile_image;
        } else {
          image = `unknownPerson.jpg`;

        }
        content = `
          <div class="comment" data-user="${comment.author.id}" data-id="${comment.id}">
            <div class="img__holder">
              <img src="${image}" alt="">
            </div>
            <div class="comment__texts">
              <div class="comment__header">
                <div class="username__header">${comment.author.username}</div>
              </div>
              <div class="comment__body">${comment.body}</div>
            </div>
          </div>
        `
        document.querySelector(".body__section").innerHTML += content;
      };
    };
  } catch (err) {
    console.log(err);
  };
};

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
      user = JSON.parse(storageUser)
  };
  return user;
};

function editPost (postData) {

  if(!thePost.classList.contains("open")) {
    overlay.classList.add("showup");
    focusIn();
  };
  editPostForm.classList.add("open");
  editPostForm.querySelectorAll(".type").forEach(el => {

    if(el.dataset.el === "input") {
      el.value = postData.title;
    } else if (el.dataset.el === "textarea") {
      el.value = postData.body;
    };
  });
  document.body.style.overflow = "hidden";
  editPostObj = postData;

};

function deleteConfirmation(postData) {
  deleteDiv.classList.add("active");
  deleteDiv.dataset.postData = postData;
  focusIn();
};

function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);

  const id = urlParams.get("userId");
  return id;
};

function userClicked(userId) {
  window.location = `profile.html?userId=${userId}`;
};



// Fetching the posts
async function getPosts(currentPage, scrollHeight, page = 1) {
  loader.classList.add("active");

  if (scrollHeight === "undefined") {
    scrollHeight = 0;
  } else {

  }
  window.scrollTo({
    top: scrollHeight,
    behavior: 'smooth' // Optional for smoother scrolling
  })
  // page = 1;
  if (currentPage === "home") {
    url = `${baseURL}/posts?sort=posts&limit=8&page=${page}`;
  } else if(currentPage === "profile") {
    let id = getCurrentUserId();

    if(!id) {
      let user = getCurrentUser();
      id = user.id;
    }
    url = `${baseURL}/users/${id}/posts`;
  };
  fetch(url, {
    "Accept": "application/json"
  })
  .then((response) => {
    let data = response.json();


    return data;
  }).then((data) => {

    if(currentPage === "home") {
      lastPage = data.meta.last_page;
    }
    data = data.data;
    if(currentPage === "profile") {
      data = data.reverse();
 
      let profileInfo
      if(data[0]) {
        profileInfo = data[0].author;
      } else {
        profileInfo = JSON.parse(window.localStorage.getItem("user"));
      };

      let profileImage = profileInfo.profile_image;
      let profileUsername = profileInfo.username;
      if (typeof profileImage === 'string' && profileImage.startsWith('http')) {
        document.querySelector(".profile__header img").src = profileImage;
      } else {
        document.querySelector(".profile__header img").src = 'unknownPerson.jpg';
      };
      document.querySelector(".profile__header .profile__username").textContent = profileUsername;

    };

    loader.classList.remove("active");
    for (post of data) {
        let author = post.author;
        let postTitle = "";
        // Show Or Hide (edit) button
        let user = getCurrentUser();

        let isMyPost = user != null && post.author.id == user.id;
        let postAuth = ``;
        if (isMyPost) {

            postAuth = `
            <div class="sub-menu-wrap">
              <div class="sub-menu">
                <div id="edit" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(post))}">
                  <i class="fa-solid fa-pen-to-square"></i>
                  Edit post
                </div>
                <div id="delete" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(post))}">
                  <i id="delete-i" class="fa-solid fa-trash"></i>
                  Delete
                </div>
                <div id="go" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(post))}">
                  <div>></div>
                  Go to post
                </div>
                <div id="copy" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(post))}">
                  <i class="fa-solid fa-copy"></i>
                  Copy link
                </div>
                <div id="cancel" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(post))}">
                  <i class="fa-solid fa-xmark"></i>
                  Cancellation
                </div>
              </div>
            </div>
            `;
        } else {
          postAuth = `
            <div class="sub-menu-wrap">
              <div class="sub-menu">
                <div id="go" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(post))}">
                  <div>></div>
                  Go to post
                </div>
                <div id="copy" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(post))}">
                  <i class="fa-solid fa-copy"></i>
                  Copy link
                </div>
                <div id="cancel" class="sub-menu-link" data-post="${encodeURIComponent(JSON.stringify(post))}">
                  <i class="fa-solid fa-xmark"></i>
                  Cancellation
                </div>
              </div>
            </div>
          `;
        };
        
        if (post.title != null) {
          postTitle = post.title;
        };
        let postImage = "";
        if (post.image != null) {
          postImage = `<img class="post__image skeleton cursor" onerror="hideBrokenImageIcon(this)" onclick="postClicked(${post.id})" src="${post.image}" alt="Post Image">`
        };
        let content = `
          <div class="card" data-id="${post.id}">
            <div class="card__header">
            <div class="user__post">
            <img onclick="userClicked(${author.id})" class="header_image cursor skeleton" src="${author.profile_image}" data-image="${author.profile_image}" alt="">
              <h4 onclick="userClicked(${author.id})" class="cursor hide  skeleton">${author.username}</h4>
            </div>
              <svg id="dots" class="cursor dots" xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16"> <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/> </svg>
              ${postAuth}
            </div>
            <div class="card__body">
              <img class="skeleton hide cursor" data-image="${post.image}" src>
              <h6 class="skeleton hide">${post.created_at}</h6>
              <div class="title__holder">
                <div class="title skeleton hide">${postTitle}</div>
                <span class="hidden" id="span"></span>
              </div>
              <div class="details__holder">
                <div class="details skeleton hide">${post.body}</div>
                <span class="hidden" id="span"></span>
              </div>
              <h5 data-post="${encodeURIComponent(JSON.stringify(post))}" class="view cursor">View all <span>${post.comments_count}</span> comments</h5>
              <div class="comment-div">
                <input data-postId="${post.id}" type="text" name="comment" id="comment" placeholder="Write a comment here...">
                <button class="share__comment cursor">
                  <i class="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        `;

        document.getElementById("container").innerHTML += content;
        let commentInputButtons = document.querySelectorAll("#comment");
        
        commentInput = document.getElementById("comment").value;

        if (scrollHeight > document.documentElement.clientHeight) {
          if (page > 1) {
            scrollHeight+= document.documentElement.clientHeight;
          }
         
          window.scrollTo({
            top: scrollHeight,
            behavior: 'smooth' // Optional for smoother scrolling
          })
        }
        commentInputButtons.forEach(el => {
          el.addEventListener("keyup", (e) => {
            if(e.key === "Enter" && !e.shiftKey) {
              comment = e.target.value;

              let id = e.target.dataset.postid;
    
              createComment(id, comment);
              e.target.value = "";
            };
          });
        });

        // Handling every card with read more span
        let cards = document.querySelectorAll(".card");

        for (let card of cards) {
          let bodyImages = card.querySelectorAll(".card__body img");
          bodyImages.forEach(el => {
            const image = el.dataset.image;
            if (typeof image === 'string' && image.startsWith('http')) {
              // console.log(image)
              let bodyImage = new Image();
              bodyImage.src = image;
              el.addEventListener("click", (e) => {
                let id = e.target.closest(".card").dataset.id;
                if(window.innerWidth > 450) {
                  postClicked(id);
                  e.stopPropagation();
                };
              });
              bodyImage.onload = () => {
                setTimeout(() => {
                  el.src = image;
                  el.classList.remove("skeleton")
                }, 1100);
              }
            } else {
              el.style.display = "none";
            };
          });
          let usersImage = card.querySelectorAll(".user__post img");
          usersImage.forEach(el => {
            const image = el.dataset.image;
            let bodyImage = new Image();
            bodyImage.src = image;
            
            setTimeout(() => {
              if (typeof image === 'string' && image.startsWith('http')) {
                bodyImage.onload = () => {
                  el.src = image;
                }
              } else {
                el.src = 'unknownPerson.jpg';
              };
            }, 1100);
          });
          const title = card.querySelector(".title");
          const details = card.querySelector(".details");
          const titleSpan = card.querySelector(".title__holder span");
          const detailsSpan = card.querySelector(".details__holder span");
          
          toggleReadMoreSpans(title, titleSpan);
          toggleReadMoreSpans(details, detailsSpan);
          
        };


        let readMoreSpans = document.querySelectorAll("#span");
        // Handling clicking on read more button
        readMoreSpans.forEach(span => {
          span.addEventListener("click", (e) => {
            span.classList.toggle("active");
            const contentElement = e.target.previousElementSibling;
            contentElement.classList.toggle("cut");
            const parentElement = contentElement.parentNode;
            parentElement.classList.toggle("active");
            contentElement.classList.toggle("active");
          });
        });

        setTimeout(() => {          
          cards.forEach(card => {
            const contentElement = card.querySelectorAll(".skeleton");
            contentElement.forEach((el) => {
              // console.log(el.append(author.username))
              
            })
            contentElement.forEach(el => {
              el.classList.remove("skeleton");
              el.classList.remove("hide");
              // el.classList.add("show");
            });
          });
        }, 1100);
    };
  });
};








function hideBrokenImageIcon(image) {
  image.style.display = "none";
};

function removeSkeletonLoadingAnimation (card) {
  const contentElement = card.querySelectorAll(".skeleton");
  contentElement.forEach(el => el.classList.remove("skeleton"));
};

async function createComment(postId, commentBody, functionality) {
  loader.classList.add("active");
  renew = true;
  let postViewPortHeights = window.pageYOffset;
  if (!commentBody) {
    return;
  }
  let params = {
    "body": commentBody
  };
  console.log(postId)
  let url = `https://tarmeezacademy.com/api/v1/posts/${postId}/comments?body=`;
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      "Accept": "application/json"
    },
    body: JSON.stringify(params)
  });
  let data = await response.json();
  if (data.message) {
    alertMsg.textContent = data.message;
    alert.classList.add("danger-alert", "show", "showAlert");
    alert.classList.remove("hide");
    document.querySelector(".alert .close-btn").classList.add("active");
    loader.classList.remove("active");
    throw new Error(data.message);
  } else {
    moveTo();
    alertMsg.textContent = "Your comment has been created successfully.";
    alert.classList.add("success-alert", "show", "showAlert");
    alert.classList.remove("hide");
    document.querySelector(".alert .close-btn").classList.add("active");
    loader.classList.remove("active");
    // console.log(postViewPortHeights)
    currentPageDB = 1 ;
    getPosts(currentPage, postViewPortHeights);
    // await getPosts(); // Wait for posts to be fetched
    if (thePost.classList.contains("open")) {
      commentsContainer.innerHTML = "";
      postClicked(postId);
    } else if (functionality === "phoneComment") {
      document.querySelector(".body__section").innerHTML = "";
      fetchTheComments(postId);
    }
  };
  setTimeout(() => {
    // alertCloseBtn.click();
    alert.classList.add("hide");
    alert.classList.remove( "show");
  }, 5000);
};


// Async functions
if(deleteButton) {
  deleteButton.addEventListener("click", (e) => {
    let postId = deleteDiv.dataset.id;
    deletePost(postId);
    deleteDiv.classList.remove("active");
    if(thePost.classList.contains("open")) {
      thePost.classList.remove("open");
      overlay.classList.remove("showup");
    };
    focusOut();
  });
}

async function deletePost (postId) {
  loader.classList.add("active");
  try {
    url = `${baseURL}/posts/${postId}`;
    let response = await fetch(url, {
      method: "Delete",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
      },
    });
    let results = await response.json();
    if (results.message || results.errors) {
      let errors = Object.values(results.errors).map(val => val).join(" ");
      loader.classList.remove("active");
      throw new Error(errors = results.message);
    } else {
      alertMsg.textContent  = "You have deleted the post successfully."
      alert.classList.add("success-alert", "show", "showAlert");
      alert.classList.remove("hide");
      loader.classList.remove("active");
      document.querySelector(".alert .close-btn").classList.add("active");
      moveTo();
      getPosts(currentPage);
    };
  } catch (err) {

    alertMsg.textContent  = err.message;
    alert.classList.add("danger-alert", "show", "showAlert");
    alert.classList.remove("hide");
    document.querySelector(".alert .close-btn").classList.add("active");
  };
  setTimeout(() => {
    alert.classList.add("hide");
    alert.classList.remove( "show");
  }, 5000);
};



async function createNewPost(formData, functionality, event) {
  loader.classList.add("active");
  if (functionality === "created") {
    url = `${baseURL}/posts`;
  } else if (functionality === "edited") {
    url = `${baseURL}/posts/${editPostObj.id}`;
    formData.append("_method", "put"); // for laravel and php
  };
  try {
    let response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
      }
    });

    let result = await response.json();

    if(result.message) {
      // let errors = Object.values(result.message).map(val => val).join(" ");
      loader.classList.remove("active");
      throw new Error(result.message);
    } else {
      alertMsg.textContent = `You have ${functionality} the post successfully.`;
      alert.classList.add("success-alert", "show", "showAlert");
      alert.classList.remove("hide");
      document.querySelector(".alert .close-btn").classList.add("active");
      loader.classList.remove("active");
      moveTo();
      let popup;
      if (functionality === "created") {
        popup = event.target.closest("#create__post__popup");
        popup.classList.remove("active");
      } else if (functionality === "edited") {
        popup = event.target.closest(".edit__popup");
        popup.classList.remove("open");
        popup.classList.remove("active");
        thePost.classList.remove("open");
      };
      popup.querySelectorAll(".type").forEach(el => el.value = "");

      focusOut();
      getPosts(currentPage);

      setTimeout(() => {
        alert.classList.add("hide");
        alert.classList.remove( "show");
      }, 5000);

    };
  } catch (err) {
    alertMsg.textContent = err.message;
    alert.classList.add("danger-alert", "show", "showAlert");
    alert.classList.remove("hide");
    document.querySelector(".alert .close-btn").classList.add("active");
    setTimeout(() => {
      alert.classList.add("hide");
      alert.classList.remove( "show");
      setTimeout(() => {
          alert.classList.remove("danger-alert", "warning-alert", "success-alert");
      }, 5000);
  }, 5000);
  };
};


let card;
let menu;
document.addEventListener("click", handleOpeningClicks, { capture: true });

function handleOpeningClicks(e) {
  loginCheck()

  if(thePost && !thePost.classList.contains("open")) {
    if(e.target.id === "dots") {
      // Inside dots
      card = e.target.closest(".card");
      menu = card.querySelector(".sub-menu-wrap");
      menu.classList.add("open-menu");
      focusIn();
    } else if(e.target.classList.contains("sub-menu-link") && menu.classList.contains("open-menu")) {
      // Much Much Much code here inside sub menu wrap
      let option = e.target;
      let postData = JSON.parse(decodeURIComponent(option.dataset.post));

      menu.classList.remove("open-menu");
      if(option.id === "edit"){
        let title;
        if (postData.title) {
          title = postData.title;
        };
        editPostObj = postData;
        editPostForm.classList.add("active");
        editPostForm.querySelector("#title").value = title;
        editPostForm.querySelector("#details").value = postData.body;

      } else if(option.id === "delete") {

        deleteDiv.classList.add("active");
        deleteDiv.dataset.id = postData.id;
      } else if(option.id === "cancel") {

        focusOut();
      };
    } else if(e.target.classList.contains("add-div")) {
      createPostForm.classList.add("active");
      focusIn();
    } else if(e.target.matches("h5")) {
      let postData = JSON.parse(decodeURIComponent(e.target.dataset.post));
      let id = postData.id;
      if (window.innerWidth > 650) {
        console.log("true")
        postClicked(id);
      } else {
        focusIn();
        openSwipeComments();
        console.log(id)

        commentsPhoneSection.style.transform = `translateY(0%)`;
        fetchTheComments(id);

      }
    } else if(e.target.classList.contains("share__comment")) {
      let shareBtn = e.target.closest(".share__comment");
      let postId = shareBtn.previousElementSibling.dataset.postid;
      let value = shareBtn.previousElementSibling.value;

      if (value) {
        createComment(postId, value);
      };
    } else if(e.target.classList.contains("logout")) {
      logout();
      console.log("fuck")
    }
  } else if(thePost && thePost.classList.contains("open")) { //Inside the post
    menu = document.querySelector(".sub-menu-wrap-post");
    if(e.target.id === "dots") {
      menu.classList.toggle("expand");
    } else if(e.target.classList.contains("sub-menu-link") && menu.classList.contains("expand")) {
      let option = e.target;
      let postData = JSON.parse(decodeURIComponent(option.dataset.post));

      menu.classList.remove("expand");
      if(option.id === "edit"){
        let title;
        if (postData.title) {
          title = postData.title;
        };
        editPostObj = postData;
        editPostForm.classList.add("active");
        editPostForm.querySelector("#title").value = title;
        editPostForm.querySelector("#details").value = postData.body;

      } else if(option.id === "delete") {

        deleteDiv.classList.add("active");
        deleteDiv.dataset.id = postData.id;
      } else if(option.id === "cancel") {

        menu.classList.remove("expand");

      };
    } else if(!e.target.classList.contains("showup")) {
      menu.classList.remove("expand");
    } else if(e.target.classList.contains("showup") && !e.target.classList.contains("post__comments")) {
      thePost.classList.remove("open");
      focusOut();
    }
  } else if(e.target.href === "profile.html") {
    getPosts("profile");
  }
  if(e.target.classList.contains("userImg")) {
    window.location = "profile.html";
  };
};


// Closing what is opened
if(overlay) {
  overlay.addEventListener("click", handleClosingClicks, { capture: true });
}
let activeMenu;

function handleClosingClicks(e) {
  document.querySelectorAll(".sub-menu-wrap").forEach(menu => {
    if(menu.classList.contains("open-menu")) {
      activeMenu = menu;
    };
  });
  if(!thePost.classList.contains("open")) {
    if(editPostForm.classList.contains("active")) {
      editPostForm.classList.remove("active");
      focusOut();
    } else if(deleteDiv.classList.contains("active")) {
      focusOut();
      deleteDiv.classList.remove("active");
    } else if(createPostForm.classList.contains("active")) {
      createPostForm.classList.remove("active");
      focusOut();
    } else if(activeMenu) {
      activeMenu.classList.remove("open-menu")
      focusOut();
    } else if(commentsPhoneSection.classList.contains("active")) {
      commentsPhoneSection.classList.remove("active");
      swipeCommentInput.classList.remove("active");
      focusOut();
    }
  }
};






// Visiting user profiles
if(thePost) {
  let closeBtns = Array.from(document.getElementsByClassName("close"));

// console.log(closeBtns)
closeBtns.forEach(btn => {
  btn.addEventListener("click", e => {
    // console.log("shshshshshhsh")
    if(thePost.classList.contains("open")) {
      if(e.target.classList.contains("refuse__delete")) {
  
        deleteDiv.classList.remove("active");
        // focusOut();
      } else if(e.target.closest(".edit__popup")) {
  
        editPostForm.classList.remove("active");
        // focusOut();
      } else {
        deleteDiv.classList.remove("active");
        // focusOut();
      }
    } else {
      if(e.target.closest(".popup")) {
  
        createPostForm.classList.remove("active");
        focusOut();
      } else if(e.target.classList.contains("refuse__delete")) {
  
        deleteDiv.classList.remove("active");
        focusOut();
      } else if(e.target.closest(".edit__popup")) {
  
        editPostForm.classList.remove("active");
        focusOut();
      } else {
        deleteDiv.classList.remove("active");
        focusOut();
      }
    }
  }, {capture: true});
});
  thePost.addEventListener("click", (e) => {
    if(e.target.closest(".user__info")) {
      let id = e.target.closest(".user__info").dataset.user;
      window.location = `profile.html?userId=${id}`;
    } else if(e.target.closest(".every__comment__header")) {
      let id = e.target.closest(".every__comment__header").dataset.user;
      window.location = `profile.html?userId=${id}`;
    }
  });
  commentsPhoneSection.addEventListener("click", e => {
    if(e.target.closest(".comment__header")) {
      let id = e.target.closest(".comment").dataset.user;
      window.location = `profile.html?userId=${id}`;
    } else if(e.target.closest(".img__holder")) {
      let id = e.target.closest(".comment").dataset.user;
      window.location = `profile.html?userId=${id}`;
    }
  });
}