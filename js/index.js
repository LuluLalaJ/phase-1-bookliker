document.addEventListener("DOMContentLoaded", function(){
    getBooks()
});

//not a fan of how everything is chained; need to refract in the end


//get a list of books from the server

const baseURL = "http://localhost:3000/"
const booksURL = baseURL + "books/"
const usersURL =  baseURL + "users/"

const myUserID = {
    id: 11,
    username: "Chen"
}

function getBooks() {
    fetch(booksURL)
    .then(response => response.json())
    .then(books => books.forEach(book => createBookLi(book)))
}


function createBookLi(book) {
    const bookListItem = document.createElement('li');
    bookListItem.textContent = book.title
    bookListItem.setAttribute('id', `${book.id}`)
    document.getElementById('list').appendChild(bookListItem)
    bookListItem.addEventListener('click', getOneBook)

}

function getOneBook(event) {
    const bookID = event.target.id;
    const bookURL = booksURL + bookID;
    fetch(bookURL)
    .then(response => response.json())
    .then(book => display(book))
}


function display(book) {
    let parent = document.getElementById('show-panel'); 
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }

    renderOneBook(book);
}

function renderOneBook(book) {
    const pBook = document.createElement('p');
    pBook.className = 'bookdetail'; 

    const img = document.createElement('img');
    img.src = book.img_url
    img.alt = `${book.title} cover`
    pBook.appendChild(img)

    const h3 = document.createElement('h3');
    h3.textContent = book.title;
    pBook.appendChild(h3)

    const h4 = document.createElement('h4');
    h4.textContent = book.subtitle
    pBook.appendChild(h4)

    const hAuthor = document.createElement('h4');
    hAuthor.textContent = book.author;
    pBook.appendChild(hAuthor);

    const pDescription = document.createElement('p')
    pDescription.textContent = book.description
    pBook.appendChild(pDescription); 

    const fanList = document.createElement('ul')
    pBook.appendChild(fanList)

    book.users.forEach(user => {
        const bookFan = document.createElement('li');
        bookFan.textContent = user.username;
        fanList.appendChild(bookFan)
        //create another helper function since this bit of code needs to
        //be used again 
    })

    const btn = document.createElement('button')
    if (currentUserLikes(book)) {
        btn.textContent ='unlike';
    } else {
        btn.textContent ='like'
    }
    btn.addEventListener('click', () => addBookFan(book)) 
    pBook.appendChild(btn)

    document.getElementById('show-panel').appendChild(pBook)
}


function addBookFan(book) {
    if (currentUserLikes(book)) {
        let updatedUsers = book.users.filter(user => user.id !== myUserID.id)
        let updatedBook = {...book, users: updatedUsers}
        likePatchRequest(book, updatedBook)
    } else {
        let updatedUsers = [...book.users, myUserID]
        let updatedBook = {...book, users: updatedUsers}
        likePatchRequest(book, updatedBook)
    }      
}

function likePatchRequest(book, updatedBook) {
    const requestPost = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accepts': 'application/json',
            },
            body: JSON.stringify(updatedBook)
        }

        fetch((booksURL + book.id), requestPost)
        .then(response => response.json())
        .then(book => display(book))
}

//need to further refract to make the userID more dynamic

function currentUserLikes(book) {
    return (book.users.find(user => user.id === 11))
}

//MODERN WAY: instead of DOMContentLoaded
//Since we want things to be loaded simultaneously 
//add in the HTML file --> script --> add "defer"