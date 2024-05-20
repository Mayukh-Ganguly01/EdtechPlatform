import React from 'react'
import HighlightText from './HighlightText'
import knowyourprogress from '../../../assets/Images/Know_your_progress.png'
import comparewithothers from '../../../assets/Images/Compare_with_others.png'
import planyourlessons from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from '../HomePage/Button'
const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-24'>
        <div className='flex flex-col gap-5 items-center'>
            <div className='text-4xl font-semibold text-center'>
                Your Swiss knife for 
                <HighlightText text={"Learning Any Language"}/>
            </div>

            <div className='text-center text-richblack-500 mx-auto text-base mt-3 font-medium w-[70%]'>
                another random piece of shit with random words which will eventually make a sence and dont make fun of my writing. Im 
                the developer of this website so ya i can ban you for accessing my website.
            </div>

            <div className='flex flex-row items-center justify-center mt-5 '> 
                <img src={knowyourprogress} alt='knowyourprogress' className='object-contain -mr-32'/>
                <img src={comparewithothers} alt='comparewithothers' className='object-contain'/>
                <img src={planyourlessons} alt='planyourlessons' className='object-contain -ml-36'/>
            </div>

            <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div>
                        Learn more
                    </div>
                </CTAButton>
            </div>
            
        </div>
    </div>
  )
}

export default LearningLanguageSection