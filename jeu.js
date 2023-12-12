init()
animate()


function new_image(src) {
    img = new Image()
    img.src = src
    return img
}


function getMousePos(c, event) {
    var rect = c.getBoundingClientRect()
    return {
        x: (1/zoom)*(event.clientX - rect.left),
        y: (1/zoom)*(event.clientY - rect.top)
    }
}


function reportWindowSize() {

    canvas.style.transformOrigin = 'top left'
    zoom = window.innerHeight / 1080
    canvas.style.transform="scale(" + zoom + "," + zoom + ")"

}


function init() {

    zoom = 1

    window.addEventListener('resize', reportWindowSize)

    reportWindowSize()

    document.addEventListener('contextmenu', event => event.preventDefault());

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    ctx.font = "32px Arial"

    xyMouse = {"x": -1, "y": -1}
    xyMouseClick = {"x": -1, "y": -1}

    canvas.addEventListener("mousemove", function(event) {
        xyMouse = getMousePos(canvas, event)
    }, false)

    canvas.addEventListener("mousedown", function(event) {
        event.preventDefault()
        if (event.which == 3) {
            droites = []
        } else {
            clicking = true
        }
        xyMouseClick = getMousePos(canvas, event)
    }, false)

    //droites = [ {"rho": 150, "theta": Math.PI/6} ]
    //droites = []
    droites = JSON.parse('[{"rho":74.33034373659252,"theta":4.9018691382658375},{"rho":90.47098982546837,"theta":4.9466441939789405},{"rho":18.601075237738275,"theta":3.7743414885919764},{"rho":64.81512169239521,"theta":5.6180826207100925},{"rho":50.695167422546305,"theta":5.899015942786987},{"rho":73.78346698278686,"theta":5.285355123273396},{"rho":72.34638899074369,"theta":5.41951600326086},{"rho":79.60527620704548,"theta":5.1816545078104514},{"rho":71.5122367151245,"theta":5.069522990905483},{"rho":85.72630868059116,"theta":5.008315018848898},{"rho":41.10960958218893,"theta":3.9958473062882858},{"rho":63.50590523722971,"theta":4.255783508492196},{"rho":49.92995093127971,"theta":4.141051500551063},{"rho":8.54400374531753,"theta":3.5003633238603653},{"rho":18,"theta":6.283185307179586}]')

    O = {"x": 960, "y": 540}

    placing = true
    clicking = false

    img_horizon = new_image("horizon.jpg")
}


function drawPoint(P, color = "#ffffff", nom = "") {

    ctx.beginPath()
    ctx.strokeStyle = "#000000"
    ctx.fillStyle = color
    ctx.arc(P.x, P.y, 5, 0, 2*Math.PI)
    ctx.stroke()
    ctx.fill()

    ctx.strokeText(nom, P.x-10, P.y-17)
    ctx.fillText(nom, P.x-10, P.y-17)

}


function drawLine(P, droite, color = "#ffffff") {

    let P1 = {"x": P.x + Math.cos(droite.theta+Math.PI*0.5)*1800, "y": P.y - Math.sin(droite.theta+Math.PI*0.5)*1800}
    let P2 = {"x": P.x - Math.cos(droite.theta+Math.PI*0.5)*1800, "y": P.y + Math.sin(droite.theta+Math.PI*0.5)*1800}

    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(P.x, P.y)
    ctx.lineTo(P1.x, P1.y)
    ctx.moveTo(P.x, P.y)
    ctx.lineTo(P2.x, P2.y)
    ctx.strokeStyle = color
    ctx.stroke()
    ctx.lineWidth = 1
}



function animate() {

    ///////////////////////////////////////////////////////////
    // AFFICHAGE
    ///////////////////////////////////////////////////////////

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(img_horizon, 0, 0, 1920, 1080)

    drawPoint(O, "#ff0000", "O")

    for (let i = 0; i < droites.length; i++) {

        let rho = droites[i].rho
        let theta = droites[i].theta

        let x_Q = O.x + rho*Math.cos(theta)
        let y_Q = O.y - rho*Math.sin(theta)
        let Q = {"x": x_Q, "y": y_Q}

        drawPoint(Q)

        drawLine(Q, droites[i])
    }

    if (placing) {

        let M = {"x": xyMouse.x, "y": xyMouse.y}

        drawPoint(M)

        let rho = Math.sqrt((xyMouse.x - O.x)**2 + (xyMouse.y - O.y)**2)
        let theta = Math.PI + Math.atan2(xyMouse.y - O.y, O.x - xyMouse.x)
        let theta_print = 2*Math.PI - theta
        let droite = {"rho": rho, "theta": theta}

        drawLine(M, droite)

        ctx.font = "30px Arial"
        ctx.strokeText("ρ = " + Math.round(rho*1000)/1000, 50, 50)
        ctx.fillText("ρ = " + Math.round(rho*1000)/1000, 50, 50)
        ctx.strokeText("θ = " + Math.round(theta*1000)/1000, 50, 100)
        ctx.fillText("θ = " + Math.round(theta*1000)/1000, 50, 100)

        if (clicking) {
            droites.push({"rho": rho, "theta": theta})
        }
    }

    clicking = false
    requestAnimationFrame(animate)

}


