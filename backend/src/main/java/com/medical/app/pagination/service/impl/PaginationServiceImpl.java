package com.medical.app.pagination.service.impl;

import com.medical.app.pagination.dto.FilterCriteriaDTO;
import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.pagination.enums.LogicalOperatorEnum;
import com.medical.app.pagination.service.PaginationService;
import com.medical.app.pagination.specification.FilterSpecification;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class PaginationServiceImpl<T> implements PaginationService<T> {

  public Pageable createPageable(GenericRequestDTO genericRequestDTO) {
    List<Sort.Order> orders = genericRequestDTO.getSorts().stream().map(sortRequest ->
        new Sort.Order(sortRequest.getOrder(), sortRequest.getKey())
    ).collect(Collectors.toList());

    return PageRequest.of(genericRequestDTO.getPage(), genericRequestDTO.getSize(),
        Sort.by(orders)
    );
  }

  public Specification<T> createSpecification(List<FilterCriteriaDTO> filters) {
    Specification<T> spec = Specification.where(null);

    for (FilterCriteriaDTO criteria : filters) {
      if (criteria.getOperator() == LogicalOperatorEnum.AND) {
        spec = spec.and(new FilterSpecification(criteria));
      } else {
        spec = spec.or(new FilterSpecification(criteria));
      }
    }

    return spec;
  }
}
