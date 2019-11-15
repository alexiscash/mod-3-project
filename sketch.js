let video;
let poses = [];
let button;
let current;
let path;
let userId;
let display = true;

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
//   if (display) {
//     background(51);
//     push();
//     translate(width,0);
//     scale(-1, 1);
//     image(video, 0, 0, width, height);
//     pop();
//   //   image(video, 0, 0, 640, 480);
//     drawKeypoints();
//     drawSkeleton();
//   } else {
//       background(51);
//   }

  background(235, 130, 130);
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
      if (keypoint.score > 0.3) {
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
    const canvas = document.querySelector('canvas');
    const image = document.createElement('img');
    const br = document.createElement('br');
    document.body.append(br, image);
    const data = canvas.toDataURL();
    // console.log(url);
    image.src = data;
    image.width = width;
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
    } else if (keyCode == 86) {
        display = !display;
    } else if (keyCode == 89) {
        findAverageScore();
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
    for (i of keypoints) {
        console.log(i.position.x);
        console.log(i.position.y);
    }
}

