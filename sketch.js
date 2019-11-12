let video;
let poseNet;
let poses = [];
let button;
let current;
let path;

function setup() {
  getDrawings().then( res => {
      console.log(res);
      current = res[res.length - 1].id;
  });
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
}

function modelReady() {
    console.log('Model Loaded');
}

function draw() {
  background(51);
  image(video, 0, 0, 640, 480);
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
    let canvas = document.querySelector('canvas')
    let image = document.createElement('img')
    document.body.append(image)
    let url = canvas.toDataURL()
    image.src = url
    image.width = width
}

function keyPressed() {
    if (keyCode == 32) {
        capturePose();
    } else if (keyCode == ENTER) {
        // printCurrent();
        postImage();
    } else if (keyCode == 70) {
        let fs = fullscreen();
        fullscreen(!fs);
    } else {
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
            user_id: 5
        })
    })
    .then( res => res.json())
    .then( json => {
        console.log(json);
        path = `posenet${json.id}`
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

