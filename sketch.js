let video;
let poses = [];
let button;
let current;
let path;
let user_id;
let display = true;
let lastScores = [];
// let name = `posenet${current}`;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    const options = {flipHorizontal: true};
    const poseNet = ml5.poseNet(video, options, modelReady);
    //   const poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', results => {
        poses = results;
    });
    getDrawings().then( res => {
        current = res[res.length - 1].id;
        user_id = res[res.length - 1].user.id;
    });
}

function modelReady() {
    console.log('Model Loaded');
}

function draw() {
    if (display) {
        push();
        translate(width,0);
        scale(-1,1);
        image(video, 0,0, width, height);
        pop();
    } else {
        background(235, 130, 130);
    }
    drawPose();
  
}

function drawKeypoints()  {
    fill(52, 219, 235);
    noStroke();
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
        if (keypoint.score > 0.2) {
            
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

function drawPose() {
    fill(52, 219, 235);
    noStroke();
    stroke(52, 219, 235);
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        let skeleton = poses[i].skeleton;

        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.2) {
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}

function keyPressed() {
    console.log(keyCode);
    // if (keyCode == 32) {
    //     saveCanvas(`posenet${current}`);
    //     current++;
    // }
    
    switch(keyCode) {
        case 32: // space bar to save image
            saveCanvas(`posenet${current}`)
            current++;
            break;
        case 86: // v to hide video
            display = !display;
            break;
        case 87: // w to post image
            postImage();
            break;
        case 66: // b for testing savePose()
            savePose();
            break;
        default:
            return;
    }
}

// function keyPressed() {
//     switch(keyCode) {
//         // space
//         case 32:
//             // save canvas encoded in base64 and send to db
//             capturePose();
//             break;
//         case ENTER:
//             // deprecated. don't use
//             postImage();
//             break;
//         // f to pay respects
//         case 70:
//             // double tap to make window fullscreen
//             let fs = fullscreen();
//             fullscreen(!fs);
//             break;
//         // v
//         case 86:
//             // hide the video 
//             display = !display;
//             break;
//         // y
//         case 89:
//             // get the rough approximation of someone's pose
//             findAverageScore();
//             break;
//         // m
//         case 77:
//             // get all drawings from db and render them
//             renderDrawings();
//             break;
//         default:
//             // for debugging
//             console.log(keyCode);
//     }
// }

function printCurrent() {
    console.log(current);
}

function findAverageScore() {
    let keypoints = poses[0].pose.keypoints;
    // console.log(keypoints);
    let xTotal = 0;
    let yTotal = 0;
    let len = 0;
    let arr = []

    for (i of keypoints) {
        if (i.score > 0.3) {
            xTotal += i.position.x;
            yTotal += i.position.y;
            len++
        } 
    }
    
    arr.push(xTotal/len);
    arr.push(yTotal/len);
    // console.log(xTotal / len);
    // console.log(yTotal / len);
    // console.log(arr);
    return arr;
}
