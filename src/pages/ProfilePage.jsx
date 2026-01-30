import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Code } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const defaultResume = `
<div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
  <!-- Header / Hero Section -->
  <div class="bg-gradient-to-r from-primary to-blue-600 p-8 sm:p-12 text-white">
    <div class="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
      <div class="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>
      <div class="text-center sm:text-left">
        <h1 class="text-4xl sm:text-5xl font-black tracking-tight">John Doe</h1>
        <p class="text-xl text-blue-100 mt-2 font-medium">Senior Software Engineer & UI Enthusiast</p>
        <div class="flex flex-wrap justify-center sm:justify-start gap-4 mt-6 text-sm text-blue-50">
          <span class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> john.doe@example.com</span>
          <span class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> +1 (555) 000-1234</span>
          <span class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg> San Francisco, CA</span>
        </div>
      </div>
    </div>
  </div>

  <div class="p-8 sm:p-12 space-y-12">
    <!-- Summary -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
        <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>
        Professional Summary
      </h2>
      <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
        Passionate and results-driven Software Engineer with over 8 years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture. Dedicated to creating high-quality code and exceptional user experiences.
      </p>
    </section>

    <div class="grid sm:grid-cols-3 gap-12">
      <!-- Left Column: Experience -->
      <div class="sm:col-span-2 space-y-12">
        <section>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span>
            Work Experience
          </h2>
          <div class="space-y-8 border-l-2 border-primary/20 ml-4 pl-8 pt-2">
            <!-- Job 1 -->
            <div class="relative">
              <div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-900"></div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Lead Frontend Architect</h3>
                <p class="text-primary font-semibold">TechCorp Solutions • 2020 - Present</p>
                <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                  <li>Lead a team of 12 developers in rebuilding the core product dashboard using Next.js.</li>
                  <li>Improved site performance by 40% through advanced code-splitting and caching strategies.</li>
                  <li>Implemented a company-wide design system used by 5 different product teams.</li>
                </ul>
              </div>
            </div>
            <!-- Job 2 -->
            <div class="relative">
              <div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-blue-400 border-4 border-white dark:border-gray-900"></div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Software Engineer II</h3>
                <p class="text-primary font-semibold">Global Innovators • 2017 - 2020</p>
                <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                  <li>Developed microservices architecture using Node.js and Docker.</li>
                  <li>Migrated legacy PHP application to a modern React-based SPA.</li>
                  <li>Reduced AWS infrastructure costs by 25% through resource optimization.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Skills & Education -->
      <div class="space-y-12">
        <section>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></span>
            Tech Stack
          </h2>
          <div class="flex flex-wrap gap-2">
            <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">React</span>
            <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">TypeScript</span>
            <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">Node.js</span>
            <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">Next.js</span>
            <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">Tailwind CSS</span>
            <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">AWS</span>
            <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">GraphQL</span>
            <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">PostgreSQL</span>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path><path d="M8 2v20"></path></svg></span>
            Education
          </h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">BS Computer Science</h3>
              <p class="text-sm text-gray-500">Stanford University • 2013 - 2017</p>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">Professional Scrum Master</h3>
              <p class="text-sm text-gray-500">Scrum.org • 2021</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="bg-gray-50 dark:bg-gray-800/50 p-8 border-t border-gray-100 dark:border-gray-800 text-center">
    <p class="text-gray-500 text-sm">Design tailored with NoteSpend Premium</p>
  </div>
</div>
`;

const ProfilePage = () => {
  const { db } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [resumeContent, setResumeContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const result = await db.settings.get('resume_content');
        if (result) {
          setResumeContent(result.value);
        } else {
          setResumeContent(defaultResume);
        }
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        setResumeContent(defaultResume);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [db]);

  const handleSave = async () => {
    try {
      await db.settings.put({ key: 'resume_content', value: resumeContent });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save resume:", error);
      alert("Failed to save. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-32">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Professional Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your premium CV template, fully editable.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-5 py-2.5 rounded-xl font-semibold shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
          >
            <Edit2 size={18} />
            <span>Edit Template</span>
          </button>
        ) : (
          <div className="flex items-center space-x-3">
             <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center space-x-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
            <Award className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={20} />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Pro Tip:</strong> You can use standard HTML tags and Tailwind CSS classes to style your CV. Try changing colors, adding sections, or updating your details!
            </p>
          </div>
          <div className="relative group">
            <textarea
              className="w-full h-[70vh] p-8 bg-white dark:bg-gray-950 rounded-3xl border-2 border-gray-100 dark:border-gray-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-mono text-sm leading-relaxed shadow-inner"
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              placeholder="Enter your CV HTML here..."
            />
            <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-50">
              <Code size={16} />
              <span className="text-xs font-mono">HTML Mode</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-0 animate-in fade-in zoom-in-95 duration-500">
          <div dangerouslySetInnerHTML={{ __html: resumeContent }} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
