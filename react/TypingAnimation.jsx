"use client";
import { useEffect, useRef } from "react";



export default function({messages=[]}){
    const animationEl = useRef(null);
    useEffect(()=>{
        const animation = animationEl.current;
        const typingspeed = 100;
        const typingSleepTime = 500;
        const erasingSpeed = 50;
        const erasingSleepTime = 1000;
        let breaking = false;

        // Array of messages to type

        let msgIndex = 0;



        function updateIndex(){
            msgIndex++;
            if (msgIndex >= messages.length) {
                msgIndex = 0;
            }
        }

        async function erase() {
            //remove emoji
            animation.innerHTML = animation.innerHTML.replace(messages[msgIndex].emoji, "")

            const length = animation.innerHTML.length + 1;
            for (let i = length; i >= 0; i--) {
                const text = animation.innerHTML;
                animation.innerHTML = text.substring(0, i);
                await new Promise((resolve) => setTimeout(resolve, erasingSpeed));
            }

            if (breaking) {
                animation.innerHTML = "";
                return;
            }
            
            updateIndex()

            await new Promise((resolve) => setTimeout(resolve, typingSleepTime));
            await type()
        }

    

        async function type() {
            const msg = messages[msgIndex].text;

            //go through msg string
            for (let i = 0; i < msg.length; i++) {
                const letter = msg[i];
                animation.innerHTML += letter;

                //Sleep until next letter
                await new Promise((resolve) => setTimeout(resolve, typingspeed));
            }

            animation.innerHTML += messages[msgIndex].emoji;

            //Sleep until erasing
            await new Promise((resolve) => setTimeout(resolve, erasingSleepTime));

            if (breaking) {
                animation.innerHTML = "";
                return;
            }

            await erase();
        }

        
        type()

        return ()=>{
            breaking = true;
        }
    }, [])

    return <span ref={animationEl} />
}