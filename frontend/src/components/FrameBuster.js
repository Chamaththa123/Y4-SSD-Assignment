import { useEffect } from "react";

const FrameBuster = () => {

    useEffect(() => {
        // This script ensures the site cannot be embedded in an iframe
        if(window.top !== window.self) {
            window.top.location = window.location;
        }
    }, []);

    return null;

};

export default FrameBuster;