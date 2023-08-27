export default {
    actions: {
        up: (object, move) =>{
            return object.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -" + move + ", 0, 1)";
        },
        down: (object, move) => {
            object.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + move + ", 0, 1)";
        },
        left: (object, move) => {
            object.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -" + move + ", 0, 0, 1)";
        },
        right: (object, move) => {
            object.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0," + move + ", 0, 0, 1)";
        }
    },

    addAction(name, action){
        if (typeof action === "function") this.actions[name] = action;
        else console.error("[NParallax] At addAction(): Expected a function, got " + typeof action);
    },

    init: function (custom={}) {
        const parallaxElements = document.querySelectorAll("[data-np-action]");

        const defaults = {
            action: "up",
            speed: 0.2,
            offset: 400,
            transition: "all 0s",
            ...custom
        }
      
        parallaxElements.forEach((object) => {
            this.bindObject({
                object: object,
                action: object.getAttribute("data-np-action") || defaults.action,
                speed: object.getAttribute("data-np-speed") || defaults.speed,
                offset: object.getAttribute("data-np-offset") || defaults.offset,
                transition: object.getAttribute("data-np-transition") || defaults.transition
            })
        })

    },


    renderBinding: function (object, action, speed) {
        const scroll = window.scrollY + window.innerHeight;

        //if the object is 100px above the screen, don't render
        if (object.getBoundingClientRect().bottom < -100) return;

        const origin = object.getAttribute("np-origin");

        //get distance from origin
        let distance = scroll - origin;
        if (distance < 0) distance = 0;
        let move = distance * speed;

        //change the move to 0 if the window size is mobile
        if (window.innerWidth < 800) move = 0;

        //calculate
        //use matrix3d to prevent lag

        if (this.actions[action]) this.actions[action](object, move);
        else console.error("[NParallax] Invalid data-np-action: " + action)
    },


    bindObject: function (bindingData) {
        const { object, action, speed, offset, transition } = bindingData;

        object.setAttribute("np-origin", window.scrollY + object.getBoundingClientRect().top - offset);
        object.style.transition = transition;

        function render(){
            NPARALLAX.renderBinding(object, action, speed);
        }

        const bind = window.addEventListener("scroll", () => {
            render();
        })

        render();
        return bind;
    }
}
