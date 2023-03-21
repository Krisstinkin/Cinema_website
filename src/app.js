const form = document.getElementById('form')
const input = document.getElementById("idSearch")
let movie


const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'Td24bfq18lmsh5KqGTIsh6amrNJRp1h4MngjsnIdn2a8CFcrl5',
        'X-RapidAPI-Host': 'moviesdb5.p.rapidapi.com'
    }
};


async function loadMovies() {
    
    const input = document.getElementById("idSearch")
    let movie = input.value.trim()

    const response = await fetch(`https://moviesdb5.p.rapidapi.com/om?s=${movie}`, options);
    const data = await response.json()

    try {
        const movies = data.Search
        renderMovies(movies)
        return movies
    }

    catch {
        document.getElementById("movieContainer").innerHTML = `
        <div>
            <p class="text-2xl text-pink-600">Sorry, no movies found <br><span class="text-xl text-white">Please, try to write in English and try the searching again</span></p>
        <div>
        `
    }
    input.value = ""
}

function renderMovies(movies) {

    document.getElementById("movieContainer").innerHTML = ""
    
    movies.forEach((m) => {
        document.getElementById("movieContainer").innerHTML += `

            <div class="flex flex-col justify-between content text-center text-white text-lg items-center justify-center">
                <img class="flex m-auto justify-around items-center w-56 h-80 object-cover rounded-lg" src="${m.Poster}"/>
                <div class="px-3 py-4 text-lg items-center">${m.Title}</div>
                <div class="px-3 pb-3 font-bold text-base text-pink-600">${m.Year}</div>
                <button id="openModalButton-${m.imdbID}" class="pink_button flex items-center justify-center hover:bg-pink-600 cursor-pointer">Подробнее</button>
            </div>

        `
    })


    movies.forEach((m) => {
        document.getElementById(`openModalButton-${m.imdbID}`).addEventListener("click", () => openMoreInformation(m.imdbID))
    })

    
}

form.onsubmit = function (event) {
    event.preventDefault()
    loadMovies(`${movie}`)

}

const modalWindow = document.getElementById("modalWindow")
const closeModalButton = document.getElementById("modal-btn")

closeModalButton.addEventListener("click", closeModal)

function closeModal() {
    modalWindow.style.display = "none"
}

async function openMoreInformation(id) {

    const response = await fetch('https://moviesdb5.p.rapidapi.com/om?i='+id, options)
    const movieDetails = await response.json()

    modalWindow.style.display = "flex"

    document.getElementById("moreInfo").innerHTML = ""
    document.getElementById("moreInfo").innerHTML += `

            <div class="px-6 py-6">

                    <div>
                        <p class="text-pink-600 font-bold text-3xl mb-4">${movieDetails.Title}</p>
                    </div>

                    <div class="max-w-12xl mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2">

                        <div>
                            <img class="overflow-y-hidden rounded-lg" src="${movieDetails.Poster}"/>
                        </div>

                        <div class="text-pink-600 text-lg font-bold">

                            <p>Production:<span class="text-white font-light text-base"> ${movieDetails.Released}</span></p>
                            <p>Rating:<span class="text-white font-light text-base"> ${movieDetails.imdbRating  !== "N/A" ?  movieDetails.imdbRating : "-"}</span></p>
                            <p>Runtime:<span class="text-white font-light text-base"> ${movieDetails.Runtime !== "N/A" ?  movieDetails.Runtime : "-"}</span></p>
                            <p>Awards:<span class="text-white font-light text-base"> ${movieDetails.Awards !== "N/A" ?  movieDetails.Awards : "-"}</span></p>
                            <p>Country:<span class="text-white font-light text-base"> ${movieDetails.Country !== "N/A" ?  movieDetails.Country : "-"}</span></p>
                            <p>Genre:<span class="text-white font-light text-base"> ${movieDetails.Genre !== "N/A" ?  movieDetails.Genre : "-"}</span></p>

                        </div>

                    </div>

                        <p class="text-white text-lg font-light tracking-wide mt-4">About: <br> ${movieDetails.Plot !== "N/A" ?  movieDetails.Plot : "-"}</p>

            </div>
        `
}


