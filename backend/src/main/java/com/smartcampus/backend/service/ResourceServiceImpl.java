package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ResourceRequestDTO;
import com.smartcampus.backend.dto.ResourceResponseDTO;
import com.smartcampus.backend.model.AvailabilityWindow;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO request) {
        Resource resource = new Resource();
        resource.setType(request.getType());
        resource.setName(request.getName());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setAvailabilityWindows(request.getAvailabilityWindows());
        resource.setStatus(request.getStatus() != null ? request.getStatus() : ResourceStatus.ACTIVE);
        
        Resource saved = resourceRepository.save(resource);
        return toDTO(saved);
    }

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        
        resource.setType(request.getType());
        resource.setName(request.getName());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setAvailabilityWindows(request.getAvailabilityWindows());
        if (request.getStatus() != null) {
            resource.setStatus(request.getStatus());
        }
        
        Resource updated = resourceRepository.save(resource);
        return toDTO(updated);
    }

    @Override
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    @Override
    public List<ResourceResponseDTO> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceResponseDTO> getAllActiveResources() {
        return resourceRepository.findByStatus(ResourceStatus.ACTIVE).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        return toDTO(resource);
    }

    @Override
    public List<ResourceResponseDTO> searchResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status) {
        return resourceRepository.searchResources(type, minCapacity, location, status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ResourceResponseDTO toDTO(Resource resource) {
        ResourceResponseDTO dto = new ResourceResponseDTO();
        dto.setId(resource.getId());
        dto.setType(resource.getType());
        dto.setName(resource.getName());
        dto.setCapacity(resource.getCapacity());
        dto.setLocation(resource.getLocation());
        dto.setAvailabilityWindows(resource.getAvailabilityWindows());
        dto.setStatus(resource.getStatus());
        return dto;
    }
}