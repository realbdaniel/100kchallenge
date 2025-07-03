'use client'

import { useState } from 'react'
import { X, Upload, DollarSign, Globe, Settings } from 'lucide-react'
import { createProject, updateProject } from '@/lib/supabase'
import type { Project } from '@/lib/supabase'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (achievements?: string[]) => void
  project?: Project | null
  userId: string
}

export function ProjectModal({ isOpen, onClose, onSuccess, project, userId }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image_url: project?.image_url || '',
    revenue: project?.revenue || 0,
    status: project?.status || 'development' as 'development' | 'live' | 'paused'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)

  const isEditing = !!project

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let achievements: string[] = []
      
      if (isEditing) {
        const { error } = await updateProject(project.id, formData)
        if (error) throw error
      } else {
        const { error, newAchievements } = await createProject(userId, formData)
        if (error) throw error
        achievements = newAchievements || []
      }

      onSuccess(achievements)
      onClose()
      
      // Reset form if creating new project
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          image_url: '',
          revenue: 0,
          status: 'development'
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    
    try {
      // For now, use a placeholder - in production you'd upload to storage
      // This would integrate with Supabase Storage or another service
      const placeholderUrl = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center`
      
      setFormData(prev => ({ ...prev, image_url: placeholderUrl }))
      
      // TODO: Implement actual file upload
      // const { data, error } = await supabase.storage
      //   .from('project-images')
      //   .upload(`${userId}/${Date.now()}-${file.name}`, file)
      
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h2>
            <p className="text-sm text-white/60 mt-1">
              {isEditing ? 'Update your project details' : 'Add a new project to track your revenue progress'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium mb-3">Project Screenshot</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition">
              {formData.image_url ? (
                <div className="relative">
                  <img 
                    src={formData.image_url} 
                    alt="Project preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-white/40" />
                  <p className="text-sm text-white/60 mb-2">Upload a project screenshot</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium cursor-pointer transition ${
                      imageUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {imageUploading ? 'Uploading...' : 'Choose File'}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., SaaS Dashboard, Mobile App, E-commerce Store"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:border-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your project, target audience, and key features"
              rows={3}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
              required
            />
          </div>

          {/* Revenue and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue */}
            <div>
              <label className="block text-sm font-medium mb-2">Revenue (USD) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.revenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'development' | 'live' | 'paused' }))}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:border-blue-500 focus:outline-none transition"
                required
              >
                <option value="development">🚧 Development</option>
                <option value="live">🟢 Live</option>
                <option value="paused">⏸️ Paused</option>
              </select>
            </div>
          </div>

          {/* Revenue Impact Note */}
          {(formData.revenue > 0 || isEditing) && (
            <div className="p-4 bg-mario-yellow/10 border border-mario-yellow/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-lg">🪙</div>
                <div>
                  <p className="text-sm font-medium text-mario-yellow">Revenue Impact</p>
                  <p className="text-xs text-white/70 mt-1">
                    {isEditing ? 
                      'Updating revenue will recalculate your level and may trigger new achievements.' :
                      formData.revenue > 0 ? 
                        `Adding $${formData.revenue.toLocaleString()} revenue will update your level and progress. First revenue triggers the "First Coin" achievement!` :
                        'Enter your revenue to see level progression and achievement triggers.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.description}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 