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
                book.closest('li').remove();
            }, 400);
        },

        /* Метод для записи значений строки книги в попап редактирования */
        writeEditPopup: function (parent) {
            document.getElementById("book-edit-title").value = parent.querySelector('.book h2').innerHTML;
            document.getElementById("book-edit-year").value = parent.querySelector('.book time').innerHTML;
            document.getElementById("book-edit-author").value = parent.querySelector('.book .author').innerHTML;
            document.getElementById("book-edit-image").value = parent.querySelector('.book img').getAttribute('src');
            this.showEditPopup();
        },

        /* Метод для отображения попапа редактирования */
        showEditPopup: function () {
            $('.popup-edit').fadeIn();
        },

        /* В методе значения из попапа редактирования подставляются в книгу */
        editBook: function (parent) {
            parent.querySelector('.book h2').innerHTML = document.getElementById("book-edit-title").value;
            parent.querySelector('.book time').innerHTML = document.getElementById("book-edit-year").value;
            parent.querySelector('.book .author').innerHTML = document.getElementById("book-edit-author").value;
            parent.querySelector('.book img').setAttribute('src', document.getElementById("book-edit-image").value);
            this.closePopup();
        },

        /* Метод для отображения попапа добавления */
        showAddPopup: function () {
            $('.popup-add').fadeIn();
        },

        /* Метод для закрытия попапа */
        closePopup: function () {
            $('.popup-add').fadeOut();
            $('.popup-edit').fadeOut();
            $('.warning').fadeOut();
            $('.year-validate').fadeOut();
        },

        /* Метод для добавления книги в список по кнопке Сохранить */
        addBook: function (bookList) {
            var resultBook = this.bookWrapper;
            bookList.appendChild(resultBook);
            this.clearPopup();
        },

        /* Метод для очистки инпутов попапа после сохранения книги или отмены сохранения */
        clearPopup: function () {
            document.getElementById("book-add-title").value = "";
            document.getElementById("book-add-author").value = "";
            document.getElementById("book-add-year").value = "";
            document.getElementById("book-add-image").value = "";
            this.closePopup();
        },

        /* Метод для проверки поля год на валидность */
        validateYear: function (bookList) {
            this.yearField = parseInt(data.controls.year.replace(/\D+/g,""));
            if (this.yearField > 2017) {
                $('.year-validate').fadeIn();
            } else {
                this.addBook(bookList);
            }
        },

        /* Метод для проверки поля Наименование на валидность */
        validateTitle: function (bookList) {
            if (data.controls.title.length === 0) {
                document.querySelector('.warning').classList.remove('hidden');
                $('.warning').fadeIn();
            } else {
                this.validateYear(bookList);
            }
        },

        /* Метод для инициирования свойств объекта data.controls значениями инпутов попапа*/
        initControls: function () {
            data.controls.title = document.getElementById("book-add-title").value;
            data.controls.author = document.getElementById("book-add-author").value;
            data.controls.year = document.getElementById("book-add-year").value;
            data.controls.image = document.getElementById("book-add-image").value;
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
            this.bookWrapper = document.createElement('div');
            this.bookWrapper.innerHTML = template;
            view.render();
        },

        /* Метод инициализации переменных и установки обработчиков */
        init: function () {
            view.init();
        }
    };

    view = {
        init: function () {
            var self = this;
            this.bookList = document.querySelector('.books-list'); // Список (ul) книг
            var bookListWrapper = document.querySelector('.books'); // Секция (section.books) внутри которой список (ul)
            var book = document.querySelectorAll('.book'); // Элементы (li.book) списка (ul)
            this.addButton = document.querySelector('.add-btn'); // Кнопка "Добавить книгу"
            var saveAddButton = document.querySelector('.popup-add .save-btn'); // Кнопка "Сохранить" (1)
            self.saveEditButton = document.querySelector('.popup-edit .save-btn'); // Кнопка "Сохранить" (2)
            var cancelButton = document.querySelectorAll('.cancel-btn'); // Кнопки "Отмена"
            var closePopup = document.querySelectorAll('.popup-close'); // Область вне попапа (чтобы закрыть его)
            var popup = document.querySelectorAll('.popup'); // Сам попап
            var yearFields = document.querySelectorAll('.year-control');

            /* Вешается обработчик на поле для ввода года */
            for (var yearCounter = 0; yearCounter < yearFields.length; yearCounter++) {
                yearFields[yearCounter].onkeyup = function () {
                    this.value = this.value.replace (/\D/, '');
                }
            }

            /* Вешается обработчик на кнопки "Редактировать" */
            bookListWrapper.onclick = function (event) {
                var target = event.target;
                var parent = target.closest('.book');
                if (!target.classList.contains('edit-btn')) {
                    return;
                }
                controller.writeEditPopup(parent);

                self.saveEditButton.onclick = function () {
                    controller.editBook(parent);
                }
            };

            /* Вешается обработчик на кнопки "Удалить" */
            this.bookList.onclick = function (event) {
                var target = event.target;
                if (!target.classList.contains('remove-btn')) {
                    return;
                }
                controller.removeBook(target);
            };

            /* Клик по кнопке  кнопке Добавить книгу*/
            this.addButton.onclick = function () {
                controller.showAddPopup();
            };

            /* Клик по кнопке сохранения книги */
            saveAddButton.onclick = function () {
              controller.initControls();
            };

            /* Клик по кнопке отмены сохранения книги */
            for (var cancelButtonCounter = 0; cancelButtonCounter < cancelButton.length; cancelButtonCounter++ ) {
                cancelButton[cancelButtonCounter].onclick = function () {
                    controller.clearPopup();
                }
            }

            /* Клик на области вне попапа для его закрытия */
            for (var closePopupCounter = 0; closePopupCounter < closePopup.length; closePopupCounter++) {
                closePopup[closePopupCounter].onclick = function () {
                    controller.clearPopup();
                }
            }

            /* Остановка баблинга */
            for (var popupCounter = 0; popupCounter < popup.length; popupCounter++) {
                popup[popupCounter].onclick = function (e) {
                    e.stopPropagation();
                }
            }

        },

        render: function () {
            var bookList = this.bookList;

            controller.validateTitle(bookList);
        }
    };

    controller.init(); // Запускается при старте

}());