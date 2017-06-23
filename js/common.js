$(function() {
    var data,
        controller,
        view;

    data = {
        /* Объект для динамического хранения инпутов */
        controls: {}
    };

    controller = {

        /* Метод для удаления книги */
        removeBook: function (book) {
            book.closest('li').classList.add('transition');
            setTimeout(function() {
                book.closest('li').classList.add('hidden');
            }, 400);
        },

        /* Метод для появления попапа */
        showPopup: function () {
            $('.popup-wrapper').fadeIn();
        },

        /* Метод для закрытия попапа */
        closePopup: function () {
            $('.popup-wrapper').fadeOut();
            $('.warning').fadeOut();
            $('.year-validate').fadeOut();
        },

        /* Метод для добавления книги в список по кнопке Сохранить */
        addBook: function (bookList) {
            var book = this.div;
            bookList.appendChild(book);
            this.clearPopup();
        },

        /* Метод для очистки инпутов попапа после сохранения книги или отмены сохранения */
        clearPopup: function () {
            document.getElementById("book-title").value = "";
            document.getElementById("book-author").value = "";
            document.getElementById("book-year").value = "";
            document.getElementById("book-image").value = "";
            this.closePopup();
        },

        validateYear: function (bookList) {
            if (this.yearField > 2017) {
                $('.year-validate').fadeIn();
            } else {
                this.addBook(bookList);
            }
        },

        validateTitle: function (bookList) {
            this.yearField = parseInt(data.controls.year.replace(/\D+/g,""));

            if (data.controls.title.length === 0) {
                document.querySelector('.warning').classList.remove('hidden');
                $('.warning').fadeIn();
            } else {
                this.validateYear(bookList);
            }
        },

        /* Метод для инициирования свойств объекта data.controls значениями инпутов попапа*/
        initControls: function () {
            data.controls.title = document.getElementById("book-title").value;
            data.controls.author = document.getElementById("book-author").value;
            data.controls.year = document.getElementById("book-year").value;
            data.controls.image = document.getElementById("book-image").value;
            this.template();
        },

        /* Метод для создания шаблона под книгу */
        template: function () {
            var template =
                '<li class="book"> ' +
                '<div class="image"> ' +
                '<img id="image-replace" src="'+data.controls.image+'" alt=""> ' +
                '</div> ' +
                '<div class="description"> ' +
                '<h2 id="title-replace">'+data.controls.title+'</h2> ' +
                '<span id="author-replace" class="author">'+data.controls.author+'</span> ' +
                '<time id="year-replace">'+data.controls.year+'</time> ' +
                '</div> ' +
                '<div class="actions"> ' +
                '<input class="btn edit-btn" type="button" value="Редактировать"> ' +
                '<input class="btn red remove-btn" type="button" value="Удалить"> ' +
                '</div> ' +
                '</li>';
            this.div = document.createElement('div');
            this.div.innerHTML = template;
            view.render();
        },

        init: function () {
            view.init();
        }
    };

    view = {
        init: function () {
            this.bookList = document.querySelector('.books-list');
            this.addButton = document.querySelector('.add-btn');
            this.saveButton = document.querySelector('.save-btn');
            this.cancelButton = document.querySelector('.cancel-btn');
            this.bookTemplate = document.querySelector('script[data-template="books');
            this.closePopup = document.querySelector('.popup-close');
            this.popup = document.querySelector('.popup');

            this.bookList.onclick = function (event) {
                var target = event.target;
                if (!target.classList.contains('remove-btn')) {
                    return;
                }
                controller.removeBook(target);
            };

            /* Клик по кнопке  кнопке Добавить книгу*/
            this.addButton.onclick = function () {
                controller.showPopup();
            };

            /* Клик по кнопке сохранения книги */
            this.saveButton.onclick = function () {
              controller.initControls();
            };

            /* Клик по кнопке отмены сохранения книги */
            this.cancelButton.onclick = function () {
                controller.clearPopup();
                controller.closePopup();
            };

            /* Клик на области вне попапа для его закрытия */
            this.closePopup.onclick = function (e) {
              controller.closePopup(e);
            };

            /* Остановка баблинга */
            this.popup.onclick = function (e) {
                e.stopPropagation();
            };
        },

        render: function () {
            var bookList = this.bookList;

            controller.validateTitle(bookList);
        }
    };

    controller.init(); // Запускается при старте

}());
