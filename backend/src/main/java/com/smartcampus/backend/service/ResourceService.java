package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ResourceRequestDTO;
import com.smartcampus.backend.dto.ResourceResponseDTO;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import java.util.List;

public interface ResourceService {
    ResourceResponseDTO createResource(ResourceRequestDTO request);
    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO request);
    void deleteResource(Long id);
    List<ResourceResponseDTO> getAllResources();
    List<ResourceResponseDTO> getAllActiveResources();
    ResourceResponseDTO getResourceById(Long id);
    List<ResourceResponseDTO> searchResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status);
}