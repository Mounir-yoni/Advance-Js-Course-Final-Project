
window.onload;

let page = 1;
let bodypost = document.getElementById("posts");
let post_id_for_edit;
getpost();

function getpost(){
  if (bodypost!=null) {
  axios
  .get("https://tarmeezacademy.com/api/v1/posts?page="+page)
  .then(function (posts) {
    // handle success
    for (post of posts.data.data) {
      console.log(post);
      affpost(post);

    }
    page++;
  
  })
  .catch(function (error) {
    // handle error
  });
  verifylogin();

  }    

}


  function affpost(post) {
  let primg;
  console.log(post.id)
  if (
    !post.author.profile_image ||
    typeof post.author.profile_image !== "string" ||
    post.author.profile_image === ""
  ) {
    primg =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOH2aZnIHWjMQj2lQUOWIL2f4Hljgab0ecZQ&s";
    } else {
      primg = post.author.profile_image;
    }
    
    bodypost.innerHTML += `
    <div class="card shadow "  >
              <div class="card-header d-flex justify-content-between">
                <div>
                <img src="${primg}" alt="" style="height: 40px;width: 40px;" class="rounded-circle border border-2">
                <b class="ml-1" onclick="openprofile(${post.author.id})" style="cursor: pointer;">@${post.author.name}</b>
                </div>
                <div class="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" onclick="getidofpost(${post.id})" class="btn  dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen mt-2" viewBox="0 0 16 16">
                                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                      <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#postedit">Edit post</a></li>
                      <li><a class="dropdown-item" href="#" onclick="deletepost()">Delete post</a></li>
                    </ul>
                </div>

              </div>
              <div class="card-body" onclick="postclick(${post.id})" style="cursor: pointer;">
                <img src="${post.image}" class="w-100" alt="">

                <h6 style="color: #a7a7a7;" class="mt-1">
                  ${post.created_at}
                </h6>
                <h5>
                ${post.title}
                </h5>
                <p>
                ${post.body}
                </p>
                <hr>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                  </svg>         
                  <span>(${post.comments_count}) Comments</span>
                </div>
              </div>
    </div>`;
}

let test=5000;
window.addEventListener("scroll", ()=>{
  const endOfPage = window.innerHeight + window.pageYOffset - test>= document.body.offsetHeight;

  if (endOfPage) {
    test=test+4000;
    getpost();
  }
});

function loginclick() {
  const Username = document.getElementById("UserName-login").value;
  const Password = document.getElementById("Password-login").value;

  const parm = {
    username: Username,
    password: Password,
  };

  const url = "https://tarmeezacademy.com/api/v1/login";

  axios
    .post(url, parm)
    .then(function (response) {
      // handle success
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const model = document.getElementById("login");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      document.getElementById("login-alert").style.display = "block";
      verifylogin();
      setInterval(() => {
        document.getElementById("login-alert").style.display = "none";
      }, 5000);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      errormesg(error.response.data.message, "alert-error-login");
    });
}

function registerclick() {
  const name = document.getElementById("name-text").value;
  const username = document.getElementById("Username-reg").value;
  const password = document.getElementById("password-register").value;
  const image = document.getElementById("register-image").files[0];

  let fromdata = new FormData();
  fromdata.append('name',name);
  fromdata.append('username',username);
  fromdata.append('password',password);
  fromdata.append('image',image);

  const header = {
    "Content-Type": "multipart/form-data",
  };

  const url = "https://tarmeezacademy.com/api/v1/register";

  axios.post(url,fromdata,{
      headers:header,
    })
    .then(function (response) {
      // handle success
      console.log(response.data.user.name);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user.username));

      const model = document.getElementById("register");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();

      document.getElementById("register-alert").style.display = "block";
      verifylogin();
      setInterval(() => {
        document.getElementById("register-alert").style.display = "none";
      }, 5000);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      errormesg(error.response.data.message, "alert-error");
    });
}

function verifylogin() {
  if (!localStorage.token) {
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("register-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("add-btn").style.display = "none";
    document.getElementById("user-name").style.display='none';
    document.getElementById("user-img").style.display='none';

  } else {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("register-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("add-btn").style.display = "block";
    const userlocal = JSON.parse(localStorage.getItem("user"));
    document.getElementById("user-name").style.display='block';
    document.getElementById("user-img").style.display='block'
    document.getElementById("user-img").src=userlocal.profile_image;
    document.getElementById("user-name").innerHTML=userlocal.name;
  }
}

function errormesg(messeg, id) {
  const divalert = document.getElementById(id);
  divalert.innerHTML = messeg;
  divalert.style.display = "block";
  setInterval(() => {
    document.getElementById("alert-error").style.display = "none";
  }, 5000);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.getElementById("logout-alert").style.display = "block";
  setInterval(() => {
    document.getElementById("logout-alert").style.display = "none";
  }, 5000);
  verifylogin();
}

function creatnewpost() {
  const body = document.getElementById("text-post").value;
  const title = document.getElementById("title-post").value;
  const image = document.getElementById("image-post").files[0];

  let formdata = new FormData();
  formdata.append("body", body);
  formdata.append("title", title);
  formdata.append("image", image);

  const token = localStorage.token;
  const header = {
    "Content-Type": "multipart/form-data",
    authorization: "Bearer " + token,
  };

  const url = "https://tarmeezacademy.com/api/v1/posts";

  const model = document.getElementById("post");
  const modelInstance = bootstrap.Modal.getInstance(model);
  modelInstance.hide();

  document.getElementById("post-create-alert-weting").style.display = "block";
  new Promise(function (resolve, reject) {
    setTimeout(() => {
      document.getElementById("post-create-alert-weting").style.display =
        "none";
      resolve();
    }, 3000);
  }).then(() => {
    axios
      .post(url, formdata, {
        headers: header,
      })
      .then(function (response) {
        // handle success
        console.log(response);
        document.getElementById("post-create-alert-success").style.display =
          "block";
        setTimeout(() => {
          document.getElementById("post-create-alert-success").style.display =
            "none";
          window.location.reload(true);
        }, 3000);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        document.getElementById("post-create-alert-failed").innerHTML =
          error.response.data.message;
        document.getElementById("post-create-alert-failed").style.display =
          "block";
        setTimeout(() => {
          document.getElementById("post-create-alert-failed").style.display =
            "none";
        }, 3000);
      });
  });
}


function postclick(postid){

  window.location = `postDetails.html?postId=${postid}`;

}

function getidofpost(id){
  post_id_for_edit = id;
}


function edit_post() {
  const title = document.getElementById("title-post-edit").value.trim();
  const body = document.getElementById("text-post-edit").value.trim();

  if (!title && !body) {
    alert("Please provide a title or body to update.");
    return;
  }

  // Prepare parameters
  const parm = {};
  if (title) parm.title = title;
  if (body) parm.body = body;

  // Token and headers
  const token = localStorage.getItem("token");
  const header = {
    "Content-Type": "application/json", // Changed to application/json
    authorization: `Bearer ${token}`,
  };

  // Debugging logs
  console.log("Body:", body);
  console.log("Title:", title);
  console.log("Payload:", parm);





  // Make API request


  axios
    .put(`https://tarmeezacademy.com/api/v1/posts/${post_id_for_edit}`, parm, {
      headers: header,
    })
    .then(function (response) {
      // Handle success

      const model = document.getElementById("postedit");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();

      console.log("Response:", response);
      alert("Post updated successfully!");
    })
    .catch(function (error) {
      // Handle error
      console.error("Error:", error);
      alert("Failed to update the post. Please try again.");
    });
}

function deletepost(){
  const token = localStorage.getItem("token");
  const header = {
    "Content-Type": "application/json", // Changed to application/json
    authorization: `Bearer ${token}`,
  };
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${post_id_for_edit}`, {
      headers: header,
    })
    .then(function (response) {
      // Handle success
      const deletealert = document.getElementById("post-delete");
      deletealert.innerText='The post has been deleted.';
      deletealert.style.display='block';
      setTimeout(()=>{
        deletealert.style.display="none"
        window.location.reload(true);
      },3000)
    })

    .catch(function (error) {
      // Handle error
      const deletealert = document.getElementById("post-delete");
      deletealert.innerText=error.response.data.error_message;
      deletealert.style.display='block';
      setTimeout(()=>{
        deletealert.style.display="none"
      },3000)

      console.error("Error:", error);
    });

}

function openprofile(userid){
  window.location = `profilPage.html?userId=${userid}`;
}