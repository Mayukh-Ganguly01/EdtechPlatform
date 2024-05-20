import React from 'react'
import { Link } from 'react-router-dom'
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ExploreMore from '../components/core/HomePage/ExploreMore';

const Home = () => {
  return (
    <div>
        {/* section 1 */}
        <div className='relative mx-auto flex flex-col w-8/12 max-w-maxContent items-center text-white justify-between '>
            <Link to={"/signup"}>
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 '>
                    <div className='flex flex-row items-center gap-3 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor </p>
                        <FaPersonWalkingArrowRight />
                    </div>
                </div>
            </Link>
            <div className='text-center text-4xl font-semibold mt-7'>
                Empower your Future Grow with
                <HighlightText text={"Coding Skills"}/>
            </div>
            <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300 '>
                with our online coding courses, you can learn at your own pace, from anywhere you want also it will be a better platform than TheAcademy and WallahHiWallah. Feel free to buy all our courses and make better world with our vision new India 
            </div>

            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
            </div>

            <div className='mx-3 my-7 shadow-blue-200 '>
                <video autoPlay loop muted>
                <source src={Banner} type="video/mp4"/>
                </video>
            </div>

            {/* code section 1 */}
            <div>
                <CodeBlocks 
                    position={"lg:flex-row"}
                    heading={
                        <div className='text-4xl font-bold'>
                            Unlock Your <HighlightText text={"Inner Ninja "}/>
                            with our sensai 
                        </div>
                    }
                    subheading={
                        "our courses is very much cheaper and affordable rather than most other courses in the market"
                    }
                    ctabtn1={
                        {btnText: "Try it Yourself",
                        linkto: "/signup",
                        active: true}
                    }
                    ctabtn2={
                        {btnText: "learn more",
                        linkto: "/login",
                        active: false}
                    }

                    codeblock={
                        `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Document</title>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<div class="container">\n<h1>Password Generator</h1>\n<div class="display-container">\n<input readonly placeholder="password" class="display" data-passwordDisplay>\n<button class="copyBtn"  data-copy>\n<span class="tooltip" data-copyMsg></span>\n<img src="./assets/copy.svg" alt="copy" width="23" height="23">\nFor full code enroll the courses and learn from their\n`
                    }
                    codeColor={"text-yellow-25"}
                />
            </div>
            {/* code section 2 */}
            <div>
                <CodeBlocks 
                    position={"lg:flex-row-reverse"}
                    heading={
                        <div className='text-4xl font-bold'>
                            Make Epic <HighlightText text={"Projects "}/>
                            and <HighlightText text={"Flex "}/> with your friends 
                        </div>
                    }
                    subheading={
                        "With Great Power comes great Projects... and also bugs "
                    }
                    ctabtn1={
                        {btnText: "Try it Yourself",
                        linkto: "/signup",
                        active: true}
                    }
                    ctabtn2={
                        {btnText: "learn more",
                        linkto: "/login",
                        active: false}
                    }

                    codeblock={
                        `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Document</title>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<div class="container">\n<h1>Password Generator</h1>\n<div class="display-container">\n<input readonly placeholder="password" class="display" data-passwordDisplay>\n<button class="copyBtn"  data-copy>\n<span class="tooltip" data-copyMsg></span>\n<img src="./assets/copy.svg" alt="copy" width="23" height="23">\nFor full code enroll the courses and learn from their\n`
                    }
                    codeColor={"text-blue-25"}
                />
            </div>


            <ExploreMore/>

        </div>

        {/* section 2 */}
        <div className='bg-pure-greys-5 text-richblack-700 '>
            <div className='homepage_bg h-[310px]'>
                <div className='w-8/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto'>
                <div className='h-[150px]'> </div>
                    <div className='flex flex-row gap-7 text-white'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div>Explore Full Catalog</div>
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div>Learn More</div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className='mx-auto w-8/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                    <div className='text-4xl font-semibold w-[50%]'>
                        Get the skills you need for a <HighlightText text={"Job that is in demand"}/>
                    </div>
                    <div className='flex flex-col gap-10 w-[50%] items-start'>
                        <div className='text-lg'>this is just a random text to remind you that it is just a project not an actual website so its a joke not a dick dont take it seriously</div>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div>Learn more</div>
                        </CTAButton>
                    </div>
                </div> 

                <TimelineSection/>
                <LearningLanguageSection/>
            </div>

            
        </div>
        {/* section 3 */}
        <div className='w-8/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
               
                <InstructorSection/>
                <h2 className='text-center text-4xl font-semibold mt-10'>Review from other customers</h2>
                {/*Review Slider */}
        </div>
        {/* section 4 */}
    </div>
  )
}

export default Home