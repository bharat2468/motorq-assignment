import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import Container from "./Container";
import { useSelector } from "react-redux";
import image from '/hero-bg.jpg';


const Hero = () => {
    
    return (
        <section
            className="w-screen h-screen bg-cover bg-center py-20 md:py-32 lg:py-40 relative"
            style={{ backgroundImage: `url(${image})` }}>
            <div className="top-0 left-0 w-full h-full absolute z-1 bg-gradient-to-b from-base-100 via-transparent to-base-200">
                <Container className="flex flex-col items-center">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                            <div className="space-y-4 mt-20">
                                <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                                Vehicle-Driver Mapping App
                                </h1>
                                <p className="max-w-[700px] text-lg text-primary-foreground md:text-xl">
                                Efficiently Connect Drivers with Vehicles – Streamline your fleet management with our all-in-one platform. Simplify assignments, optimize schedules, and ensure every vehicle is on the road when needed.
                                </p>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                    Explore Project
                                    <GoArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
};

export default Hero;




// import { Link } from "react-router-dom";
// import { GoArrowRight } from "react-icons/go";
// import Container from "./Container";
// import { useSelector } from "react-redux";

// const Hero = () => {
//     const theme = useSelector((state) => state.ui.theme);
//     const bgClass = theme === "light" ? "bg-light" : "bg-dark";

//     return (
//         <section className={`w-screen h-screen bg-cover bg-center py-20 md:py-32 lg:py-40 relative ${bgClass}`}>
//             <div className="top-0 left-0 w-full h-full absolute z-1 bg-gradient-to-b from-base-100 via-transparent to-base-200">
//                 <Container className="flex flex-col items-center">
//                     <div className="container px-4 md:px-6">
//                         <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
//                             <div className="space-y-4 mt-20">
//                                 <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
//                                     Bharat's Blog
//                                 </h1>
//                                 <p className="max-w-[700px] text-lg text-primary-foreground md:text-xl">
//                                     Explore a world of insights, stories, and
//                                     perspectives from Bharat's diverse
//                                     experiences.
//                                 </p>
//                                 <Link
//                                     to="/"
//                                     className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
//                                     Explore Blog
//                                     <GoArrowRight />
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </Container>
//             </div>
//         </section>
//     );
// };

// export default Hero;
