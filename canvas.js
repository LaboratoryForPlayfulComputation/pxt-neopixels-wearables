        /* start of p5js stuff */
        var rectsize = 12;
        var drawingLeds = false;
        var drawingWires = false;
        var connectingleds = false;
        var firstled = null;
        var selectedLED = null;
        var prevSelectedLED = null;
        var LEDs = [];
        var wires = [];

        /* one time setup funtion */
        function setup() {
            createCanvas(640, 480);
            stroke(0);
        }

        /* draw loop */
        function draw() {
            background(255);
            for (var i = 0; i < LEDs.length; i++)
                LEDs[i].draw();
            for (var i = 0; i < wires.length; i++)
                wires[i].draw();
        }

        /* button event for clicking draw LEDs button */
        function drawLEDs() { 
            drawingLeds = true;
            drawingWires = false;
            document.getElementById("ledbutton").style.border = "thick solid #FFFF00";
            document.getElementById("wirebutton").style.border = "";
        }

        /* button event for clicking draw wires button */
        function drawWires() { 
            drawingWires = true;
            drawingLeds = false;
            document.getElementById("ledbutton").style.border = "";
            document.getElementById("wirebutton").style.border = "solid #FFFF00";
        }

        /* */
        function Wire(led1, led2) {
            this.led1 = led1;
            this.led2 = led2;
            this.led1.nextLED = led2;
            this.led2.prevLED = led1;

            this.draw = function() {
                line(this.led1.x, this.led1.y, this.led2.x, this.led2.y);
            }
        }

        /* */
        function LED(x, y) {
            this.x = x;
            this.y = y;
            this.leftEdge = this.x - (rectsize/2);
            this.rightEdge = this.x + (rectsize/2);
            this.topEdge = this.y - (rectsize/2);
            this.bottomEdge = this.y + (rectsize/2);
            this.prevLED = null;
            this.nextLED = null;
            this.selected = false;
            this.color = color(255, 255, 0);
            this.group = 0;

            this.draw = function() {
                if (this.isSelected()) {
                    stroke(255, 150, 0);
                    fill(255, 150, 0);
                    rect(this.leftEdge-2, this.topEdge-2, rectsize+4, rectsize+4);
                    stroke(0);
                    fill(this.color); // main inside LED color
                    rect(this.leftEdge, this.topEdge, rectsize, rectsize);
                }
                else {
                    rect(this.leftEdge, this.topEdge, rectsize, rectsize);
                }
            }

            this.clicked = function() {
                if ((mouseX >= this.leftEdge) && (mouseX <= this.rightEdge) && (mouseY >= this.topEdge) && (mouseY <= this.bottomEdge)){
                    this.selected = true;
                    return true;
                }
                this.selected = false;
                return false;
            }

            this.isSelected = function() {
                return this.selected;
            }

            this.setNextLED = function(led) {
                this.nextLED = led;
            }

            this.setPrevLED = function(led) {
                this.prevLED = led;
            }
        }

        function mouseClicked() {
            if (drawingLeds){
                fill(255, 255, 0);
                var led = new LED(mouseX, mouseY);
                LEDs.push(led);
            } else if (drawingWires) {
                var noselectedLEDs = true;
                for (var i = 0; i < LEDs.length; i++){
                    if (LEDs[i].clicked()){
                        if (selectedLED){
                            prevSelectedLED = selectedLED;
                            selectedLED = LEDs[i];
                            if (prevSelectedLED != selectedLED){
                                checkExistingWiring(prevSelectedLED, selectedLED);
                            }
                        }
                        selectedLED = LEDs[i];
                        noselectedLEDs = false;
                    }
                }
                if (noselectedLEDs == true){
                    selectedLED = null;
                    prevSelectedLED = null;
                }
            }  
        }    

        /* Checks the wiring configuration (if any) between 2 LEDs */
        function checkExistingWiring(ledClicked1, ledClicked2){
            // if switching next led of an led
            if (ledClicked1.nextLED && ledClicked1.nextLED != ledClicked2){
                for (var i = 0; i < wires.length; i++){
                    if (wires[i].led1 == ledClicked1){
                        wires.splice(i, 1);
                    }
                }         
            }
            // if both leds have been previously wired the opposite way
            else if (ledClicked1.prevLED == ledClicked2 && ledClicked2.nextLED == ledClicked1){
                for (var i = 0; i < wires.length; i++){
                    if (wires[i].led2 == ledClicked1 && wires[i].led1 == ledClicked2){
                        ledClicked1.prevLED = null;
                        ledClicked2.nextLED = null;
                        wires.splice(i, 1);

                    }
                } 
            }
            // if both leds are wired the same way
            else if (ledClicked2.prevLED == ledClicked1 && ledClicked1.nextLED == ledClicked2){
                for (var i = 0; i < wires.length; i++){
                    if (wires[i].led1 == firstled && wires[i].led2 == led){
                        wires.splice(i, 1);
                    }
                }
            }
            var wire = new Wire(prevSelectedLED, selectedLED);
            wires.push(wire);
        }

        /* button event for clicking clear */
        function clear() {
            if (confirm("Are you sure you want to start over?")) {
                LEDs = [];
                wires = [];
            }
        }

        /* end of p5js stuff */