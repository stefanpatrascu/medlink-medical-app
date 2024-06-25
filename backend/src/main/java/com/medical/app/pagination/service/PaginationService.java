package com.medical.app.pagination.service;

import com.medical.app.pagination.dto.FilterCriteriaDTO;
import com.medical.app.pagination.dto.GenericRequestDTO;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface PaginationService<T> {
  Pageable createPageable(GenericRequestDTO genericRequestDTO);
  Specification<T> createSpecification(List<FilterCriteriaDTO> filters);
}
