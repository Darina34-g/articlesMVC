const articles = document.querySelector('.articles');
const form = document.querySelector('form');
const submitBtn = document.getElementById('submit-btn');
const url = 'http://localhost/IV1-23-1.loc/api/articles';

let editId = null;

function addArticleToPage(item) {
    if (!item || item.error || !item.name) return;

    const listElement = document.createElement('li');
    listElement.classList.add('articles-list');

    const title = document.createElement('h2');
    title.textContent = item.name;

    const img = document.createElement('img');
    img.classList.add('articles-img');
    if (item.img && item.img !== 'null') {
        img.src = '../' + item.img;
    } else {
        img.style.display = 'none';
    }

    const text = document.createElement('p');
    text.textContent = item.text;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редактировать';
    editBtn.classList.add('btn', 'btn-primary');
    editBtn.type = 'button';

    editBtn.addEventListener('click', function () {
        editId = item.id;
        document.getElementById('inputName').value = item.name || '';
        document.getElementById('inputText').value = item.text || '';
        if(submitBtn) submitBtn.textContent = 'Отправить изменения';
        
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.classList.add('btn', 'btn-danger');
    deleteBtn.type = 'button';

    deleteBtn.addEventListener('click', function () {
        if (!item.id) {
            alert('Обновите страницу, чтобы удалить созданную статью');
            return;
        }
        fetch(`${url}/${item.id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка сервера при удалении');
                return response.json();
            })
            .then(data => {
                if (data.result === 'OK') {
                    if (editId === item.id) cancelEdit();
                    loadArticles();
                }
            })
            .catch(error => console.error('Ошибка удаления:', error));
    });

    listElement.appendChild(title);
    if (item.img && item.img !== 'null') listElement.appendChild(img);
    listElement.appendChild(text);
    listElement.appendChild(editBtn);
    listElement.appendChild(deleteBtn);

    articles.appendChild(listElement);
}

function loadArticles() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Список загружен:', data);
            articles.innerHTML = '';
            if (data && data.articles) data.articles.forEach(addArticleToPage);
        })
        .catch(error => console.error('Ошибка загрузки:', error));
}

function cancelEdit() {
    editId = null;
    form.reset();
    submitBtn.textContent = 'Добавить';
}

// function updateArticleOnPage() {

// }


loadArticles();

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameValue = document.getElementById('inputName').value;
    const textValue = document.getElementById('inputText').value;
    const fileInput = document.getElementById('inputImg');
    const imgValue = fileInput && fileInput.files[0] ? 'uploads/' + fileInput.files[0].name : null;

    const articleData = {
        name: nameValue,
        text: textValue,
        img: imgValue
    };

    const jsonData = { articles: [articleData] };

    const isEditing = editId !== null;
    const requestUrl = isEditing ? `${url}/${editId}` : url;
    const method = isEditing ? 'PUT' : 'POST';

    fetch(requestUrl, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сервера: ' + response.status);
            return response.json();
        })
        .then(data => {
            console.log('Ответ сервера:', data);
            cancelEdit();
            loadArticles();
        })
        .catch(error => {
            console.error('Ошибка при сохранении:', error);
        });
});


