import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import cabData from "../utils/CabServicesData.js";
import { useEffect, useState } from "react";

function CabServicesCarousal() {
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setSlidesToShow(1);
      } else if (width <= 768) {
        setSlidesToShow(2);
      } else if (width <= 1424) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 lg:px-20 mx-auto mt-10">
      <h2 className="text-2xl lg:text-3xl font-bold text-center text-cyan-500 ml-4 ">
        Cab services in Vellore
      </h2>
      <Slider {...settings}>
        {cabData.map((data, index) => (
          <div key={index} className=" my-2 lg:my-4 px-2 lg:px-3 py-4 lg:py-8">
            <div
              onClick={() => window.open(data.webPage, "_blank")}
              className="card-carousal w-70 ml-12 lg:ml-0 lg:w-full h-full p-4 md:p-3 lg:p-6 flex flex-col justify-between items-center rounded-xl shadow-lg cursor-pointer transform transition hover:scale-[1.02] hover:shadow-2xl border-b-4 border-cyan-400"
            >
              <h1 className="text-xl lg:text-2xl font-bold text-yellow-400 mb-2">
                {data.name}
              </h1>

              <div className="text-center ">
                <p className="text-l lg:text-xl font-medium text-gray-400 m-1">
                  Contact : {data.Contact}
                </p>
                {/* <p className="text-sm md:text-lg font-bold text-cyan-600">
                  {data.reviews}
                </p> */}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CabServicesCarousal;
