import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import { 
  Layers, 
  Code2, 
  Award, 
  Trophy, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Search,
  LayoutDashboard,
  User,
  Settings,
  Menu,
  X,
  ExternalLink,
  Code,
  Briefcase,
  GraduationCap,
  Info,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const Dashboard = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // States
  const [data, setData] = useState({
    about: [],
    skills: [],
    experiences: [],
    projects: [],
    educations: [],
    certifications: [],
    achievements: [],
    messages: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [abtRes, expRes, eduRes, projRes, skillRes, certRes, achRes] = await Promise.all([
        api.get('/about'),
        api.get('/experiences'),
        api.get('/educations'),
        api.get('/projects'),
        api.get('/skills'),
        api.get('/certifications'),
        api.get('/achievements'),
      ]);
      
      let msgRes = { data: { data: [] } };
      try {
        msgRes = await api.get('/contact');
      } catch (err) {
        console.warn('Could not fetch messages', err);
      }

      setData({
        about: abtRes.data.data || [],
        experiences: expRes.data.data || [],
        educations: eduRes.data.data || [],
        projects: projRes.data.data || projRes.data || [],
        skills: skillRes.data.data || skillRes.data || [],
        certifications: certRes.data.data || certRes.data || [],
        achievements: achRes.data.data || achRes.data || [],
        messages: msgRes.data.data || msgRes.data || []
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    const defaults = {
      about: { name: '', role: '', paragraphs: [], location: '', degree: '', cgpa: '', status: '', github: '', linkedin: '', email: '', resumeLink: '' },
      skills: { name: '', level: 80, category: 'Frontend' },
      experiences: { title: '', company: '', period: '', roleTypes: '', responsibilities: [], tags: [], images: [] },
      educations: { degree: '', institution: '', period: '', score: '' },
      projects: { title: '', description: '', image: '', tags: [], github: '', live: '' },
      certifications: { title: '', issuer: '', image: '', date: new Date().toISOString() },
      achievements: { title: '', description: '', images: [], date: new Date().toISOString() }
    };
    setCurrentEdit({ ...(defaults[activeTab] || {}), _type: activeTab });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentEdit({ ...item, _type: activeTab });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, collection) => {
    if (window.confirm(`Are you sure you want to delete this ${collection}?`)) {
      try {
        await api.delete(`/${collection}/${id}`);
        toast.success('Deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentEdit({ ...currentEdit, image: data.imageUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Upload failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultiImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data.imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const currentImages = currentEdit.images || [];
      setCurrentEdit({ ...currentEdit, images: [...currentImages, ...uploadedUrls] });
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('One or more uploads failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentEdit) return;

    const endpoint = `/${currentEdit._type}`;
    const { _type, ...payload } = currentEdit;

    if (_type === 'projects' && typeof payload.techStack === 'string') {
      payload.techStack = payload.techStack.split(',').map(s => s.trim()).filter(s => s);
    }
    if (_type === 'projects' && typeof payload.features === 'string') {
      payload.features = payload.features.split('\n').map(s => s.trim()).filter(s => s);
    }
    if (_type === 'about' && typeof payload.paragraphs === 'string') {
      payload.paragraphs = payload.paragraphs.split('\n').map(s => s.trim()).filter(s => s);
    }
    if (_type === 'experiences' && typeof payload.responsibilities === 'string') {
      payload.responsibilities = payload.responsibilities.split('\n').map(s => s.trim()).filter(s => s);
    }
    if (_type === 'experiences' && typeof payload.tags === 'string') {
      payload.tags = payload.tags.split(',').map(s => s.trim()).filter(s => s);
    }

    try {
      if (payload._id) {
        await api.put(`${endpoint}/${payload._id}`, payload);
        toast.success('Updated successfully');
      } else {
        await api.post(endpoint, payload);
        toast.success('Created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const menuItems = [
    { id: 'about', label: 'About', icon: <Info size={20} /> },
    { id: 'skills', label: 'Skills', icon: <Code2 size={20} /> },
    { id: 'experiences', label: 'Experience', icon: <Briefcase size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Layers size={20} /> },
    { id: 'educations', label: 'Education', icon: <GraduationCap size={20} /> },
    { id: 'certifications', label: 'Certifications', icon: <Award size={20} /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
  ];

  const filteredItems = data[activeTab]?.filter(item => {
    const searchStr = (item.title || item.name || item.message || '').toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Admin Panel</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {data[item.id]?.length > 0 && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    {data[item.id].length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700/50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-[#1e293b]/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 lg:hidden text-slate-400 hover:text-white">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0f172a] border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-64"
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-700/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">Pruthweesh NV</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-primary font-bold border-2 border-slate-600">
                P
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 hover:border-primary/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                    <Layers size={24} />
                  </div>
                  <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">PRO</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium">Projects</h3>
                <p className="text-3xl font-bold text-white mt-1">{data.projects.length}</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 hover:border-secondary/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                    <Code2 size={24} />
                  </div>
                  <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">DEV</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium">Skills</h3>
                <p className="text-3xl font-bold text-white mt-1">{data.skills.length}</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 hover:border-amber-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                    <Award size={24} />
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm font-medium">Certs</h3>
                <p className="text-3xl font-bold text-white mt-1">{data.certifications.length}</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <MessageSquare size={24} />
                  </div>
                  {data.messages.length > 0 && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                </div>
                <h3 className="text-slate-400 text-sm font-medium">Messages</h3>
                <p className="text-3xl font-bold text-white mt-1">{data.messages.length}</p>
              </div>
            </div>

            {/* Main Data Section */}
            <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
              <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-700/50">
                <div>
                  <h3 className="text-xl font-bold text-white">Manage {activeTab}</h3>
                  <p className="text-sm text-slate-400 mt-1">Add, update, or remove entries from your portfolio.</p>
                </div>
                {activeTab !== 'messages' && (
                  <button onClick={handleAdd} className="btn-primary py-3 px-6 flex items-center gap-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    <Plus size={20} /> Add New
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium">Loading your data...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} className="text-slate-600" />
                  </div>
                  <h4 className="text-xl font-bold text-white">No results found</h4>
                  <p className="text-slate-400 mt-2">Try adjusting your search or add a new entry.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-8 py-4">Title / Name</th>
                        {activeTab === 'about' && <th className="px-8 py-4">Role</th>}
                        {activeTab === 'experiences' && <th className="px-8 py-4">Company</th>}
                        {activeTab === 'educations' && <th className="px-8 py-4">Institution</th>}
                        {activeTab === 'projects' && <th className="px-8 py-4">Technology</th>}
                        {activeTab === 'skills' && <th className="px-8 py-4">Category</th>}
                        {activeTab === 'certifications' && <th className="px-8 py-4">Issuer</th>}
                        {['projects', 'certifications', 'achievements', 'experiences'].includes(activeTab) && <th className="px-8 py-4">Media</th>}
                        {activeTab === 'messages' && (
                          <>
                            <th className="px-8 py-4">Contact Info</th>
                            <th className="px-8 py-4">Message Preview</th>
                          </>
                        )}
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {filteredItems.map((item) => (
                        <tr key={item._id} className="group hover:bg-slate-800/30 transition-colors">
                          <td className="px-8 py-6">
                            <span className="text-white font-bold block">{item.title || item.name || item.degree}</span>
                            {item.description && <span className="text-xs text-slate-500 mt-1 block truncate max-w-xs">{item.description}</span>}
                          </td>
                          
                          {activeTab === 'about' && <td className="px-8 py-6 text-slate-300 font-medium">{item.role}</td>}
                          {activeTab === 'experiences' && <td className="px-8 py-6 text-slate-300 font-medium">{item.company}</td>}
                          {activeTab === 'educations' && <td className="px-8 py-6 text-slate-300 font-medium">{item.institution}</td>}
                          
                          {activeTab === 'projects' && (
                            <td className="px-8 py-6">
                              <div className="flex flex-wrap gap-1">
                                {item.techStack?.slice(0, 3).map((tech) => (
                                  <span key={tech} className="px-2 py-0.5 text-[10px] rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                                    {tech}
                                  </span>
                                ))}
                                {item.techStack?.length > 3 && <span className="text-[10px] text-slate-600">+{item.techStack.length - 3}</span>}
                              </div>
                            </td>
                          )}
                          
                          {activeTab === 'skills' && (
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                item.category === 'frontend' ? 'bg-blue-500/10 text-blue-400' :
                                item.category === 'backend' ? 'bg-purple-500/10 text-purple-400' :
                                item.category === 'database' ? 'bg-emerald-500/10 text-emerald-400' :
                                'bg-amber-500/10 text-amber-400'
                              }`}>
                                {item.category}
                              </span>
                            </td>
                          )}

                          {activeTab === 'certifications' && <td className="px-8 py-6 text-slate-300 font-medium">{item.issuer}</td>}

                          {['projects', 'certifications', 'achievements', 'experiences'].includes(activeTab) && (
                            <td className="px-8 py-6">
                              {['achievements', 'experiences'].includes(activeTab) ? (
                                <div className="flex -space-x-2 overflow-hidden">
                                  {(item.images || []).slice(0, 3).map((img, i) => (
                                    <img key={i} src={img} className="w-8 h-8 rounded-full border-2 border-slate-800 object-cover" />
                                  ))}
                                  {(item.images?.length > 3) && (
                                    <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                      +{item.images.length - 3}
                                    </div>
                                  )}
                                  {(!item.images || item.images.length === 0) && <span className="text-xs text-slate-600 italic">No media</span>}
                                </div>
                              ) : (
                                item.image ? (
                                  <img src={item.image} className="w-10 h-7 rounded bg-slate-800 object-cover border border-slate-700 shadow-sm" />
                                ) : (
                                  <span className="text-xs text-slate-600 italic">No media</span>
                                )
                              )}
                            </td>
                          )}
                          
                          {activeTab === 'messages' && (
                            <>
                              <td className="px-8 py-6">
                                <span className="text-white font-medium block">{item.email}</span>
                                <span className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                              </td>
                              <td className="px-8 py-6 max-w-xs">
                                <p className="text-xs text-slate-400 italic line-clamp-2">"{item.message}"</p>
                              </td>
                            </>
                          )}

                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {activeTab !== 'messages' && (
                                <button 
                                  onClick={() => handleEdit(item)} 
                                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete(item._id, activeTab)} 
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Dynamic Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`${currentEdit?._id ? 'Update' : 'Create'} ${currentEdit?._type?.slice(0, -1) || ''}`}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {(currentEdit?._type === 'projects' || currentEdit?._type === 'certifications' || currentEdit?._type === 'achievements' || currentEdit?._type === 'experiences') && (
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Title</label>
                <input 
                  type="text" 
                  value={currentEdit?.title || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, title: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all"
                  required
                  placeholder="e.g. My Awesome Project"
                />
              </div>
            )}

            {currentEdit?._type === 'about' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Name</label>
                    <input type="text" value={currentEdit?.name || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Role</label>
                    <input type="text" value={currentEdit?.role || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, role: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Location</label>
                    <input type="text" value={currentEdit?.location || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, location: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Degree</label>
                    <input type="text" value={currentEdit?.degree || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, degree: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">CGPA</label>
                    <input type="text" value={currentEdit?.cgpa || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, cgpa: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Status</label>
                    <input type="text" value={currentEdit?.status || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, status: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">GitHub URL</label>
                    <input type="text" value={currentEdit?.github || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, github: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">LinkedIn URL</label>
                    <input type="text" value={currentEdit?.linkedin || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, linkedin: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Email</label>
                    <input type="email" value={currentEdit?.email || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, email: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Resume Link</label>
                    <input type="text" value={currentEdit?.resumeLink || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, resumeLink: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Paragraphs (separated by newline)</label>
                  <textarea value={Array.isArray(currentEdit?.paragraphs) ? currentEdit.paragraphs.join('\n') : (currentEdit?.paragraphs || '')} onChange={(e) => setCurrentEdit({ ...currentEdit, paragraphs: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all resize-none" rows={5} required />
                </div>
              </>
            )}

            {currentEdit?._type === 'experiences' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Company</label>
                    <input type="text" value={currentEdit?.company || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, company: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Period</label>
                    <input type="text" value={currentEdit?.period || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, period: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required placeholder="e.g. Jan 2026 - Apr 2026 | Remote" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Role Types</label>
                  <input type="text" value={currentEdit?.roleTypes || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, roleTypes: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" placeholder="e.g. Frontend Developer (4 months) + Team Captain (1 month)" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Responsibilities (separated by newline)</label>
                  <textarea value={Array.isArray(currentEdit?.responsibilities) ? currentEdit.responsibilities.join('\n') : (currentEdit?.responsibilities || '')} onChange={(e) => setCurrentEdit({ ...currentEdit, responsibilities: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all resize-none" rows={4} required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Tags (comma separated)</label>
                  <input type="text" value={Array.isArray(currentEdit?.tags) ? currentEdit.tags.join(', ') : (currentEdit?.tags || '')} onChange={(e) => setCurrentEdit({ ...currentEdit, tags: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Experience Media (Certificates/Proof)</label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {(currentEdit?.images || []).map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-700 group/preview">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            const newImages = currentEdit.images.filter((_, i) => i !== idx);
                            setCurrentEdit({ ...currentEdit, images: newImages });
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/preview:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <label
                      htmlFor="exp-multi-image-upload"
                      className={`w-24 h-24 flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 text-slate-500 cursor-pointer hover:border-primary hover:text-primary transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {isUploading ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Plus size={20} />
                          <span className="text-[10px] font-bold">Add Images</span>
                        </>
                      )}
                      <input
                        type="file"
                        id="exp-multi-image-upload"
                        className="hidden"
                        onChange={handleMultiImageUpload}
                        accept="image/*"
                        multiple
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            {currentEdit?._type === 'educations' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Degree</label>
                  <input type="text" value={currentEdit?.degree || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, degree: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required placeholder="e.g. Bachelor of Technology" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Field of Study</label>
                  <input type="text" value={currentEdit?.field || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, field: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required placeholder="e.g. Information Technology" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-400 mb-2">Institution</label>
                  <input type="text" value={currentEdit?.institution || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, institution: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Location</label>
                  <input type="text" value={currentEdit?.location || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, location: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Period</label>
                  <input type="text" value={currentEdit?.period || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, period: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-400 mb-2">Score/CGPA</label>
                  <input type="text" value={currentEdit?.score || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, score: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" required />
                </div>
              </div>
            )}

            {currentEdit?._type === 'skills' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Skill Name</label>
                  <input 
                    type="text" 
                    value={currentEdit?.name || ''}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all"
                    required
                    placeholder="e.g. React.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Category</label>
                  <select
                    value={currentEdit?.category || 'frontend'}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, category: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all appearance-none"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="programming languages">Programming Languages</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>
              </>
            )}

            {currentEdit?._type === 'certifications' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Issuer</label>
                  <input 
                    type="text" 
                    value={currentEdit?.issuer || ''}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, issuer: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all"
                    required
                    placeholder="e.g. Google, Udemy, IBM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={currentEdit?.date ? new Date(currentEdit.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, date: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Certificate Image</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={currentEdit?.image || ''}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, image: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all text-sm"
                        placeholder="Image URL..."
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="cert-image-upload"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                      <label
                        htmlFor="cert-image-upload"
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-300 cursor-pointer hover:bg-slate-700 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {isUploading ? (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Upload size={18} />
                        )}
                        <span className="text-sm font-medium">Upload</span>
                      </label>
                    </div>
                  </div>
                  {currentEdit?.image && (
                    <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700 group/preview">
                      <img src={currentEdit.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setCurrentEdit({ ...currentEdit, image: '' })}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/preview:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {(currentEdit?._type === 'projects' || currentEdit?._type === 'achievements') && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Description</label>
                  <textarea 
                    value={currentEdit?.description || ''}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, description: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all resize-none"
                    rows={4}
                    required
                    placeholder="Tell us more about this..."
                  />
                </div>
                {currentEdit?._type === 'achievements' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">Date</label>
                      <input 
                        type="date" 
                        value={currentEdit?.date ? new Date(currentEdit.date).toISOString().split('T')[0] : ''}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, date: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">Achievement Images</label>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {(currentEdit?.images || []).map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-700 group/preview">
                            <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => {
                                const newImages = currentEdit.images.filter((_, i) => i !== idx);
                                setCurrentEdit({ ...currentEdit, images: newImages });
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/preview:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <label
                          htmlFor="ach-multi-image-upload"
                          className={`w-24 h-24 flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 text-slate-500 cursor-pointer hover:border-primary hover:text-primary transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          {isUploading ? (
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Plus size={20} />
                              <span className="text-[10px] font-bold">Add Images</span>
                            </>
                          )}
                          <input
                            type="file"
                            id="ach-multi-image-upload"
                            className="hidden"
                            onChange={handleMultiImageUpload}
                            accept="image/*"
                            multiple
                          />
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {currentEdit?._type === 'projects' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Tech Stack (comma separated)</label>
                  <input 
                    type="text" 
                    value={Array.isArray(currentEdit?.techStack) ? currentEdit.techStack.join(', ') : (currentEdit?.techStack || '')}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, techStack: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all"
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2 flex items-center gap-2"><Code size={14}/> GitHub</label>
                    <input type="url" value={currentEdit?.githubLink || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, githubLink: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2 flex items-center gap-2"><ExternalLink size={14}/> Live Demo</label>
                    <input type="url" value={currentEdit?.liveLink || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, liveLink: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Badge (Optional)</label>
                  <input type="text" value={currentEdit?.badge || ''} onChange={(e) => setCurrentEdit({ ...currentEdit, badge: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all" placeholder="e.g. NEW, FEATURED" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Key Features (One per line)</label>
                  <textarea 
                    value={Array.isArray(currentEdit?.features) ? currentEdit.features.join('\n') : (currentEdit?.features || '')}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, features: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all resize-none"
                    rows={3}
                    placeholder="Feature 1&#10;Feature 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Project Image</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={currentEdit?.image || ''}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, image: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-700/50 focus:border-primary outline-none text-white transition-all text-sm"
                        placeholder="Image URL..."
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="proj-image-upload"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                      <label
                        htmlFor="proj-image-upload"
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-300 cursor-pointer hover:bg-slate-700 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {isUploading ? (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Upload size={18} />
                        )}
                        <span className="text-sm font-medium">Upload</span>
                      </label>
                    </div>
                  </div>
                  {currentEdit?.image && (
                    <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700 group/preview">
                      <img src={currentEdit.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setCurrentEdit({ ...currentEdit, image: '' })}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/preview:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 px-6 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 transition-all">Cancel</button>
            <button type="submit" className="flex-[2] btn-primary py-4 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              {currentEdit?._id ? 'Update Entry' : 'Create Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
