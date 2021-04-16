const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkDelete = document.getElementById('bookmark-delete');
const bookmarkForm = document.getElementById('bookmark-form');
const bookmarkName = document.getElementById('website-name');
const bookmarkEl = document.getElementById('website-url');
const bookmarkCon = document.getElementById('bookmarks-container');

let bookmarks = [];

/* Show Modal, Focus on Input */
function showModal(){
    modal.classList.add('show-modal');
    bookmarkName.focus();
}

/* Modal Event Listener */
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () =>modal.classList.remove('show-modal'));
window.addEventListener('click', (e)=>e.target === modal ? modal.classList.remove('show-modal'):false);

/* Validate Form */
function validate(nameValue, urValue){
    const expression =  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urValue){
        alert('Please submit values for both fields.')
        return false;
    }
    if (!urValue.match(regex)){
        alert('Please provide a valid web address.');
        return false;
    }
    return true; 
}

/* Build Bookmarks */
function buildBookmarks(){
    bookmarkCon.textContent = '';
    bookmarks.forEach((bookmark)=>{
        const {name, url} = bookmark;
        //Item
        const item = document.createElement('div');
        item.classList.add('item');
        //Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `bookmarkDel('${url}')`);
        //Favicon
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        //Append
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarkCon.appendChild(item);
    })
}

/* Delete Bookmark */
function bookmarkDel(url) {
    bookmarks.forEach((bookmark, i) =>{
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    })
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}


/* Fetch Bookmarks */
function fetchBookmarks(){
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'testing',
                url: 'testing.url'
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks(); 
}

/* Store Value */
function storeBookmark(e){
    e.preventDefault();
    const nameValue = bookmarkName.value;
    let urValue = bookmarkEl.value;
    /* validation to add */
    if (!urValue.includes('http://','https://')){
        urValue = `https://${urValue}`;
    }

    const bookmark = {
        name: nameValue,
        url: urValue
    }
    if (!validate(nameValue, urValue)){
        return false;
    }
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    bookmarkEl.focus();
}

bookmarkForm.addEventListener('submit', storeBookmark);

fetchBookmarks();
