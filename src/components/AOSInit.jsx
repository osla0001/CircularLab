import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      once: true, // Animationen afspilles kun én gang
    });
  }, []);

  return null;
}
