// 1. Необходимо найти форму в которую пишем название фильма
const searchForm = document.getElementById('form')

// 2. Нужно найти сам инпут куда вносим данные
const input = document.getElementById("idSearch")

//3. Создаем переменную куда будем складывать наши фильмы из инпута (то, что пользователь вводит в поле для поиска фильма)
let movie

//4. Находим наш контейнер, в который будем складывать фильмы, которые запросил пользователь
const searchMovies = document.getElementById("movieContainer")

//5. Нужна функция, которая будет отправлять данные на сервер, когда мы нажмем на кнопку поиска
form.addEventListener('submit', makeMovies);

//6. Обращаемся с помощью get-запроса к открытой базе кино (сервис RapidApi)
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'Td24bfq18lmsh5KqGTIsh6amrNJRp1h4MngjsnIdn2a8CFcrl5',
        'X-RapidAPI-Host': 'moviesdb5.p.rapidapi.com'
    }
};

//7. Получаем данные с бекэнда
async function makeMovies(event) {

    //отменяем стандартное поведение браузера
    event.preventDefault()
 
    let movie = input.value.trim()

    const response = await fetch(`https://moviesdb5.p.rapidapi.com/om?s=${movie}`, options);
    const data = await response.json()   

    // 8. Необходимо вывести информацию, которую запросил пользователь. Но у нас может быть как корректный запрос, так и не корректный - поэтому пишем два условия

    try {
        const movies = data.Search
        renderMovies(movies)
        return movies
    }

    catch(error) {
        searchMovies.innerHTML += `
            <p class="text-2xl text-pink-600">Sorry, no movies found <br><span class="text-xl text-white">Please, try to write in English and try the searching again</span></p>
        `
    }
}

// 9. Отрисовываем наши фильмы

function renderMovies(movies) { 

    searchMovies.innerHTML = ""
    
    movies.forEach((movie) => {

        console.log(movies);
        
        searchMovies.innerHTML += `

            <div class="flex flex-col justify-between content text-center text-white text-lg items-center justify-center">
                <img class="flex m-auto justify-around items-center w-56 h-80 object-cover rounded-lg" src="${movie.Poster}"/>
                <div class="py-4 text-xl items-center">${movie.Title}</div>
                <div class="text-lg text-gray-500 items-center">(${movie.Type})</div>
                <div class="px-3 pb-3 font-bold text-base text-pink-600">${movie.Year}</div>
                <button id="openModalButton-${movie.imdbID}" class="pink_button flex items-center justify-center hover:bg-pink-600 cursor-pointer">Подробнее</button>
            </div>

        `
    })

    // 10. Готовим кнопку для открытия модального окно "Подробнее"
    movies.forEach((movie) => {
        //проходим по каждому элементу массива
        document
        //ищем нужный фильм по id
        .getElementById(`openModalButton-${movie.imdbID}`)
        .addEventListener("click", () => 
        openMoreDetailed(movie.imdbID)) //если нажали на кнопку, то модальное окно открывается
    })
    
}

// 11. Создаем модальное окно с деталями выбранного фильма
async function openMoreDetailed(id) {

    const response = await fetch('https://moviesdb5.p.rapidapi.com/om?i='+id, options)
    const data1 = await response.json()

    const modalWindow = document.getElementById("add-modal")

    // Открываем/закрываем модельные окна

    modalWindow.style.display = "flex";
    let span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modalWindow.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modalWindow) {
            modalWindow.style.display = "none";
        }
    }

    // Отрисовываем блок с дополнительной информацией о фильме

    document.getElementById("moreDetailed").innerHTML = ""
    document.getElementById("moreDetailed").innerHTML += `

            <div class="pt-6 pb-6 pr-6 pl-6">

                    <div class="max-w-12xl mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2">

                        <div>
                            <img class="overflow-y-hidden rounded-lg" src="${data1.Poster}"/>
                        </div>

                        <div class="text-pink-600 text-lg font-bold">

                            <p class="text-pink-600 font-bold text-3xl mb-8">${data1.Title}</p>
                            <p>Released:<span class="text-white font-light text-base">${data1.Released}</span></p>
                            <p>Rating IMBD:<span class="text-white font-light text-base">${data1.imdbRating  !== "N/A" ?  data1.imdbRating : "-"}</span></p>
                            <p>Country:<span class="text-white font-light text-base">${data1.Country !== "N/A" ?  data1.Country : "-"}</span></p>
                            <p>Genre:<span class="text-white font-light text-base">${data1.Genre !== "N/A" ?  data1.Genre : "-"}</span></p>
                            <p>Director:<span class="text-white font-light text-base">${data1.Director !== "N/A" ?  data1.Director : "-"}</span></p>
                            <p>BoxOffice:<span class="text-white font-light text-base">${data1.BoxOffice !== "N/A" ?  data1.BoxOffice : "-"}</span></p>
                            <p>Runtime:<span class="text-white font-light text-base">${data1.Runtime !== "N/A" ?  data1.Runtime : "-"}</span></p>
                            <p>Actors:<span class="text-white font-light text-base">${data1.Actors !== "N/A" ?  data1.Actors : "-"}</span></p>
                            <p>Awards:<span class="text-white font-light text-base">${data1.Awards !== "N/A" ?  data1.Awards : "-"}</span></p>
                            
                        </div>

                    </div>

                    <p class="text-white text-lg font-light tracking-wide mt-4">About: <br> ${data1.Plot !== "N/A" ?  data1.Plot : "-"}</p>

            </div>
        `
}


