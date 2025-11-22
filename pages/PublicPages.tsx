
import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { CheckCircle, Star, ArrowRight, FileText, Upload, Edit, Send, BookCheck, Sparkles, Loader2, User, MapPin } from 'lucide-react';
import { generateOptimizedTitles } from '../services/geminiService';
import { TitleImprovementStatus } from '../types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// --- Components ---

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-serif font-bold text-primary mb-4">{title}</h2>
    {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

// --- Pages ---

export const Home = () => {
  const { config, services, testimonials } = useSite();

  return (
    <>
      <Helmet>
        <title>{config.siteName} | Academic Editing & Publishing Services in Nigeria</title>
        <meta name="description" content="Premier academic editing service for Nigerian researchers. We help you publish in top-tier international journals (Elsevier, Wiley, Springer) with professional proofreading and editing." />
        <meta name="keywords" content="academic editing Nigeria, journal publication, manuscript editing, proofreading services, research paper editing, Obas Publications" />
        <link rel="canonical" href="https://obaspublications.com/" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {config.heroHeadline}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              {config.heroSubheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="bg-secondary text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-yellow-600 transition">
                Get Started
              </Link>
              <Link to="/services" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-white hover:text-primary transition">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gray-100 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-6 font-semibold">
            Helping researchers publish in top-tier journals
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
            {/* Simple Text Logos for Trust */}
            <span className="text-2xl font-bold font-serif text-gray-600">ELSEVIER</span>
            <span className="text-2xl font-bold font-serif text-gray-600">Springer</span>
            <span className="text-2xl font-bold font-serif text-gray-600">Wiley</span>
            <span className="text-2xl font-bold font-serif text-gray-600">Taylor & Francis</span>
            <span className="text-2xl font-bold font-serif text-gray-600">SAGE</span>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Core Services" subtitle="Tailored solutions to meet the rigorous standards of international academic publishing." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link to="/services" className="text-secondary font-semibold flex items-center hover:underline">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <SectionHeader title="Trusted by Nigerian Academics" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {testimonials.map(t => (
               <div key={t.id} className="bg-white p-6 rounded-lg shadow-sm">
                 <div className="flex mb-4">
                   {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 text-secondary fill-current" />)}
                 </div>
                 <p className="text-gray-700 italic mb-4">"{t.content}"</p>
                 <div>
                   <p className="font-bold text-primary">{t.name}</p>
                   <p className="text-sm text-gray-500">{t.role}, {t.institution}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>
    </>
  );
};

export const ServicesPage = () => {
  const { services, config } = useSite();

  return (
    <div className="py-16 bg-gray-50">
      <Helmet>
        <title>Academic Editing Packages & Pricing | {config.siteName}</title>
        <meta name="description" content="Affordable and professional editing packages: Essential Editing, Publication-Ready, and Scientific Review. Prices in Naira." />
        <link rel="canonical" href="https://obaspublications.com/services" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Service Packages" subtitle="Choose the level of support that best fits your manuscript's needs." />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border ${service.isPopular ? 'border-secondary ring-2 ring-secondary ring-opacity-50' : 'border-gray-200'}`}
            >
              {service.isPopular && (
                <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">{service.title}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">{service.price}<span className="text-sm text-gray-500 font-normal">/paper (approx)</span></div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`block w-full text-center py-3 rounded-md font-bold transition ${service.isPopular ? 'bg-primary text-white hover:bg-blue-800' : 'bg-blue-50 text-primary hover:bg-blue-100'}`}>
                  Select Package
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-primary mb-6">A La Carte Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Plagiarism Check', 'Journal Selection', 'Figure Formatting', 'Cover Letter Writing', 'Response to Reviewers', 'Reference Formatting'].map((item, idx) => (
               <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-secondary mr-3" />
                  <span className="text-gray-700 font-medium">{item}</span>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResourcesPage = () => {
  const { blogPosts, config } = useSite();
  const [draftTitle, setDraftTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [status, setStatus] = useState<TitleImprovementStatus>(TitleImprovementStatus.IDLE);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle || !abstract) return;

    setStatus(TitleImprovementStatus.LOADING);
    try {
      const titles = await generateOptimizedTitles(draftTitle, abstract);
      setSuggestions(titles);
      setStatus(TitleImprovementStatus.SUCCESS);
    } catch (error) {
      setStatus(TitleImprovementStatus.ERROR);
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <Helmet>
        <title>Academic Resources & AI Title Improver | {config.siteName}</title>
        <meta name="description" content="Free academic writing resources and our AI-powered title optimizer tool to help you craft the perfect journal article title." />
        <link rel="canonical" href="https://obaspublications.com/resources" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* AI Tool Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-20">
          <div className="bg-primary p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-8 w-8 text-secondary" />
              <h2 className="text-3xl font-serif font-bold">Smart Title Improver</h2>
            </div>
            <p className="text-blue-100 max-w-2xl">
              Powered by Google Gemini. Enter your draft title and abstract to get 3 high-impact alternatives optimized for international journals.
            </p>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <form onSubmit={handleOptimize} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Draft Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Study on effects of climate change in Lagos"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Paste your abstract here..."
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === TitleImprovementStatus.LOADING}
                className="w-full bg-secondary text-white py-3 rounded-md font-bold hover:bg-yellow-600 transition disabled:opacity-50 flex justify-center items-center"
              >
                {status === TitleImprovementStatus.LOADING ? (
                  <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Generating...</>
                ) : (
                  'Generate Better Titles'
                )}
              </button>
            </form>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Results</h3>
              {status === TitleImprovementStatus.IDLE && (
                <div className="text-gray-500 text-center py-10">Enter details to see AI suggestions here.</div>
              )}
              {status === TitleImprovementStatus.LOADING && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Loader2 className="animate-spin h-8 w-8 text-primary mb-2" />
                  <p>Consulting the AI...</p>
                </div>
              )}
              {status === TitleImprovementStatus.ERROR && (
                <div className="text-red-500 text-center py-10">Failed to generate titles. Please check your connection and try again.</div>
              )}
              {status === TitleImprovementStatus.SUCCESS && (
                <ul className="space-y-4">
                  {suggestions.map((title, index) => (
                    <li key={index} className="bg-white p-4 rounded-md shadow-sm border-l-4 border-secondary">
                      <p className="font-serif text-primary font-medium">{title}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Blog List */}
        <SectionHeader title="Academic Resources & Insights" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs font-semibold bg-blue-50 text-primary px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-secondary cursor-pointer">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-4">
                  <span>By {post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export const ProcessPage = () => {
  const { config } = useSite();
  const steps = [
    { icon: FileText, title: "Request Quote", desc: "Submit your manuscript details and service needs via our contact form." },
    { icon: Upload, title: "Upload & Pay", desc: "Securely upload your file and make payment for your selected package." },
    { icon: BookCheck, title: "Initial Review", desc: "Our experts assess your work and assign the best subject-matter specialist." },
    { icon: Edit, title: "Professional Edit", desc: "Rigorous editing, formatting, and improvement of your manuscript." },
    { icon: Send, title: "Ready for Submission", desc: "Receive your publication-ready manuscript and support documents." }
  ];

  return (
    <div className="py-16 bg-white">
      <Helmet>
        <title>Our Publication Process | {config.siteName}</title>
        <meta name="description" content="See our transparent 5-step workflow from quote request to publication-ready manuscript." />
        <link rel="canonical" href="https://obaspublications.com/process" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Our Workflow" subtitle="A transparent, 5-step process designed for speed and quality." />
        
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-white border-2 border-primary rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:bg-primary group-hover:border-primary transition duration-300">
                  <step.icon className="h-8 w-8 text-primary group-hover:text-white transition duration-300" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage = () => {
  const { addLead, services, config } = useSite();
  const [formData, setFormData] = useState({ name: '', email: '', serviceInterest: services[0].title, message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead(formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', serviceInterest: services[0].title, message: '' });
  };

  return (
    <div className="py-16 bg-gray-50">
      <Helmet>
        <title>Contact Us | {config.siteName}</title>
        <meta name="description" content="Get a free quote for your manuscript editing today. Contact Obas Publications for professional academic support." />
        <link rel="canonical" href="https://obaspublications.com/contact" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">Let's Get Published</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Ready to take the next step in your academic career? Fill out the form, and our team will get back to you within 24 hours.
            </p>
            
            <div className="space-y-6">
               <div className="flex items-start space-x-4">
                 <div className="bg-blue-100 p-3 rounded-full flex-shrink-0"><MapPin className="h-6 w-6 text-primary" /></div>
                 <div>
                   <h4 className="font-bold text-gray-900">Office</h4>
                   <p className="text-gray-600">{config.contactAddress}</p>
                 </div>
               </div>
               <div className="flex items-start space-x-4">
                 <div className="bg-blue-100 p-3 rounded-full flex-shrink-0"><User className="h-6 w-6 text-primary" /></div>
                 <div>
                   <h4 className="font-bold text-gray-900">Support</h4>
                   <p className="text-gray-600">{config.supportHours}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We will be in touch shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-primary hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service of Interest</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.serviceInterest}
                    onChange={e => setFormData({...formData, serviceInterest: e.target.value})}
                  >
                    {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    <option value="Other">Other / General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    required rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-blue-800 transition">
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
