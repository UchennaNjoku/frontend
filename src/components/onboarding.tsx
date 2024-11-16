'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, School, BookOpen, Sparkles, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import Link from 'next/link'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { useEffect } from 'react'
import { useDashboardStore } from '@/store/dashboardStore'

interface MajorRecommendationResponse {
    recommended_majors: string[];
    school_name: string;
    
}  

export default function Onboarding() {
  const {
    step,
    school,
    knowsMajor,
    selectedMajor,
    interests,
    suggestedMajors,
    availableMajors,
    isLoading,
    error,
    setStep,
    setSchool,
    setKnowsMajor,
    setSelectedMajor,
    toggleInterest,
    fetchSuggestedMajors,
  } = useOnboardingStore()

  const interestOptions = [
    "Artificial Intelligence", "Cybersecurity", "Robotics", "Data Science", "Web Development",
    "Blockchain Technology", "Environmental Science", "Renewable Energy", "Biotechnology", "Genetic Engineering",
    "Psychology", "Sociology", "Political Science", "International Relations", "Philosophy",
    "History", "Music Production", "Graphic Design", "Film Production", "Medicine",
    "Nursing", "Public Health", "Sports Science", "Entrepreneurship", "Marketing Analytics",
    "Financial Technology (FinTech)", "Mechanical Engineering", "Aerospace Engineering", "Game Development", "Culinary Arts"
  ];
  
  // Check for existing onboarding data on mount
  useEffect(() => {
    if (school || interests.length > 0 || knowsMajor !== null) {
      console.log('Existing onboarding data found')
    }
  }, [school, interests, knowsMajor])

  const isNextDisabled = () => {
    if (step === 1 && !school) return true
    if (step === 2 && knowsMajor === null) return true
    if (step === 3 && knowsMajor && !selectedMajor) return true
    if (step === 3 && !knowsMajor && interests.length === 0) return true
    if (step === 4 && !selectedMajor) return true
    return false
  }

  const handleNextStep = async () => {
    if (isNextDisabled()) return

    if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      if (knowsMajor) {
        setStep(4)
      } else {
        try {
          await fetchSuggestedMajors()
          setStep(4)
        } catch (error) {
          console.error("Error fetching suggested majors"+error)
        }
      }
    } else if (step === 4 && selectedMajor) {
      setStep(5)
    } else {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => setStep(step - 1)

  const handleMajorSelection = (major: string) => {
    setSelectedMajor(major)
    useDashboardStore.getState().setSelectedMajor(major)
  }

  const steps = [
    // Welcome Screen
    // Step 1
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6F6gxaIu3r7QwYCQTgl2vw4K97T1C7.svg"
        alt="Career Compass Logo"
        width={200}
        height={60}
        className="mx-auto mb-8"
      />
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#313BA8] to-blue-600">
        Find Your Path
      </h1>
      <p className="text-xl mb-8 text-gray-600">
        Let&apos;s discover the perfect major for your future
      </p>
      <Button onClick={handleNextStep} size="lg" className="rounded-full bg-gradient-to-r from-[#313BA8] to-blue-600">
        Begin Your Journey
      </Button>
    </motion.div>,

    // School Selection
 // Step 2
    <motion.div
      key="school"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <School className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
      <h2 className="text-2xl font-semibold text-center">Which school do you attend?</h2>
      <div className="max-w-sm mx-auto">
        <Label htmlFor="school" className="text-gray-600">School Name</Label>
        <Input
          id="school"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Enter your school name"
          className="mt-1 rounded-full"
        />
      </div>
    </motion.div>,

    // Major Knowledge Check
    // Step 3
    <motion.div
      key="major-check"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
      <h2 className="text-2xl font-semibold text-center">Do you know your major?</h2>
      <RadioGroup 
        value={knowsMajor === true ? 'yes' : knowsMajor === false ? 'no' : ''} 
        onValueChange={(value) => setKnowsMajor(value === 'yes')}
        className="max-w-sm mx-auto space-y-4"
      >
        <div className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-100 hover:border-[#313BA8] transition-colors">
          <RadioGroupItem value="yes" id="yes" />
          <Label htmlFor="yes" className="flex-grow cursor-pointer">Yes, I know my major</Label>
        </div>
        <div className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-100 hover:border-[#313BA8] transition-colors">
          <RadioGroupItem value="no" id="no" />
          <Label htmlFor="no" className="flex-grow cursor-pointer">No, I&apos;d like to explore options</Label>
        </div>
      </RadioGroup>
    </motion.div>,

    // Step 4: Combined Major Selection/Interest Selection
    <motion.div
      key="major-selection"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {knowsMajor ? (
        // Known Major Selection UI
        <>
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
          <h2 className="text-2xl font-semibold text-center">Select Your Major</h2>
          <div className="max-w-sm mx-auto">
            <Select
              value={selectedMajor || ''}
              onValueChange={(major) => {
                handleMajorSelection(major)
              }}
            >
              <SelectTrigger className="w-full rounded-full">
                <SelectValue placeholder="Choose your major" />
              </SelectTrigger>
              <SelectContent>
                {availableMajors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      ) : (
        // Interest Selection UI for unknown major
        <>
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
          <h2 className="text-2xl font-semibold text-center">What interests you?</h2>
          <p className="text-center text-gray-600">Select all that spark your curiosity</p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {interestOptions.map((interest) => (
              <motion.div
                key={interest}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-100 hover:border-[#313BA8] transition-colors"
              >
                <Checkbox
                  id={interest}
                  checked={interests.includes(interest)}
                  onCheckedChange={() => toggleInterest(interest)}
                />
                <Label htmlFor={interest} className="flex-grow cursor-pointer">{interest}</Label>
              </motion.div>
            ))}
          </div>
          {!knowsMajor && suggestedMajors.length > 0 && (
            <div className="space-y-4 my-8">
              {suggestedMajors.map((major, index) => (
                <motion.button
                  key={major}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  onClick={() => {
                    handleMajorSelection(major)
                  }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-[#313BA8]/5 to-blue-600/5 
                    hover:from-[#313BA8]/10 hover:to-blue-600/10 transition-all duration-200 
                    transform hover:scale-105"
                >
                  <h3 className="text-xl font-medium text-[#313BA8]">{major}</h3>
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>,

    // Results Display
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 text-center"
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6F6gxaIu3r7QwYCQTgl2vw4K97T1C7.svg"
        alt="Career Compass Logo"
        width={150}
        height={45}
        className="mx-auto mb-6"
      />
      
      {!selectedMajor ? (
        // Initial results display with clickable options
        <>
          <h2 className="text-2xl font-semibold">
            {knowsMajor 
              ? "Great choice! Let&apos;s explore your major:"
              : "Here are your recommended majors:"}
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#313BA8]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">
              {error}
              <Button onClick={() => handleNextStep()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {!knowsMajor && suggestedMajors.length > 0 && (
                <div className="space-y-4 my-8">
                  {suggestedMajors.map((major, index) => (
                    <motion.button
                      key={major}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      onClick={() => {
                        handleMajorSelection(major)
                      }}
                      className="w-full p-4 rounded-xl bg-gradient-to-r from-[#313BA8]/5 to-blue-600/5 
                        hover:from-[#313BA8]/10 hover:to-blue-600/10 transition-all duration-200 
                        transform hover:scale-105"
                    >
                      <h3 className="text-xl font-medium text-[#313BA8]">{major}</h3>
                    </motion.button>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        // Final confirmation screen after major selection
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
          <h2 className="text-3xl font-bold text-[#313BA8]">You're All Set!</h2>
          <div className="bg-gradient-to-r from-[#313BA8]/10 to-blue-600/10 p-6 rounded-xl my-6">
            <p className="text-xl font-semibold">Your Selected Major:</p>
            <p className="text-2xl text-[#313BA8] font-bold mt-2">{selectedMajor}</p>
          </div>
          <p className="text-lg text-gray-600">
            Get ready to explore your academic journey! We&apos;ll help you navigate your path
            in {selectedMajor} with personalized resources and guidance.
          </p>
          <Button 
            className="mt-6 rounded-full bg-gradient-to-r from-[#313BA8] to-blue-600"
            onClick={() => {
              window.location.href = '/dashboard'
            }}
          >
            Start Your Journey
          </Button>
        </motion.div>
      )}
    </motion.div>
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Your existing nav component remains the same */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6F6gxaIu3r7QwYCQTgl2vw4K97T1C7.svg"
                  alt="Career Compass Logo"
                  width={120}
                  height={40}
                />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="#" className="border-[#313BA8] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  About
                </Link>
                <Link href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button variant="outline" className="rounded-full">
                Sign In
              </Button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#313BA8]">
                    <span className="sr-only">Open main menu</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="#">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#">Contact</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#">Sign In</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full relative overflow-hidden">
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {steps[step]}
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-8 relative z-10">
            {step > 0 && (
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="rounded-full"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            {step < steps.length - 1 && (
              <Button
                onClick={handleNextStep}
                disabled={isLoading || isNextDisabled()}
                className="ml-auto rounded-full bg-gradient-to-r from-[#313BA8] to-blue-600"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 to-transparent rounded-b-2xl"></div>
        </div>
      </div>
    </div>
  )
}