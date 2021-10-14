 let genresFilter = [];
 let castFilter = [];
 let movies = [];


document.getElementById("load-button").addEventListener("click",(event)=>{
    event.preventDefault();
    loadData();
})

document.getElementById("reset-button").addEventListener("click",clear);

function clear(){
    
    var element = document.getElementById("activeMovie");
    element.innerHTML = "";
    
}


function loadData(){
    var element = document.getElementById("content");
    element.innerHTML = '';
    fetch('./movies.json').then(((movies)=>movies.json())).then((data)=>loadInDivs(data.sort((x,y)=>y.year-x.year)));
}

/*
let fetchfilmek = fetch("movies.json").then((data) => {
    if (data.ok) {
        return movies.json();
    } else {
        return Promise.reject(
            new Error("A szerver " + data.status + " hibát adott")
        );
    }
}); */
function loadInDivs(data){
    if(!data){
        alert('HIBA');
        return;
    }
    movies = data.filter(x=>{ return filterComperator(x.cast,castFilter)  && filterComperator(x.genres,genresFilter)});
    console.log(genresFilter);
    fillFilterDisplay('genreF',genresFilter);
    fillFilterDisplay('castF',castFilter);
    var element = document.getElementById("content");
    element.innerHTML = '';
    var index = 0;
    for(var row of movies) {
        var para = document.createElement("li");
        var titleElement = document.createElement('a');
        titleElement.text = (`${row.title}`);
        titleElement.setAttribute('id',`${index}`);
        titleElement.addEventListener('click',
            (e)=>{
                e.preventDefault();
                showData(e.target.getAttribute('id'));
            }
        )
        para.appendChild(titleElement);
        if(row.year){
            var date = document.createTextNode(` (${row.year})`);
            para.appendChild(date);
        }
        element.appendChild(para);
        index++;
    }
}

function showData(index){
    const data = movies[index];
    document.getElementById('activeMovie').innerHTML='';
    var container = document.createElement('div');
    const attributes =[document.createElement('p').appendChild(document.createTextNode(`Név: ${data.title}`)),
    document.createElement('p').appendChild(document.createTextNode(`Kiadási év: ${getFormatedYear(data.year)}`)),
    document.createElement('p').appendChild(createNonClickableAList(data.cast,"Szereplő-lista: ",true)),
    document.createElement('p').appendChild(createNonClickableAList(data.genres,"Műfajok: ",false))];
    for(item of attributes) {
        document.getElementById('activeMovie').appendChild(item);
    }
}

function filterComperator(data,filter){
    if(filter.length===0){
        return true;
    }
    let result = false;
    for(let index = 1; index < data.length && !result;index++){
        result =  filter.includes(data[index]);
    }
    return result;
}



function createNonClickableAList(list,title, isCast) {
    const castParent = document.createElement('p');
    castParent.appendChild(document.createTextNode(title));
    for(cast of list){
        const castElement = document.createElement('a');
        castElement.text = cast;
        castElement.appendChild(document.createTextNode(' '));
        castElement.setAttribute('href','/');
        castElement.addEventListener('click',(e)=>{
            e.preventDefault();
            if(isCast){
                if(!castFilter.includes(e.target.text))
                    castFilter.push(e.target.text);
            } else {
                if(!genresFilter.includes(e.target.text))
                    genresFilter.push(e.target.text);
            }
            loadData();
        });
        castParent.appendChild(castElement);
    }
    return castParent;
}

function fillFilterDisplay(id,filter){
    document.getElementById(id).innerHTML = '';
    document.getElementById(id).appendChild(document.createTextNode(filter));
}

function getFormatedYear(year) {
    if(year) {
        return " ("+year+")";
    }
    return "";
}