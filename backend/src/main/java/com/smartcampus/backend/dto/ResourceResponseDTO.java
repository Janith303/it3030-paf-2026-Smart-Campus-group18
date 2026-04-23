package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.AvailabilityWindow;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import java.util.List;

public class ResourceResponseDTO {

    private Long id;
    private ResourceType type;
    private String name;
    private Integer capacity;
    private String location;
    private List<AvailabilityWindow> availabilityWindows;
    private ResourceStatus status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public List<AvailabilityWindow> getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(List<AvailabilityWindow> availabilityWindows) { this.availabilityWindows = availabilityWindows; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }
}