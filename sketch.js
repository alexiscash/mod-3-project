let video;
let poseNet;
let poses = [];
let button;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
//   video.size(width, height);
//   button = createButton('capture');
//   button.position(0, 500);
//   button.mousePressed(capturePose);
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

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(52, 219, 235);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
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
        postImage();
    } else if (keyCode == 70) {
        let fs = fullscreen();
        fullscreen(!fs);
    } else {
        console.log(keyCode);
    }
}

function postImage() {
    const body = document.body;
    const br = document.createElement('br');
    const img = document.createElement('img');
    let path;

    fetch('http://localhost:3000/api/v1/drawings', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: 'ayyy lmao',
            data: 'ayy lmao',
            user_id: 4
        })
    })
    .then( res => res.json())
    .then( json => {
        console.log(json);
        path = `posenet${json.id}`
        saveCanvas(path)
        img.src = `/Users/flatironstudent/Downloads/${path}.png`;
        img.width = 640;
        body.append(br, img);
    });
}

