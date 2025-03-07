
$("#submitForm").addEventListener('submit',e=>{
    e.preventDefault()
    const url = $("#url").value;
    const urlId = getYouTubePlaylistId(url)
    fetchId(urlId)
})

$("#btn_close_modal").addEventListener('click',()=>{
    $("#static-modal").classList.add("hidden")
})


function getYouTubePlaylistId(url) {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function fetchId(playlistId) {
    
    $("#loading").innerHTML = "loading..."
    
    try{
        const fetchData = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=id,snippet&maxResults=50&playlistId=${playlistId}&key=AIzaSyArubNG1C2EXk-UmxOO4sRn7X3YOlRU0uc`)
    
        const dataList = await fetchData.json()
        
        $("#loading").textContent = ""
        
        $("#result_playlist").innerHTML = await displayData(dataList.items) 
        
        $("#result_container").classList.remove('hidden')
        
    } catch(error) {
        console.log(error)
    }
       
}

async function displayData(datas) {

    let resultData = ''
    datas.forEach(data=>{        resultData+=displayResultPlaylist(data)
    })
    return await resultData
}

function displayResultPlaylist(data){
    
    const returnHtml = `<li class="pt-3 pb-0 sm:pt-4">
                <div class="flex items-center ">
                    <div class="shrink-0">
                        <img class="w-8 h-8 rounded-full" src="${data.snippet.thumbnails.default.url}" alt="Thomas image">
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            ${data.snippet.title}
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            ${data.snippet.description}
                        </p>
                    </div>
                    
                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="downloadContent('${data.snippet.resourceId.videoId}', '${data.snippet.title}', '${data.snippet.thumbnails.default.url}')">Download</button>                    
                </div>
            </li>`
    
    return returnHtml
            
}

function downloadContent(videoId,title, thumbnail){ 
     
    $("#static-modal").classList.remove("hidden") 
    $("#static-modal-history").classList.add("hidden")           
    const contentHtml = `
        
        <iframe class="w-[100%] h-64" src="https://youtube.com/embed/${videoId}" allow="accelerometer">
</iframe>


                    <div class="flex-1 min-w-0">
                        <p class="text-lg font-medium text-gray-900 truncate dark:text-white">
                            ${title}
                        </p>
                        
                    </div>
       

        <div class="flex flex-column mt-4">
            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="fetchUrlDownload('${videoId}', '${thumbnail}','${title}')">MP3</button>
        </div>
    `
    $("#downloadContent").innerHTML = contentHtml
    
    
}


function $(element){
    return document.querySelector(element);
}

async function fetchUrlDownload(url_id, thumbnail, title){    
    const response = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${url_id}`,{
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
           'x-rapidapi-key':'3ca26f1ec9msh45078f985bdafd6p1338aajsn896d4762287f'
        }
    });
    const data = await response.json()
    window.open(data.link)
    downloadHistory(url_id, title, thumbnail)
}

function historyShow(){
    $("#static-modal-history").classList.remove('hidden')
    
    var localHistory =localStorage.getItem("historyDownload")!=null?localStorage.getItem("historyDownload"):[]
    let htmlHistory = ''    
    JSON.parse(localHistory).forEach(history=>{
       htmlHistory += displayHistory(history)
    })
    
    $("#historyContent").innerHTML = htmlHistory
    
    
    
}

function displayHistory(history){
    const historyData = JSON.parse(history)
    
    return `<li class="pt-3 pb-0 sm:pt-4">
                <div class="flex items-center ">
                    <div class="shrink-0">
                        <img class="w-8 h-8 rounded-full" src="${historyData.thumbnail}" alt="Thomas image">
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            ${historyData.title}
                        </p>
                        
                    </div>
                    
                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="downloadContent('${history.dataLink}', '${historyData.title}', '${historyData.thumbnail}')">Download</button>                    
                </div>
            </li>`
    
}


function closeHistory() {
    $("#static-modal-history").classList.add('hidden')
}

function downloadHistory(dataLink, title, thumbnail){    
    var localHistory =localStorage.getItem("historyDownload")!=null?JSON.parse(localStorage.getItem("historyDownload")):[]
    
    const dataDownload = {
        dataLink:dataLink,
        title:title,
        thumbnail:thumbnail
    }
    
       localHistory.push(JSON.stringify(dataDownload))
    
    localStorage.setItem("historyDownload",JSON.stringify(localHistory))
}


        
