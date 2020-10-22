let form = document.querySelector("#book-form");
let book_list = document.querySelector("#book-list");

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class Store {
  static get_books() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static add_book(book){
    let books = Store.get_books();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static display_books(){
    let books = Store.get_books();
    books.forEach(book =>{
      UI.addToBookList(book);
    })
  }
  static remove_book(isbn){
    let books = Store.get_books();
    books.forEach((book, index)=>{
      if(book.isbn === isbn){
        books.splice(index, 1)
      }
    })
    localStorage.setItem('books', JSON.stringify((books)))
  }
}

class UI {
  constructor() {}

  static addToBookList(book) {
    let list = document.querySelector("#book-list");
    let row = document.createElement("tr");
    row.innerHTML = `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button class='delete'>Delete</button></td>`;
    list.appendChild(row);
  }

  clearFields() {
    (document.querySelector("#title").value = ""),
      (document.querySelector("#author").value = ""),
      (document.querySelector("#isbn").value = "");
  }
  static showAlert(message, className) {
    let div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    let container = document.querySelector(".container");
    container.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
  removeBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
      Store.remove_book(target.parentElement.previousElementSibling.textContent.trim());
      UI.showAlert("Book removed!", "success");

    }
  }
}

form.addEventListener(
  "submit",
  (newBook = (e) => {
    let title = document.querySelector("#title").value,
      author = document.querySelector("#author").value,
      isbn = document.querySelector("#isbn").value;
    let ui = new UI();
    if (title === "" || author === "" || isbn === "") {
      UI.showAlert("Please fill-up all the fields!!!", "error");
    } else {
      let book = new Book(title, author, isbn);
      UI.addToBookList(book);
      UI.showAlert("Added a book in the list successfully!", "success");
      ui.clearFields();
      Store.add_book(book);
    }
    e.preventDefault();
  })
);

book_list.addEventListener("click", (e) => {
  let ui = new UI();
  ui.removeBook(e.target);

  e.preventDefault();
});

document.addEventListener('DOMContentLoaded', Store.display_books)