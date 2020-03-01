// encodes images to Base64 and stores resulting string in db
// very heavy on db; not recommended
function capturePose() {
    setTimeout(() => {
        const canvas = document.querySelector('canvas');
        const image = document.createElement('img');
        const p = document.createElement('p');
        const br = document.createElement('br');
        let name = `posenet${++current}`
        document.body.append(br, p, image);
        const data = canvas.toDataURL();
        arr = findAverageScore();
        // console.log(url);
        if (lastScores != []) {
            console.log(arr, lastScores);
        }
        image.src = data;
        image.width = width;
        fetch('http://localhost:3000/api/v1/drawings', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                data: data,
                user_id: userId,
                xaverage: arr[0],
                yaverage: arr[1]
            })
        }).then(res => res.json())
        .then(console.log);
    }, 5000);
}

// saves image to disk and stores path in db
// function postImage() {
    // const body = document.body;
    // const br = document.createElement('br');
    // const img = document.createElement('img');
    // let name = `posenet${++current}`;
    // let data = `C:\\Users\\Alexis\\Downloads\\${name}`;
    

//     fetch('http://localhost:3000/api/v1/drawings', {
//         method: "POST",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             name,
//             data,
//             user_id
//         })
//     })
//     .then( res => res.json())
//     .then( json => {
//         console.log(json);
//         // displayPose(img, body, br);
//         saveCanvas(name)
//         setTimeout( () => {
            // img.src = `/Users/flatironstudent/Downloads/${path}.png`;
            // img.width = 640;
            // body.append(br, img);
//         }, 3000);
        
//     });
// }

async function postImage() {
    const img = document.createElement('img');
    const br = document.createElement('br');
    const p = document.createElement('p');
    p.textContent = 'ayy lmao';
    const name = `posenet${++current}`;
    const data = `../../Downloads/${name}.png`;
    const arr = findAverageScore();
    
    await saveCanvas(name);
    
    await fetch('http://localhost:3000/api/v1/drawings', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            data,
            user_id,
            xaverage: arr[0],
            yaverage: arr[1]
        })
    });
    img.src = data;
    img.width = 480;
    document.body.append(br, img, p);
}

async function displayPose(img, body, br) {
    await savePose();
    img.src = `C:/Users/Alexis/Downloads${name}`;
    img.width = 640;
    body.append(br, img);
}

async function getDrawings() {
    const response = await fetch('http://localhost:3000/api/v1/drawings');
    const json = await response.json();
    return json;
}

async function savePose() {
    const res = await saveCanvas();
    console.log(res);d
}

// function renderDrawings() {
//     getDrawings().then(drawings => {
//         for (i of drawings) {
//             const img = document.createElement('img');
//             img.width = width
//             img.src = i.data;
//             const br = document.createElement('br');
//             document.body.append(br, img);
//         }
//     });
// }

async function renderDrawings() {
    const arr = await getDrawings();
    for (let i of arr) {
        const img = document.createElement('img');
        img.width = width
        img.src = i.data;
        console.log(img.src);
        const br = document.createElement('br');
        document.body.append(br, img);  
    }
}