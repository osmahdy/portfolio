let menuUl = document.querySelector(`header nav ul`);
let menuUlLi = document.querySelectorAll(`header nav ul li`);
let menuIcon = document.querySelector(`header nav`);

menuIcon.addEventListener('click', () => {
  if (window.innerWidth < 776) {
    menuUl.classList.contains(`ul-opened`) === true ? menuUl.classList.remove('ul-opened') : menuUl.classList.add('ul-opened');
    // menuUl.classList.contains(`ul-opened`) === true ? menuUl.classList.add('blur-background') : menuUl.classList.remove('blur-background');
  }
});

menuUlLi.forEach((li) => {
  li.addEventListener('click', () => {
    menuUlLi.forEach((li) => li.classList.remove('active'));
    li.classList.add('active');
  });
});

let windowHeight = window.innerHeight;
let scroll_up = document.querySelector(`.scroll-up`);
window.addEventListener('scroll', () => {
  if (window.scrollY < 700) {
    menuUlLi.forEach((li) => li.classList.remove('active'));
    menuUlLi[0].classList.add('active');
    scroll_up.classList.remove('show');
  } else {
    scroll_up.classList.add('show');
  }
});
scroll_up.addEventListener('click', () => {
  window.scrollTo(window.top);
});

// -------------------------------------------------------------------------------------------------------
let wrapper = document.querySelector(`.portfolio .repos .wrapper`);
let repos = [];
let isColumn = false;
let api = 'https://api.github.com/users/osmahdy/repos';
let exData = {};
let langs = {};
let js = [];
let vue = [];
fetchData(api);

async function fetchData(api) {
  let response = await fetch(api);
  let data = await response.json();
  exData = data;
  await useData(); // <- wait until all repo data + langs are processed
}

async function fetchLangs(api) {
  let response = await fetch(api);
  let data = await response.json();
  return data; // returns an object like { JavaScript: 10000, Vue: 2000 }
}

async function useData() {
  let data = exData;

  for (let i = 0; i < data.length; i++) {
    const langs = await fetchLangs(data[i].languages_url);
    const arrayOfLangs = Object.keys(langs).join(', ') || 'Unknown';

    createRepoTemplate(i, data[i].name, data[i].created_at.substring(0, 10), arrayOfLangs, data[i].has_pages ? `https://osmahdy.github.io/${data[i].name}` : data[i].html_url, data[i].html_url);
  }

  for (let i = 0; i < repos.length; i += 3) {
    wrappeInColumn(repos[i], repos[i + 1], repos[i + 2]);
  }
}

function createRepoTemplate(i, name, repoDate, langsUsed, demoLink, githubLink) {
  let repo = document.createElement(`div`);
  let h3 = document.createElement(`h3`);
  let date = document.createElement(`p`);
  let langs = document.createElement(`p`);
  let btns = document.createElement(`div`);
  let demo = document.createElement(`a`);
  let github = document.createElement(`a`);
  repo.classList.add('repo');
  h3.classList.add('name');
  date.classList.add('date');
  langs.classList.add('langs');
  btns.classList.add('btns');
  demo.classList.add('demo');
  github.classList.add('github');
  h3.innerHTML = `${i + 1}. ${name}`;
  date.innerHTML = `<b>Date Created: </b> ${repoDate}`;
  langs.innerHTML = `<b>Languages Used: </b> ${langsUsed}`;
  demo.textContent = 'Demo';
  github.textContent = 'GitHub';
  demo.setAttribute('href', demoLink);
  github.setAttribute('href', githubLink);
  repo.appendChild(h3);
  repo.appendChild(langs);
  repo.appendChild(date);
  btns.appendChild(demo);
  btns.appendChild(github);
  repo.appendChild(btns);
  repos.push(repo);
  if (i % 2 === 0) {
    isColumn = false;
  } else {
    isColumn = true;
  }
}
function wrappeInColumn(repo1, repo2, repo3) {
  let column = document.createElement('div');
  column.classList.add('column');

  if (repo1) column.appendChild(repo1);
  if (repo2) column.appendChild(repo2);
  if (repo3) column.appendChild(repo3);

  wrapper.appendChild(column);
}

// -------------------------------------------------------------------------------------------------------
let whBtn = document.querySelector('.contact .wrapper .whatsapp .sendBtn');
let title = document.querySelector('.contact .wrapper .whatsapp .title');
let textArea = document.querySelector('.contact .wrapper .whatsapp .txtArea');

whBtn.addEventListener('click', () => {
  const subject = title.value.trim();
  const body = textArea.value.trim();

  if (subject && body) {
    const phoneNumber = '972595295586'; //
    const message = `*${subject}*\n\n${body}`;
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    clearInputsWh();
    showNotification(true);
    window.open(link, '_blank'); //
  } else {
    showNotification(false);
  }
});

function sendMail() {
  let parms = {
    name: document.querySelector(`.contact .email .email`).value.trim(),
    email: document.querySelector(`.contact .email .email`).value.trim(),
    subject: document.querySelector(`.contact .email .title`).value.trim(),
    messege: document.querySelector(`.contact .email .textArea`).value.trim(),
  };
  emailjs.send('service_muzzt1i', 'template_76xg9wp', parms).then(
    (response) => {
      clearInputs();
      showNotification(true);
      console.log('SUCCESS!', response.status, response.text);
    },
    (error) => {
      showNotification(false);
      console.log('FAILED...', error);
    }
  );
}

function clearInputs() {
  document.querySelector(`.contact .email .email`).value = ' ';
  document.querySelector(`.contact .email .title`).value = ' ';
  document.querySelector(`.contact .email .textArea`).value = ' ';
  document.querySelector(`.contact .whatsapp .title`).value = ' ';
  document.querySelector(`.contact .whatsapp .textArea`).value = ' ';
}

function clearInputsWh() {
  document.querySelector(`.contact .whatsapp .title`).value = ' ';
  document.querySelector(`.contact .whatsapp .textArea`).value = ' ';
}

function showNotification(status) {
  let noti = document.querySelector(`.noti`);
  let good = document.querySelector(`.noti .good`);
  let bad = document.querySelector(`.noti .bad`);
  let span = document.querySelector(`.noti span`);
  //-----------------------------------------------------
  if (noti.classList.contains('noti-hide')) noti.classList.remove('noti-hide');
  noti.classList.add('noti-show');
  setTimeout(() => {
    noti.classList.remove('noti-show');
    noti.classList.add('noti-hide');
  }, 3000);
  if (status) {
    good.style.display = 'block';
    bad.style.display = 'none';
  } else {
    good.style.display = 'none';
    bad.style.display = 'block';
    span.textContent = 'Messege Not Sent';
    noti.style.backgroundColor = '#1e1e1e';
  }
}
// --------------------------------------------------------------------------------------------------------------------------
let contact = document.querySelector(`footer .contact a`);
let last = document.querySelector(`footer .last`);

let date = new Date().getFullYear();
last.innerHTML = `${date} &copy; created by <b>Osama</b> | Your success is my priority!`;
contact.addEventListener('click', (e) => {
  console.log(e);
});
