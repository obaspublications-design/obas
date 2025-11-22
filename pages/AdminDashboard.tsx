
import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Settings, Users, FileText, Trash2, Sparkles, Loader2, PlusCircle, Lock, Shield, Briefcase, Save, LogOut, Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateBlogTopics } from '../services/geminiService';
import { ServicePackage, BlogPost } from '../types';
import { Helmet } from 'react-helmet-async';

export const AdminLogin = () => {
  const { login, isAdmin } = useSite();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
       <Helmet>
         <title>Admin Login | Obas Publications</title>
         <meta name="robots" content="noindex, nofollow" />
       </Helmet>
       {/* Decorative Background Elements */}
       <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
       <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-xl max-w-md w-full border border-white/50 relative z-10 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Admin Portal</h2>
        <p className="text-gray-500 mb-8">Authorized personnel only. Please authenticate securely via Netlify Identity.</p>

        <button 
          onClick={login}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl flex justify-center items-center gap-3"
        >
          <Shield className="h-5 w-5" />
          Authenticate Securely
        </button>
        
        <p className="mt-6 text-xs text-gray-400">
            Access requires a verified account. <br/> Contact system administrator if you need access.
        </p>
      </div>
    </div>
  );
};

interface ServiceEditorProps {
    service: ServicePackage;
    onSave: (id: string, data: Partial<ServicePackage>) => void;
}

const ServiceEditor: React.FC<ServiceEditorProps> = ({ service, onSave }) => {
    const [data, setData] = useState(service);
    const hasChanges = JSON.stringify(data) !== JSON.stringify(service);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary/30 transition">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Package Name</label>
                    <input 
                        value={data.title} 
                        onChange={e => setData({...data, title: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded font-bold text-gray-800 focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (Naira)</label>
                        <input 
                            value={data.price} 
                            onChange={e => setData({...data, price: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded text-gray-700 focus:ring-1 focus:ring-primary outline-none"
                        />
                   </div>
                   <div className="flex items-center pt-5">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={data.isPopular} 
                                onChange={e => setData({...data, isPopular: e.target.checked})}
                                className="form-checkbox h-4 w-4 text-secondary rounded border-gray-300 focus:ring-secondary"
                            />
                            <span className="text-sm text-gray-600 font-medium">Mark as Popular</span>
                        </label>
                   </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea 
                        value={data.description} 
                        onChange={e => setData({...data, description: e.target.value})}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded text-sm text-gray-600 focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Features (One per line)</label>
                    <textarea 
                        value={data.features.join('\n')} 
                        onChange={e => setData({...data, features: e.target.value.split('\n')})}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded text-sm text-gray-600 focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
            </div>
            {hasChanges && (
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={() => onSave(service.id, data)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition"
                    >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export const AdminDashboard = () => {
  const { leads, blogPosts, config, updateConfig, addBlogPost, deleteBlogPost, services, updateService, openProfile } = useSite();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'settings' | 'leads' | 'blogs'>('overview');

  // Blog Generator State
  const [topicPrompt, setTopicPrompt] = useState('');
  const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(config);
  
  useEffect(() => {
      setSettingsForm(config);
  }, [config]);

  const handleSettingsSave = () => {
    updateConfig(settingsForm);
  };

  const handleGenerateTopics = async () => {
    if (!topicPrompt) return;
    setIsGenerating(true);
    try {
        const topics = await generateBlogTopics(topicPrompt);
        setGeneratedTopics(topics);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAddGeneratedTopic = (title: string) => {
      addBlogPost({
          title,
          excerpt: `A comprehensive guide about ${title}...`,
          author: 'Admin',
          tags: ['New', 'Academic']
      });
      setGeneratedTopics(prev => prev.filter(t => t !== title));
  };

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Blog Posts', value: blogPosts.length, icon: FileText, color: 'bg-yellow-500' },
    { label: 'Services Active', value: services.length, icon: Briefcase, color: 'bg-green-500' },
  ];

  // Prepare chart data (Leads by date)
  const chartData = leads.reduce((acc: any[], lead) => {
    const existing = acc.find(item => item.date === lead.date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date: lead.date, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard | {config.siteName}</title>
      </Helmet>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full z-10 hidden md:block">
        <div className="p-6 border-b">
          <h2 className="font-serif font-bold text-xl text-primary">Dashboard</h2>
          <p className="text-xs text-gray-500 mt-1">Manage your platform</p>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'overview' ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </button>
          <button onClick={() => setActiveTab('leads')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'leads' ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Users className="h-5 w-5" />
            <span>Leads</span>
          </button>
          <button onClick={() => setActiveTab('services')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'services' ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Briefcase className="h-5 w-5" />
            <span>Services</span>
          </button>
          <button onClick={() => setActiveTab('blogs')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'blogs' ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FileText className="h-5 w-5" />
            <span>Blogs</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'settings' ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                  <div className={`${stat.color} p-4 rounded-lg text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Lead Acquisition</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="count" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-serif font-bold text-gray-900">Leads Management</h2>
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads.length > 0 ? leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">{lead.serviceInterest}</span></td>
                          <td className="px-6 py-4 text-sm text-gray-500">{lead.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{lead.message}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No leads found yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'services' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-gray-900">Edit Services</h2>
                <p className="text-gray-500">Update pricing, descriptions, and features for your service packages.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services.map(service => (
                        <ServiceEditor key={service.id} service={service} onSave={updateService} />
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8">
            <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Site Configuration</h2>
                <p className="text-gray-600">Update global site content and branding.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      value={settingsForm.siteName}
                      onChange={(e) => setSettingsForm({...settingsForm, siteName: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                        type="email" 
                        className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        value={settingsForm.contactEmail}
                        onChange={(e) => setSettingsForm({...settingsForm, contactEmail: e.target.value})}
                        />
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color (Hex)</label>
                    <div className="flex items-center space-x-2">
                        <input type="color" className="h-10 w-10 rounded cursor-pointer border-0" value={settingsForm.primaryColor} onChange={(e) => setSettingsForm({...settingsForm, primaryColor: e.target.value})} />
                        <input 
                        type="text" 
                        className="flex-1 p-2 border border-gray-300 rounded-md uppercase font-mono text-sm"
                        value={settingsForm.primaryColor}
                        onChange={(e) => setSettingsForm({...settingsForm, primaryColor: e.target.value})}
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color (Hex)</label>
                    <div className="flex items-center space-x-2">
                        <input type="color" className="h-10 w-10 rounded cursor-pointer border-0" value={settingsForm.secondaryColor} onChange={(e) => setSettingsForm({...settingsForm, secondaryColor: e.target.value})} />
                        <input 
                        type="text" 
                        className="flex-1 p-2 border border-gray-300 rounded-md uppercase font-mono text-sm"
                        value={settingsForm.secondaryColor}
                        onChange={(e) => setSettingsForm({...settingsForm, secondaryColor: e.target.value})}
                        />
                    </div>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Headline</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={settingsForm.heroHeadline}
                  onChange={(e) => setSettingsForm({...settingsForm, heroHeadline: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subheadline</label>
                <textarea 
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={settingsForm.heroSubheadline}
                  onChange={(e) => setSettingsForm({...settingsForm, heroSubheadline: e.target.value})}
                ></textarea>
              </div>
              
              <div className="border-t pt-6 space-y-6">
                 <h3 className="text-lg font-bold text-gray-800">Contact & Address</h3>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                            type="text" 
                            className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                            value={settingsForm.contactAddress}
                            onChange={(e) => setSettingsForm({...settingsForm, contactAddress: e.target.value})}
                        />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                value={settingsForm.contactPhone}
                                onChange={(e) => setSettingsForm({...settingsForm, contactPhone: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Hours</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                value={settingsForm.supportHours}
                                onChange={(e) => setSettingsForm({...settingsForm, supportHours: e.target.value})}
                            />
                        </div>
                    </div>
                 </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSettingsSave}
                  className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-md font-bold hover:bg-blue-800 transition"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Account</h3>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm">Manage your secure password and account details via Netlify Identity.</p>
                    <button 
                        onClick={openProfile}
                        className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition font-medium"
                    >
                        <ExternalLink className="h-4 w-4" />
                        <span>Manage Profile</span>
                    </button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Blog Manager Left Col: List */}
             <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-gray-900">Blog Manager</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {blogPosts.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No blog posts yet. Use the generator to add some!</div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {blogPosts.map(post => (
                        <li key={post.id} className="p-6 hover:bg-gray-50 transition flex justify-between items-start group">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{post.title}</h3>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                               <span>{post.date}</span>
                               <span>{post.author}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">{post.excerpt}</p>
                          </div>
                          <button onClick={() => deleteBlogPost(post.id)} className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
             </div>

             {/* Blog Manager Right Col: AI Generator */}
             <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary to-blue-900 rounded-xl p-6 text-white shadow-lg">
                   <div className="flex items-center space-x-2 mb-4">
                      <Sparkles className="h-6 w-6 text-yellow-400" />
                      <h3 className="font-bold text-lg">AI Topic Generator</h3>
                   </div>
                   <p className="text-blue-200 text-sm mb-4">Stuck for ideas? Let Gemini generate relevant academic topics for your blog.</p>
                   
                   <div className="space-y-3">
                      <input 
                        type="text" 
                        className="w-full p-3 rounded bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter a theme (e.g. 'Research Ethics')"
                        value={topicPrompt}
                        onChange={e => setTopicPrompt(e.target.value)}
                      />
                      <button 
                        onClick={handleGenerateTopics}
                        disabled={isGenerating || !topicPrompt}
                        className="w-full bg-secondary text-white py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50 flex justify-center"
                      >
                         {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : 'Generate Ideas'}
                      </button>
                   </div>
                </div>

                {generatedTopics.length > 0 && (
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-4">Generated Ideas</h4>
                      <ul className="space-y-3">
                         {generatedTopics.map((topic, idx) => (
                            <li key={idx} className="flex items-center justify-between text-sm group">
                               <span className="text-gray-700">{topic}</span>
                               <button 
                                onClick={() => handleAddGeneratedTopic(topic)}
                                className="text-green-600 hover:bg-green-50 p-1 rounded transition" title="Add to Blogs">
                                  <PlusCircle className="h-5 w-5" />
                               </button>
                            </li>
                         ))}
                      </ul>
                   </div>
                )}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
