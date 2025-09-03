import slide1 from "../assets/gallery/slide1.webp";
import slide2 from "../assets/gallery/slide2.webp";
import slide3 from "../assets/gallery/slide3.webp";
import slide4 from "../assets/gallery/slide4.webp";
import slide5 from "../assets/gallery/slide5.webp";
import slide6 from "../assets/gallery/slide6.webp";
import slide7 from "../assets/gallery/slide7.webp";
import slide8 from "../assets/gallery/slide8.webp";
import slide9 from "../assets/gallery/slide9.webp";
import slide10 from "../assets/gallery/slide10.webp";
import slide11 from "../assets/gallery/slide11.webp";
import slide12 from "../assets/gallery/slide12.webp";
import slide13 from "../assets/gallery/slide13.webp";
import slide14 from "../assets/gallery/slide14.webp";
import slide15 from "../assets/gallery/slide15.webp";
import slide16 from "../assets/gallery/slide16.webp";

export async function getGalleryImages() {
  const images = [
    slide1, slide2, slide3, slide4, slide5, slide6,
    slide7, slide8, slide9, slide10, slide11, slide12,
    slide13, slide14, slide15, slide16
  ];

  // Shuffle images in random order
  images.sort(() => Math.random() - 0.5);
  return images;
}