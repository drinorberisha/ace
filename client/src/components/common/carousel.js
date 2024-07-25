import { Carousel } from "flowbite-react";
export function MyCarousel() {
    return (
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="..."
            src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="..."
            src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="..."
            src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
          />
        </Carousel>
      </div>
    );
  }