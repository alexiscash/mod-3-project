let video;
let poses = [];
let button;
let current;
let path;
let userId;
let display = true;
let lastScores = [];

function setup() {
  createCanvas(640, 480);
  getDrawings().then( res => {
    //   console.log(res);
      current = res[res.length - 1].id;
      userId = res[res.length - 1].user.id;
  });
  video = createCapture(VIDEO);
  video.hide();
  const options = {flipHorizontal: true};
  const poseNet = ml5.poseNet(video, options, modelReady);
//   const poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', results => {
    // console.log(results);
    poses = results;
  });
}

function modelReady() {
    console.log('Model Loaded');
}

function draw() {
  background(51);
  if (display) {
    push();
    translate(width,0);
    scale(-1,1);
    image(video, 0,0, width, height);
    pop();
  }
  drawKeypoints();
  drawSkeleton();
  
}

function drawKeypoints()  {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2) {
        fill(52, 219, 235);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(52, 219, 235);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

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

function keyPressed() {
    switch(keyCode) {
        // space
        case 32:
            // save canvas encoded in base64 and send to db
            capturePose();
            break;
        case ENTER:
            // deprecated. don't use
            postImage();
            break;
        // f to pay respects
        case 70:
            // double tap to make window fullscreen
            let fs = fullscreen();
            fullscreen(!fs);
            break;
        // v
        case 68:
            // hide the video 
            display = !display;
            break;
        // y
        case 89:
            // get the rough approximation of someone's pose
            findAverageScore();
            break;
        // m
        case 77:
            // get all drawings from db and render them
            renderDrawings();
            break;
        default:
            // for debugging
            console.log(keyCode);
    }
}

function printCurrent() {
    console.log(current);
}

function postImage() {
    const body = document.body;
    const br = document.createElement('br');
    const img = document.createElement('img');
    let path = `posenet${++current}`;

    fetch('http://localhost:3000/api/v1/drawings', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: `${path}`,
            data: `/Users/flatironstudent/Downloads/${path}.png`,
            user_id: userId
        })
    })
    .then( res => res.json())
    .then( json => {
        console.log(json);
        path = `posenet${current}`
        // displayPose(img, body, br);
        saveCanvas(path)
        setTimeout( () => {
            img.src = `/Users/flatironstudent/Downloads/${path}.png`;
            img.width = 640;
            body.append(br, img);
        }, 3000);
        
    });
}

async function getDrawings() {
    const response = await fetch('http://localhost:3000/api/v1/drawings');
    const json = await response.json();
    return json;
}

async function savePose() {
    saveCanvas(path);
    return;
}

async function displayPose(img, body, br) {
    await savePose();
    img.src = `/Users/flatironstudent/Downloads/${path}.png`;
    img.width = 640;
    body.append(br, img);
}

function findAverageScore() {
    let keypoints = poses[0].pose.keypoints;
    // console.log(keypoints);
    let xTotal = 0;
    let yTotal = 0;
    let len = 0;
    for (i of keypoints) {
        if (i.score > 0.3) {
            xTotal += i.position.x;
            yTotal += i.position.y;
            len++
        } 
    }
    let arr = []
    arr.push(xTotal/len);
    arr.push(yTotal/len);
    // console.log(xTotal / len);
    // console.log(yTotal / len);
    // console.log(arr);
    return arr;
}

function renderDrawings() {
    getDrawings().then(drawings => {
        for (i of drawings) {
            const img = document.createElement('img');
            img.width = width
            img.src = i.data;
            const br = document.createElement('br');
            document.body.append(br, img);
        }
    });
}