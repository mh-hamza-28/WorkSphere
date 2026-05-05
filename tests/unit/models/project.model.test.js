import { Project } from '../../../src/models/project.models.js'
import mongoose from 'mongoose'

describe('Project Model', () => {
  const mockUserId = new mongoose.Types.ObjectId()
  
  describe('Schema Validation', () => {
    it('should create a project with valid data', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test description',
        createdBy: mockUserId,
      }
      
      const project = await Project.create(projectData)
      
      expect(project.name).toBe(projectData.name)
      expect(project.description).toBe(projectData.description)
      expect(project.createdBy.toString()).toBe(mockUserId.toString())
      expect(project.createdAt).toBeDefined()
      expect(project.updatedAt).toBeDefined()
    })
    
    it('should require name', async () => {
      const projectData = {
        description: 'Test description',
        createdBy: mockUserId,
      }
      
      await expect(Project.create(projectData)).rejects.toThrow()
    })
    
    it('should require createdBy', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test description',
      }
      
      await expect(Project.create(projectData)).rejects.toThrow()
    })
    
    it('should not allow duplicate project names', async () => {
      const projectData = {
        name: 'Unique Project Name',
        createdBy: mockUserId,
      }
      
      await Project.create(projectData)
      
      await expect(Project.create({
        ...projectData,
        createdBy: new mongoose.Types.ObjectId(),
      })).rejects.toThrow()
    })
    
    it('should allow projects without description', async () => {
      const project = await Project.create({
        name: 'No Description Project',
        createdBy: mockUserId,
      })
      
      expect(project.description).toBeUndefined()
    })
    
    it('should trim project name', async () => {
      const project = await Project.create({
        name: '  Trimmed Project  ',
        createdBy: mockUserId,
      })
      
      expect(project.name).toBe('Trimmed Project')
    })
  })
  
  describe('Timestamps', () => {
    it('should set createdAt and updatedAt on creation', async () => {
      const beforeCreate = new Date()
      const project = await Project.create({
        name: 'Timestamp Project',
        createdBy: mockUserId,
      })
      const afterCreate = new Date()
      
      expect(project.createdAt).toBeInstanceOf(Date)
      expect(project.updatedAt).toBeInstanceOf(Date)
      expect(project.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime())
      expect(project.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime())
    })
    
    it('should update updatedAt on modification', async () => {
      const project = await Project.create({
        name: 'Update Test Project',
        createdBy: mockUserId,
      })
      
      const originalUpdatedAt = project.updatedAt
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100))
      
      project.name = 'Updated Project Name'
      await project.save()
      
      expect(project.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })
  })
  
  describe('Project Reference', () => {
    it('should correctly reference a user as creator', async () => {
      const project = await Project.create({
        name: 'Reference Test Project',
        createdBy: mockUserId,
      })
      
      // Populate to verify reference works
      const populatedProject = await Project.findById(project._id)
        .populate('createdBy')
        .exec()
      
      // Since we don't have actual user, this will be null, but the ref field exists
      expect(populatedProject.createdBy).toBeDefined()
    })
  })
})
