"use strict";


const menus = document.querySelectorAll('.page-nav');
const pages = document.querySelectorAll('.page');


window.addEventListener('DOMContentLoaded', ()=>{
    updatePage()
    
})



menus.forEach(menu=>{
    menu.addEventListener('click', ()=>{
        menus.forEach(m=>{m.classList.remove('active')})
        pages.forEach(p=>{p.classList.remove('active')});
        menu.classList.add('active');
        document.getElementById(menu.dataset.page).classList.add('active')
    })
});

let movieArray = JSON.parse(localStorage.getItem('movieArray')) || []
    
const search = document.querySelector('.search');

search.addEventListener('input', (e)=>{
    const value = e.target.value.toLowerCase();


    document.querySelectorAll('.movie-item').forEach(card => {
        const id = Number(card.dataset.id);
        const movie = movieArray.find(m => m.id === id);

        const show = movie.mName.toLowerCase().includes(value);

        card.classList.toggle('hide', !show)

    })
    
})



const addCont = document.querySelector('.add-movie-cont')
const addBtn = document.querySelectorAll('.add-movie-btn');
const closeBtn = document.querySelector('.close-btn');
const modal = document.querySelector('.modal');
const notiCont = document.querySelector('.noti-cont')

addBtn.forEach(addBtn =>{
    addBtn.addEventListener('click', ()=>{
        showAdd(addCont, 'active');
        showAdd(modal, 'active')
    })
})

closeBtn.addEventListener('click', ()=>{
    closeAdd(addCont, 'active');
    closeAdd(modal, 'active');
})

//both functions control displaying popups and modals
function showAdd(parent, cname){
    parent.classList.add(cname)
}
function closeAdd(parent, cname){
    parent.classList.remove(cname)
}


const addForm = document.getElementById('add-movie');

addForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    validateForm(addForm);
})

function validateForm(formCheck){
    const movieName = document.getElementById('movie-name');
    const movieNote = document.getElementById('movie-note');
    const movieImage = document.getElementById('movie-image');
    const movieStatus = document.getElementById('movie-status');
    const movieYear = document.getElementById('movie-year');
    const movieGenre = document.getElementById('movie-genre');
    const movieRate = document.getElementById('movie-rate');


    if(movieName.value.trim().length < 1 || movieName.value === '') {
        errorMessage(movieName, 'Enter a movie name');
        return;
    } else if(!isNaN(movieName.value)){
        errorMessage(movieName, 'Enter a valid Movie name');
        return;
    } else {
        clearError(movieName)
    }

    if(movieNote.value.trim().length < 1 || movieNote.value === ""){
        errorMessage(movieNote, 'Enter a short note about the movie.'); 
        return;
    } else {
        clearError(movieNote);
    }

    if(movieImage.value === ''){
        errorMessage(movieImage, 'Enter a valid image URL, e.g. https://example.com/poster.jpg');
        return;
    }  else if (!isValidUrl(movieImage.value.trim())) {
        errorMessage(movieImage, 'Enter a valid image URL, e.g. https://example.com/poster.jpg');
        return;
    } else {
        clearError(movieImage)
    }

    if(movieStatus.value === 'default') {
        errorMessage(movieStatus, 'Select movie status');
        return;
    } else {
        clearError(movieStatus)
    }

    if(movieYear.value.trim().length < 4 || movieYear.value === ""){
        errorMessage(movieYear, 'Enter movie production year');
        return;
    } else {
        clearError(movieYear)
    }

    if(movieGenre.value === 'default') {
        errorMessage(movieGenre, 'Select movie genre');
        return;
    } else {
        clearError(movieGenre)
    }

    if(movieRate.value === '' || isNaN(movieRate.value)){
        errorMessage(movieRate, 'Enter movie rating between 1-10');
        return;
    } else if(Number(movieRate.value.trim().length) > 2) {
        errorMessage(movieRate, 'Choose between 1 - 10');
        return;
    } else {
        clearError(movieRate)
    }

    if(formCheck){
        const formData = {
            id : Date.now(),
            mName : movieName.value,
            mNote : movieNote.value,
            mImage : movieImage.value,
            mStatus : movieStatus.value,
            mYear : movieYear.value,
            mGenre : movieGenre.value,
            mRate : movieRate.value
        }
        movieArray.unshift(formData);
        closeAdd(addCont, 'active');
        closeAdd(modal, 'active');
        showAdd(notiCont, 'active');
        document.querySelector('.noti-text').textContent = 'Movie Added Successfully'
        formCheck.reset();
        setTimeout(() => {
            closeAdd(notiCont, 'active')
        }, 4500);
    }
    localStorage.setItem('movieArray', JSON.stringify(movieArray))   
    createCard() 
}


function errorMessage(input, message) {
    const error = document.getElementById(input.id + "-error")
    
    error.textContent = message;
    error.classList.add('active')

}
function clearError(input){
    const error = document.getElementById(input.id + "-error");
    error.textContent = "";
    error.classList.remove("active");
}

//validates movie image url field
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function updatePage(){
    const watchlistMovies = movieArray.filter(movie => movie.mStatus === 'watchlist');
    const watchMovies = movieArray.filter(movie => movie.mStatus === 'watched');

    const introCont = document.querySelectorAll('.intro-cont');
    const movieCont = document.querySelector('.movie-cont');
    const moviePage = document.querySelector('.movie-page');
    const watchlistCont = document.querySelector('.watchlist-cont');
    const watchlistPage = document.querySelector('.watchlist-page')
    const watchedCont = document.querySelector('.watch-cont');
    const watchtedPage = document.querySelector('.watched-page')

    if(movieArray.length > 0 ) {
        introCont[0].style.display = 'none';
         moviePage.classList.remove('empty');
         movieCont.style.display = 'grid';
    } else {
        introCont[0].style.display = 'flex';
        movieCont.style.display = 'none';
        moviePage.classList.add('empty');
    }

    if(watchlistMovies.length > 0) {
         introCont[1].style.display = 'none';
         watchlistPage.classList.remove('empty');
         watchlistCont.style.display = 'grid';
    } else {
         introCont[1].style.display = 'flex';
        watchlistCont.style.display = 'none';
        watchlistPage.classList.add('empty');        
    }

    if(watchMovies.length > 0) {
        introCont[2].style.display = 'none';
         watchtedPage.classList.remove('empty');
         watchedCont.style.display = 'grid';

    } else {
         introCont[2].style.display = 'flex';
         watchedCont.style.display = 'none';
        watchtedPage.classList.add('empty');
    }
    
}


function createCard(){
    const watchlistMovies = movieArray.filter(movie => movie.mStatus === 'watchlist');
    const watchMovies = movieArray.filter(movie => movie.mStatus === 'watched');


    //for all movies page
     const movieCont = document.querySelector('.movie-cont');
     movieCont.innerHTML = ``;

     movieArray.forEach(movie =>{
        const movieItem = document.createElement('div');
        // movieItem.classList.add('movie-item');
        // movieItem.dataset.id = movie.id;
        generateCard(movieItem, movie);
        movieCont.appendChild(movieItem)

     })

     //for watchlist page
    const listCont = document.querySelector('.watchlist-cont');
    listCont.innerHTML = ``;

    watchlistMovies.forEach(movie =>{
        const listItem = document.createElement('div');
        generateCard(listItem, movie);
        listCont.appendChild(listItem);
    })

    //for watched page
    const watchCont = document.querySelector('.watch-cont');
    watchCont.innerHTML = ``;

    watchMovies.forEach(movie =>{
        const watchItem = document.createElement('div');
        generateCard(watchItem, movie);
        watchCont.appendChild(watchItem);
    })


    updatePage()


}

//this generates the card display structures for each page
function generateCard(item, unit){
        item.classList.add('movie-item');
        item.dataset.id = unit.id;
        item.innerHTML = `
            <div class="movie-image-cont">
                            <img src="${unit.mImage}" alt="" width="200" height="200">
                            <div class="m-more">
                                <button class="detail-btn" onclick="showRevPage(${unit.id})">View details</button>
                            </div>
                        </div>
        `

       
}

createCard()

function showRevPage(cardId) {
    const reviewMovie = movieArray.find(movie => Number(movie.id) === Number(cardId));
    localStorage.setItem('movieDetails', JSON.stringify(reviewMovie))
    
    if(!reviewMovie){return;}


    const movieMoreCont = document.querySelector('.movie-more-cont');
    const moreC = document.querySelector('.more-c');
    moreC.innerHTML = ``;
 
    const moreBlock = document.createElement('div');
    moreBlock.classList.add('more-block');
    moreBlock.innerHTML = `                    
                     <div class="more-header">
                        <div class="more-image">
                            <img src="${reviewMovie.mImage}" alt="" width="150" height="150">
                        </div>
                        <div class="more-cont">
                            <p><span class="high">Movie Name</span> <br> ${reviewMovie.mName}</p>
                            <p><span class="high">Movie Release Year </span> <br> ${reviewMovie.mYear}</p>
                            <p><span class="high">Movie Status</span> <br> ${reviewMovie.mStatus}</p>
                            <p><span class="high">Movie Genre</span> <br> ${reviewMovie.mGenre}</p>
                            <p><span class="high">Movie Rating</span> <br> ${reviewMovie.mRate}</p>
                        </div>
                    </div>
                    <div class="more-body">
                        <p><span class="high">Movie Note</span> <br> ${reviewMovie.mNote}</p>
                    </div>
                    <div class="more-footer">
                        <button class="edit-btn" onclick="showEdit(${reviewMovie.id})">Edit</button>
                        <button class="delete-btn" onclick="showDelete(${reviewMovie.id})">Delete Movie</button>
                    </div>                    
    `;
    moreC.appendChild(moreBlock);
    showAdd(modal, 'active')
    showAdd(movieMoreCont, 'active')   
    showAdd(moreC, 'active')
    const closeRevBtn = document.querySelector('.close-rev-btn');
    closeRevBtn.addEventListener('click', ()=>{
        closeAdd(modal, 'active');
        closeAdd(movieMoreCont, 'active');  
        closeAdd(moreC, 'active');  
    })
    
}


//displays the edit page

function showEdit(editId){

    document.querySelector('.movie-more-cont').classList.remove('active')
    

    const editFormCont = document.querySelector('.edit-form-cont');
    const editM = document.querySelector('.edit-m');
    editFormCont.classList.add('active');
    editM.innerHTML = '';

    const editDetails = movieArray.find(movie => movie.id === editId)

    const editForm = document.createElement('form');
    editForm.classList.add('edit-form');
    editForm.innerHTML = `
                
                <legend>Edit movie details</legend> 
                    <div class="edit-group">
                        <label for="edit-name">Movie Name</label>
                        <input type="text" id="edit-name" name="edit-name" value="${editDetails.mName}">
                    </div>
                    <div class="edit-group">
                        <label for="edit-note">Note </label>
                        <textarea name="edit-note" id="edit-note">${editDetails.mNote}</textarea>
                    </div>
                    <div class="edit-group">
                        <label for="edit-image">Movie Poster</label>
                        <input type="text" id="edit-image" name="edit-image" value="${editDetails.mImage}" >
                    </div>
                    
                    <div class="movie-add-footer">
                        <div class="edit-group">
                            <label for="edit-status">Status</label>
                            <select name="edit-status" id="edit-status">
                                <option value="watched" ${editDetails.mStatus === "watched" ? "selected" : ""}>Watched</option>
                                <option value="watchlist" ${editDetails.mStatus === "watchlist" ? "selected" : ""}>Watchlist</option>
                            </select>
                        </div>
                        <div class="edit-group">
                            <label for="edit-year">Release Year</label>
                            <input type="text" id="edit-year" name="edit-year" value="${editDetails.mYear}">
                        </div>
                        <div class="edit-group">
                            <label for="edit-genre">Genre</label>
                           <select name="edit-genre" id="edit-genre">
                                <option value="action" ${editDetails.mGenre === "action" ? "selected" : ""}>Action</option>
                                <option value="romance" ${editDetails.mGenre === "romance" ? "selected" : ""}>Romance</option>
                                <option value="comedy" ${editDetails.mGenre === "comedy" ? "selected" : ""}>Comedy</option>
                                <option value="melo-drama" ${editDetails.mGenre === "melo-drama" ? "selected" : ""}>Melo-drama</option>
                                <option value="sci-fi" ${editDetails.mGenre === "sci-fi" ? "selected" : ""}>Sci-Fi</option>
                                <option value="anime" ${editDetails.mGenre === "anime" ? "selected" : ""}>Anime</option>
                                <option value="historical" ${editDetails.mGenre === "historical" ? "selected" : ""}>Historical</option>
                            </select>
                        </div>
                        <div class="edit-group">
                            <label for="edit-rate">Rating</label>
                            <input type="text" id="edit-rate" name="edit-rate" value="${editDetails.mRate}">
                        </div>
                    </div>
                    <div class="save-edit-btn-cont">
                        <button class="save-edit-btn">Save edit</button>
                    </div>
            `
       


        editM.appendChild(editForm)
         const closeEditBtn = document.querySelector('.close-edit-btn')
        closeEditBtn.addEventListener('click', ()=>{
            closeAdd(editFormCont, 'active')
            closeAdd(modal, 'active')
        })
        editForm.addEventListener('submit', (e)=>{
            e.preventDefault()
            editFormer(editForm)
            closeAdd(editForm, 'active');
            closeAdd(editFormCont, 'active');
            closeAdd(modal, 'active');

            document.querySelector('.noti-text').textContent = 'Movie Edited Successfully'
            showAdd(notiCont, 'active');
            setTimeout(() => {
                closeAdd(notiCont, 'active')
            }, 4500);
            
        })

 
}

function editFormer(formEdit){
    const editName = document.getElementById('edit-name').value;
    const editNote = document.getElementById('edit-note').value;
    const editImage = document.getElementById('edit-image').value;
    const editStatus = document.getElementById('edit-status').value;
    const editYear = document.getElementById('edit-year').value;
    const editGenre = document.getElementById('edit-genre').value;
    const editRate = document.getElementById('edit-rate').value;



    if(formEdit) {
        let editDetails = JSON.parse(localStorage.getItem('movieDetails'))
        
        
        
        const formDetails = {
            id : editDetails.id,
            mName : editName || editDetails.mName,
            mNote : editNote || editDetails.mNote,
            mImage : editImage || editDetails.mImage,
            mStatus : editStatus || editDetails.mStatus,
            mYear : editYear || editDetails.mYear,
            mGenre : editGenre || editDetails.mGenre,
            mRate : editRate || editDetails.mRate,
        }

       const index = movieArray.findIndex(movie => movie.id === editDetails.id);

       if(index !== -1) {
        movieArray[index] = formDetails;
        
        localStorage.setItem('movieArray', JSON.stringify(movieArray))
        createCard();
       }

       
      

    //    location.reload()



    }
}


//shows delete popup confirmation before deleting or not

function showDelete(revId){
    const delCont = document.querySelector('.delete-cont');
    showAdd(delCont, 'active')
    modal.style.zIndex = '180'

    const noBtn = document.querySelector('.no-btn');
    noBtn.addEventListener('click', ()=>{
        closeAdd(delCont, 'active');
        modal.style.zIndex = '150'
    });

    const yesBtn = document.querySelector('.yes-btn');
    yesBtn.addEventListener('click', ()=>{
        
        deleteMovie(revId)
        closeAdd(delCont, 'active')
        closeAdd(modal, 'active')
        document.querySelector('.movie-more-cont').classList.remove('active');
        document.querySelector('.noti-text').textContent = 'Movie Deleted Successfully'
            showAdd(notiCont, 'active');
            setTimeout(() => {
                closeAdd(notiCont, 'active')
            }, 4500);
            modal.style.zIndex = '150'

    })
    
}

//deletes selected movie

function deleteMovie(movieId) {
    const index = movieArray.findIndex(movie => movie.id === movieId);
    
    if(index !== -1) {
        movieArray.splice(index, 1);
         localStorage.setItem('movieArray', JSON.stringify(movieArray));

         createCard()
    }
    // location.reload()
}



const menuIcon = document.getElementById('menu-icon');

menuIcon.addEventListener('click', ()=>{
    const nav = document.querySelector('nav');
    nav.classList.toggle('active', !nav.classList.contains('active'))
    showAdd(modal, 'active')

    
    modal.addEventListener('click', ()=>{
        if(nav.classList.contains('active')) {
            closeAdd(nav, 'active')
            closeAdd(modal, 'active')
        }
    })
    
   

   
})


