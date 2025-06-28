"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { ArrowDown, Chrome, Clock, Target, TrendingDown, DollarSign, Bot, Zap, CheckCircle, MousePointer, Play, Check, Gift, Crown, Menu, X, Twitter, Linkedin, Mail } from 'lucide-react';

// TypewriterEffect component (migrated inline)
interface TypewriterEffectProps {
  words: string[];
  className?: string;
  speed?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ 
  words, 
  className = "", 
  speed = 100 
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentWord = words[currentWordIndex];

      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, speed]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Button component (simplified version)
const Button = ({ 
  children, 
  className = "", 
  size = "default",
  variant = "default",
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "lg";
  variant?: "default" | "outline";
  onClick?: () => void;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const sizeClasses = size === "lg" ? "h-11 px-8" : "h-10 px-4 py-2";
  const variantClasses = variant === "outline" ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90";
  
  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};



// Accordion components (simplified)
const Accordion = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

const AccordionItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.isValidElement(child) ? React.cloneElement(child, { isOpen, setIsOpen } as React.Attributes) : child
      )}
    </div>
  );
};

const AccordionTrigger = ({ children, className = "", isOpen, setIsOpen }: { children: React.ReactNode; className?: string; isOpen?: boolean; setIsOpen?: (open: boolean) => void }) => {
  return (
    <button 
      className={`flex flex-1 items-center justify-between text-left font-medium transition-all hover:underline ${className}`}
      onClick={() => setIsOpen?.(!isOpen)}
    >
      {children}
      <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
    </button>
  );
};

const AccordionContent = ({ children, className = "", isOpen }: { children: React.ReactNode; className?: string; isOpen?: boolean }) => {
  return (
    <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className={className}>{children}</div>
    </div>
  );
};

// Main ExtensionPage component
export default function ExtensionPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const typewriterWords = [
    "Grant Applications",
    "Investor Outreach", 
    "Mentor Connections",
    "Costly Consultants & Interns"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - migrated from Navigation.tsx */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-black">
                Grants Snap
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-black transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-black transition-colors font-medium">
                How it Works
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-black transition-colors font-medium">
                Pricing
              </a>
              <a href="#faq" className="text-gray-700 hover:text-black transition-colors font-medium">
                FAQ
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex">
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 font-semibold">
                <Chrome className="mr-2 h-4 w-4" />
                Add to Chrome
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-black transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a 
                  href="#features" 
                  className="block px-3 py-2 text-gray-700 hover:text-black transition-colors font-medium"
                  onClick={toggleMenu}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="block px-3 py-2 text-gray-700 hover:text-black transition-colors font-medium"
                  onClick={toggleMenu}
                >
                  How it Works
                </a>
                <a 
                  href="#pricing" 
                  className="block px-3 py-2 text-gray-700 hover:text-black transition-colors font-medium"
                  onClick={toggleMenu}
                >
                  Pricing
                </a>
                <a 
                  href="#faq" 
                  className="block px-3 py-2 text-gray-700 hover:text-black transition-colors font-medium"
                  onClick={toggleMenu}
                >
                  FAQ
                </a>
                <div className="px-3 py-2">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white font-semibold">
                    <Chrome className="mr-2 h-4 w-4" />
                    Add to Chrome
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="pt-16">
        {/* Hero Section - migrated from Hero.tsx */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">

          {/* Free Trial Badge */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-black text-white rounded-full px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">FREE TRIAL</span>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 text-sm font-medium mb-4 shadow-sm">
                🚀 Chrome Extension for Entrepreneurs
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Grants Snap
            </h1>
            
            <div className="text-xl sm:text-2xl md:text-2xl text-gray-700 mb-4 font-light min-h-[2em] flex items-center justify-center">
              <span>Skip Hiring </span>
              <TypewriterEffect 
                words={typewriterWords}
                className="text-red-500 ml-2 font-semibold"
                speed={150}
              />
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The AI-powered browser extension that replaces expensive consultants and interns. 
              Automate grant applications, investor outreach, and mentor connections while saving thousands on hiring costs.
            </p>

            {/* Cost Savings Highlight */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto shadow-sm">
              <p className="text-gray-800 font-semibold text-base sm:text-lg">
                💡 Skip $2,000-$3,000/month consultant fees and $500-$600/month intern costs
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                <Chrome className="mr-2 h-5 w-5" />
                Add to Chrome - Free
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-black px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl w-full sm:w-auto transition-all duration-200"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-black">$10K+</div>
                <div className="text-xs sm:text-sm">Monthly Savings</div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-black">100+</div>
                <div className="text-xs sm:text-sm">Applications Automated</div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-black">AI-Powered</div>
                <div className="text-xs sm:text-sm">Smart Optimization</div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <ArrowDown className="h-6 w-6 text-gray-400 animate-bounce" />
          </div>
        </div>

        {/* Features Section - Problem Section */}
        <div id="features">
          <section className="py-16 lg:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 lg:mb-6">
                  The Funding Challenge is <span className="text-red-500">Real</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  Entrepreneurs are drowning in paperwork while competitors are building. 
                  The traditional funding process is broken.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {[
                  {
                    icon: Clock,
                    title: "Time Sink",
                    description: "Founders spend 10+ hours/week on funding applications and investor outreach, diverting focus from building their startups.",
                    color: "text-gray-700"
                  },
                  {
                    icon: Target,
                    title: "Inefficient Process",
                    description: "No centralized tracking for applications, follow-ups, or progress, leading to missed opportunities.",
                    color: "text-gray-700"
                  },
                  {
                    icon: TrendingDown,
                    title: "High Rejections",
                    description: "Even top startups like Airbnb faced 100+ rejections due to unoptimized applications.",
                    color: "text-gray-700"
                  },
                  {
                    icon: DollarSign,
                    title: "Costly Manual Work",
                    description: "Hiring consultants or interns creates negative cash flow and management challenges.",
                    color: "text-red-500"
                  }
                ].map((problem, index) => (
                  <div 
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gray-100 ${problem.color} flex-shrink-0`}>
                        <problem.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">{problem.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{problem.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12 lg:mt-16">
                <div className="inline-block bg-white border-2 border-gray-200 rounded-2xl px-6 lg:px-8 py-4 lg:py-6">
                  <p className="text-gray-700 text-base sm:text-lg font-semibold">
                    💡 What if there was a better way?
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Solution Section */}
          <section className="py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 lg:mb-16">
                <span className="inline-block px-4 py-2 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-4">
                  ✨ The Solution
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 lg:mb-6">
                  Why Hire When <span className="text-gray-600">AI Works Better?</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  Stop burning cash on expensive consultants and interns. Grants Snap automates everything they do, 
                  but faster, cheaper, and available 24/7.
                </p>
              </div>

              {/* Cost Comparison Banner */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-500 mb-1">$2K-3K/month</div>
                    <div className="text-gray-600 text-sm">Consultant Cost</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500 mb-1">$500-600/month</div>
                    <div className="text-gray-600 text-sm">Intern Cost</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 mb-1">$39-59/month</div>
                    <div className="text-gray-600 text-sm">Grants Snap</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
                {[
                  {
                    icon: DollarSign,
                    title: "Skip Expensive Hiring",
                    description: "Replace costly consultants ($2K-3K/month) and interns ($500-600/month) with AI automation that works 24/7.",
                    benefits: ["Save $30K+ annually on hiring", "No training or management overhead", "Instant availability and scaling"]
                  },
                  {
                    icon: Bot,
                    title: "AI Copilot",
                    description: "Analyzes applications, suggests strategic improvements, and ensures alignment with funder priorities - better than any consultant.",
                    benefits: ["Smart application optimization", "Funder priority matching", "Strategic improvement suggestions"]
                  },
                  {
                    icon: Chrome,
                    title: "Browser Extension",
                    description: "Scans forms, VCs, and investor data to auto-fill applications, eliminating the need for research interns.",
                    benefits: ["One-click form filling", "VC database integration", "Automated data entry"]
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-block p-4 rounded-2xl bg-gray-100 border border-gray-200 mb-4">
                        <feature.icon className="h-8 w-8 lg:h-10 lg:w-10 text-gray-700" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4">
                    Ready to Fire Your Expensive Team?
                  </h3>
                  <p className="text-gray-600 mb-6 text-base sm:text-lg">
                    Join thousands of entrepreneurs who&apos;ve already saved hundreds of thousands with Grants Snap.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                  >
                    <Chrome className="mr-2 h-5 w-5" />
                    Replace Your Team Now
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Demo Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 lg:mb-6">
                See Grants Snap in <span className="text-gray-600">Action</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Watch how our AI-powered extension transforms the tedious grant application process into a seamless experience.
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Demo GIF Placeholder */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50"></div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                    <div className="bg-black/80 backdrop-blur-sm border border-black/20 rounded-full p-6 group-hover:scale-110 transition-transform">
                      <Play className="h-12 w-12 text-white ml-1" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-white text-sm font-medium">🎬 Demo: Auto-filling a grant application in 30 seconds</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Chrome className="mr-2 h-5 w-5" />
                  Try It Free Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <div id="how-it-works">
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  How <span className="text-gray-600">Grants Snap</span> Works
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Four simple steps to revolutionize your funding process. 
                  From manual chaos to automated success.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: MousePointer,
                    number: "01",
                    title: "Install & Browse",
                    description: "Add Grants Snap to Chrome and browse funding opportunities as usual. Our extension runs silently in the background.",
                    color: "bg-gray-100"
                  },
                  {
                    icon: Bot,
                    number: "02", 
                    title: "AI Analysis",
                    description: "Our AI copilot analyzes the grant or investor requirements and your startup profile for perfect alignment.",
                    color: "bg-gray-100"
                  },
                  {
                    icon: Zap,
                    number: "03",
                    title: "Auto-Fill & Optimize",
                    description: "Click once to auto-fill applications with optimized content. Our AI ensures maximum approval chances.",
                    color: "bg-gray-100"
                  },
                  {
                    icon: Target,
                    number: "04",
                    title: "Track & Follow-up",
                    description: "Monitor all applications in one dashboard. Automated follow-ups ensure nothing falls through the cracks.",
                    color: "bg-gray-100"
                  }
                ].map((step, index) => (
                  <div key={index} className="relative">
                    {/* Connection line for desktop */}
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-200 z-0"></div>
                    )}
                    
                    <div className="relative z-10 text-center">
                      <div className={`inline-block p-6 rounded-2xl ${step.color} mb-6 shadow-lg border border-gray-200`}>
                        <step.icon className="h-10 w-10 text-gray-700" />
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-6xl font-bold text-gray-300">
                          {step.number}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <div className="inline-block bg-gray-50 border border-gray-200 rounded-2xl px-8 py-6">
                  <p className="text-gray-700 text-lg font-semibold">
                    🎯 From 10+ hours per week to 5 minutes per application
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pricing Section */}
        <div id="pricing">
          <section className="py-16 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 lg:mb-16">
                <span className="inline-block px-4 py-2 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-4">
                  💰 Skip Expensive Hiring
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 lg:mb-6">
                  Save <span className="text-red-500">$3K+/month</span> on Consultants
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  Why hire expensive consultants and interns when AI can do it better, faster, and cheaper?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {[
                  {
                    name: "Base",
                    price: "$0",
                    period: "forever",
                    description: "Perfect for trying out Grants Snap",
                    features: [
                      "3 Form auto-fills per week",
                      "Basic AI optimization",
                      "Chrome extension access",
                      "Email support",
                      "Save on consultant fees"
                    ],
                    buttonText: "Start Free",
                    popular: false,
                    icon: Gift,
                    highlight: "Free Forever",
                    borderColor: "border-green-200",
                    bgColor: "bg-green-50"
                  },
                  {
                    name: "Proof",
                    price: "$39",
                    period: "monthly",
                    description: "Great for regular grant applications",
                    features: [
                      "15 Form auto-fills per week",
                      "Advanced AI optimization",
                      "Chrome extension access",
                      "Priority email support",
                      "Progress tracking",
                      "Replace part-time intern costs"
                    ],
                    buttonText: "Get Proof",
                    popular: true,
                    icon: Zap,
                    highlight: "Most Popular",
                    borderColor: "border-black",
                    bgColor: "bg-gray-50"
                  },
                  {
                    name: "Growth",
                    price: "$59",
                    period: "monthly",
                    description: "Unlimited access for scaling startups",
                    features: [
                      "Unlimited form fills per month",
                      "Advanced AI copilot",
                      "Priority support & phone calls",
                      "Custom templates",
                      "Analytics dashboard",
                      "Export capabilities",
                      "Replace full consultant team"
                    ],
                    buttonText: "Scale with Growth",
                    popular: false,
                    icon: Crown,
                    highlight: "Best Value",
                    borderColor: "border-gray-300",
                    bgColor: "bg-gray-50"
                  }
                ].map((plan, index) => {
                  const IconComponent = plan.icon;
                  return (
                    <div 
                      key={index}
                      className={`relative bg-white border-2 ${plan.borderColor} rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className={`text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center ${plan.bgColor} border ${plan.borderColor}`}>
                          <IconComponent className="h-4 w-4 mr-1" />
                          {plan.highlight}
                        </div>
                      </div>
                      
                      <div className="text-center mb-6 lg:mb-8">
                        <h3 className="text-2xl sm:text-3xl font-bold text-black mb-2">{plan.name}</h3>
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                        <div className="mb-4">
                          <span className="text-4xl sm:text-5xl font-bold text-black">{plan.price}</span>
                          <span className="text-gray-500 ml-2">{plan.period}</span>
                        </div>
                        
                        {/* Cost comparison */}
                        {plan.name === 'Proof' && (
                          <div className="text-sm text-green-600 font-medium">
                            vs $500-600/month intern
                          </div>
                        )}
                        {plan.name === 'Growth' && (
                          <div className="text-sm text-green-600 font-medium">
                            vs $2,000-3,000/month consultant
                          </div>
                        )}
                      </div>

                      <ul className="space-y-4 mb-6 lg:mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        size="lg" 
                        className={`w-full py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${
                          plan.popular 
                            ? 'bg-black hover:bg-gray-800 text-white' 
                            : 'bg-gray-800 hover:bg-black text-white'
                        }`}
                      >
                        <Chrome className="mr-2 h-5 w-5" />
                        {plan.buttonText}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-12 lg:mt-16">
                <p className="text-gray-500 text-sm sm:text-base mb-4">
                  🔒 Secure payment • 💯 30-day money-back guarantee • 🚀 Instant access
                </p>
                <p className="text-gray-700 font-semibold text-lg">
                  💡 Save $30,000+ annually compared to hiring consultants and interns
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* FAQ Section */}
        <div id="faq">
          <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 lg:mb-6">
                  Frequently Asked <span className="text-gray-600">Questions</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600">
                  Everything you need to know about Grants Snap
                </p>
              </div>

              <Accordion className="space-y-4">
                {[
                  {
                    question: "How does Grants Snap save me time?",
                    answer: "Grants Snap uses AI to automatically fill out grant applications and investor forms by analyzing your startup data. Instead of spending 10+ hours per week on paperwork, you can complete applications in minutes with our intelligent auto-fill technology."
                  },
                  {
                    question: "Is my data secure?",
                    answer: "Absolutely. We use enterprise-grade encryption and never store your sensitive information on our servers. All data processing happens locally in your browser, and we comply with GDPR and SOC 2 security standards."
                  },
                  {
                    question: "What browsers are supported?",
                    answer: "Currently, Grants Snap is available as a Chrome extension. Support for Firefox, Safari, and Edge is coming soon. You'll need Chrome version 88 or higher for optimal performance."
                  },
                  {
                    question: "Can I get a refund?",
                    answer: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with Grants Snap for any reason, contact our support team within 30 days of purchase for a full refund."
                  },
                  {
                    question: "How accurate is the AI form filling?",
                    answer: "Our AI achieves 95%+ accuracy in form filling by learning from your previous applications and startup data. You can always review and edit before submitting, ensuring 100% accuracy for your specific needs."
                  },
                  {
                    question: "Do you support international applications?",
                    answer: "Yes! Grants Snap works with grant applications and investor forms globally. Our AI is trained on international funding sources and can adapt to different form formats and requirements."
                  },
                  {
                    question: "What happens after I use up my form fills?",
                    answer: "For the Proof plan (15 fills), you can upgrade to Growth for unlimited access. Your progress and templates are saved, so you won&apos;t lose any work when upgrading."
                  },
                  {
                    question: "How do I install the extension?",
                    answer: "After purchase, you'll receive an email with installation instructions. Simply click 'Add to Chrome' and follow the setup wizard. The entire process takes less than 2 minutes."
                  }
                ].map((faq, index) => (
                  <AccordionItem 
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-6 hover:bg-gray-100 transition-colors"
                  >
                    <AccordionTrigger className="text-left text-black hover:text-gray-700 py-6 text-base sm:text-lg font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-6 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="text-center mt-12">
                <p className="text-gray-500 mb-4">Still have questions?</p>
                <a 
                  href="mailto:support@grantssnap.com" 
                  className="inline-flex items-center text-black hover:text-gray-700 transition-colors font-medium"
                >
                  Contact our support team →
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold text-black mb-4">
                  Grants Snap
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  The AI-powered browser extension that saves entrepreneurs hundreds of hours 
                  on funding applications and investor outreach.
                </p>
                <Button 
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Add to Chrome
                </Button>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-black font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#features" className="hover:text-black transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-black transition-colors">How it Works</a></li>
                  <li><a href="#pricing" className="hover:text-black transition-colors">Pricing</a></li>
                  <li><a href="#faq" className="hover:text-black transition-colors">FAQ</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-black font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-black transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © 2024 Grants Snap. All rights reserved.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-black transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-black transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-black transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Back to Startup911 link */}
        <div className="text-center py-8 bg-gray-100">
          <Link 
            href="/"
            className="text-gray-600 hover:text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>←</span>
            <span>Back to Startup911</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 