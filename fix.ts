export default function OpenCollaboratorAward() {
  const [activeTab, setActiveTab] = useState<'all' | 'voted' | 'nominated'>('all');
  const [isNominatedModalOpen, setIsNominatedModalOpen] = useState(false);
  
  // Types based on Feishu Base structure
  type Nominee = {
    id: string;
    name: string;
    role: string;
    project: string;
    avatar: string;
    votes: number;
    description: string;
    link: string;
    status: 'active' | 'voted' | 'selected';
  };

  const nominees: Nominee[] = [
    {
      id: '1',
      name: 'Alice Chen',
      role: 'Ecosystem Architect',
      project: 'Bazaar Core',
      avatar: 'https://images.unsplash.com/photo-1573496691428-5e5478a7376b',
      votes: 84,
      description: 'Driven the backend expansion for the Open Source Bazaar, connecting disparate microservices seamlessly.',
      link: 'https://github.com/alice-chen',
      status: 'active',
    },
    {
      id: '2',
      name: 'Marcus Volt',
      role: 'UX Visionary',
      project: 'Bazaar UI Kit',
      avatar: 'https://images.unsplash.com/photo-1618044738323-d4931484280b',
      votes: 62,
      description: 'Redesigned the navigation logic to ensure fluid transitions between the main marketplace and specific articles.',
      link: 'https://dribbble.com/marcusv',
      status: 'voted',
    },
    {
      id: '3',
      name: 'Sarah Code',
      role: 'TypeScript Guru',
      project: 'TypeScript Utils',
      avatar: 'https://images.unsplash.com/photo-1494790108378-c18394e5f2ba',
      votes: 91,
      description: 'Created the utility functions that power the award voting mechanism itself, ensuring high performance.',
      link: 'https://sarahcode.io',
      status: 'active',
    },
  ];

  // Handler for the "Nominate" interaction
  const handleNominate = (nominee: Nominee) => {
    setSelectedNominee(nominee);
    setIsNominatedModalOpen(true);
  };

  const handleVote = () => {
    if (isNominatedModalOpen && selectedNominee) {
      // Simulate API call to Feishu/Backend
      console.log(`Nomined: ${selectedNominee.name}`);
      setIsNominatedModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Header Section - Inspired by Hackathon Page */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
              <Award className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-lg tracking-tight text-slate-800">Open Collaborator</h1>
              <p className="text-xs text-slate-500 font-medium">Ecosystem Awards</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-1">
             <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              All Nominees
            </button>
            <button 
              onClick={() => setActiveTab('voted')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'voted' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Top Voted
            </button>
          </nav>

          <button 
            onClick={() => handleNominate({ id: 'my', name: 'My Project', role: 'Self', project: '...', status: 'active' })}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nominate</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro Section */}
        <div className="mb-16 space-y-6">
          <div className="relative group cursor-default">
             <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Recognizing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Invisible Hands</span>
             </h2>
             <p className="mt-4 text-lg text-slate-500 max-w-2xl leading-relaxed">
               The Open Source Bazaar runs on the shoulders of giants. From backend refactors to UI polish, this year we honor the dedicated collaborators who make the ecosystem breathe.
             </p>
          </div>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-end gap-6 text-sm text-slate-500 border-t border-slate-200 pt-6">
             <div className="flex items-center gap-2">
               <Users className="h-4 w-4 text-indigo-500" />
               <span>128 Active Nominees</span>
             </div>
             <div className="flex items-center gap-2">
               <Sparkles className="h-4 w-4 text-amber-500" />
               <span>3 Categories</span>
             </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nominees.map((nominee) => (
            <div 
              key={nominee.id}
              onMouseEnter={(e) => { e.currentTarget.classList.add('hover:-translate-y-2', 'hover:shadow-xl'); }}
              onMouseLeave={(e) => { e.currentTarget.classList.remove('hover:-translate-y-2', 'hover:shadow-xl'); }}
              className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:border-indigo-200 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-white group-hover:ring-indigo-50 transition-all">
                  <img src={nominee.avatar} alt={nominee.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    nominee.status === 'active' ? 'bg-blue-50 text-blue-600' : 
                    nominee.status === 'voted' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {nominee.status}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{nominee.name}</h3>
              <p className="text-indigo-600 font-semibold text-sm mb-4">{nominee.role}</p>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all">
                {nominee.description}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Award className="h-3 w-3" />
                  <span>{nominee.project}</span>
                </div>
                <button 
                  onClick={() => handleNominate(nominee)}
                  className="text-sm font-bold text-slate-700 hover:text-indigo-600 group-hover:underline"
                >
                  View Profile &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* "Nominate" Modal Overlay */}
        {isNominatedModalOpen && selectedNominee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
              onClick={() => setIsNominatedModalOpen(false)}
            />
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="p-8 pb-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Nominating</h3>
                  <p className="text-slate-500 text-sm">{selectedNominee.name}</p>
                </div>
                <button 
                  onClick={() => setIsNominatedModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <img 
                      src={selectedNominee.avatar} 
                      alt={selectedNominee.name} 
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50" 
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedNominee.name}</h2>
                      <p className="text-slate-500 mt-1">{selectedNominee.role}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
                        <ArrowRight className="h-4 w-4" />
                        <a href={selectedNominee.link} target="_blank" rel="noreferrer" className="hover:underline">View Original Work</a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-600 leading-relaxed">
                    <p>{selectedNominee.description}</p>
                  </div>

                  {/* Form Inputs for specific Feishu fields if needed */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contribution</label>
                      <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                        <option>Core Feature</option>
                        <option>Refactor</option>
                        <option>Documentation</option>
                        <option>Bug Fix</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={handleVote}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                    >
                      Submit Nomination
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer - Subtle touch */}
      <footer className="mt-24 border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            Curated by <a href="https://bazaar.fcc-cd.dev" className="text-indigo-500 hover:text-indigo-600 font-medium">The Bazaar Team</a>
          </p>
        </div>
      </footer>
    </div>
  );
}