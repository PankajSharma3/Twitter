document.addEventListener("DOMContentLoaded", () => {
    let Name = document.querySelector('.Username'); 
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        if(data==null)
        window.location.href = "/login";
        Name.innerText = data.username;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
});

const post_btn = document.querySelector('.post_btn');
post_btn.addEventListener('click',()=>{
  const qoute = document.querySelector('.qoute');
  const value = qoute.value.trim();
  if(value!=""){
  fetch('/posts', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      alert(data.message);
  })
  .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
  });}
})


const logout = document.querySelector('.logout');
logout.addEventListener('click',()=>{
  const confirmed = confirm("Do you want to logout?");
  if (confirmed) {
      alert("Logout Successfully!");
      window.history.replaceState({}, document.title, '/login');
      window.location.href = "/login";
  }
});