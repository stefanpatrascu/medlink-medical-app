package com.medical.app.pagination.specification;

import com.medical.app.exception.BadRequestException;
import com.medical.app.pagination.dto.FilterCriteriaDTO;
import com.medical.app.pagination.enums.FilterOperationEnum;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.ZoneId;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@AllArgsConstructor
public class FilterSpecification<T> implements Specification<T> {
  private FilterCriteriaDTO criteria;

  @Override
  public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
    Path<T> path = getPathForNestedProperties(root, criteria.getKey());

    switch (criteria.getFieldType()) {
      case STRING -> {
        return convertStringToPredicate(builder, path);
      }

      case LONG -> {
        return convertLongToPredicate(builder, path);
      }

      case DATE -> {
        return convertDateToPredicate(builder, path);
      }

      case BOOLEAN -> {
        return convertBooleanToPredicate(builder, path);
      }

      default -> throw new BadRequestException("Invalid field type");
    }
  }

  private Predicate convertBooleanToPredicate(CriteriaBuilder builder, Path<T> path) {
    switch (criteria.getMatchMode()) {
      case FilterOperationEnum.EQUALS -> {
        return builder.equal(path, Boolean.parseBoolean(criteria.getValue()));
      }

      case FilterOperationEnum.NOT_EQUALS -> {
        return builder.notEqual(path, Boolean.parseBoolean(criteria.getValue()));
      }

      default -> throw new BadRequestException("Invalid filter boolean operation");
    }
  }

  private Predicate convertDateToPredicate(CriteriaBuilder builder, Path<T> path) {
    switch (criteria.getMatchMode()) {
      case FilterOperationEnum.EQUALS -> {
        LocalDate localDate = LocalDate.parse(criteria.getValue());
        LocalDate startDay = localDate.atStartOfDay(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDay = localDate.atStartOfDay(ZoneId.systemDefault()).plusHours(23).plusMinutes(59).plusSeconds(59).toLocalDate();

        return builder.between(
            path.as(LocalDate.class),
            startDay,
            endDay
        );
      }

      case FilterOperationEnum.NOT_EQUALS -> {
        LocalDate localDate = LocalDate.parse(criteria.getValue());
        LocalDate startDay = localDate.atStartOfDay(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDay = localDate.atStartOfDay(ZoneId.systemDefault()).plusHours(23).plusMinutes(59).plusSeconds(59).toLocalDate();

        return builder.or(
            builder.lessThan(path.as(LocalDate.class), startDay),
            builder.greaterThan(path.as(LocalDate.class), endDay)
        );
      }

      case FilterOperationEnum.DATE_AFTER -> {
        LocalDate localDate = LocalDate.parse(criteria.getValue());

        return builder.greaterThan(
            path.as(LocalDate.class),
            localDate.atStartOfDay(ZoneId.systemDefault()).toLocalDate()
        );
      }

      case FilterOperationEnum.DATE_BEFORE -> {
        LocalDate localDate = LocalDate.parse(criteria.getValue());

        return builder.lessThan(
            path.as(LocalDate.class),
            localDate.atStartOfDay(ZoneId.systemDefault()).toLocalDate()
        );
      }

      default -> throw new BadRequestException("Invalid filter date operation");
    }
  }

  private Predicate convertLongToPredicate(CriteriaBuilder builder, Path<T> path) {
    switch (criteria.getMatchMode()) {

      case FilterOperationEnum.LT -> {
        Long value = Long.parseLong(criteria.getValue());
        return builder.lessThan(path.as(Long.class), value);
      }

      case FilterOperationEnum.LTE -> {
        Long value = Long.parseLong(criteria.getValue());
        return builder.lessThanOrEqualTo(path.as(Long.class), value);
      }

      case FilterOperationEnum.GT -> {
        Long value = Long.parseLong(criteria.getValue());
        return builder.greaterThan(path.as(Long.class), value);
      }

      case FilterOperationEnum.GTE -> {
        Long value = Long.parseLong(criteria.getValue());
        return builder.greaterThanOrEqualTo(path.as(Long.class), value);
      }

      case FilterOperationEnum.EQUALS -> {
        return builder.equal(path, criteria.getValue());
      }

      case FilterOperationEnum.NOT_EQUALS -> {
        return builder.notEqual(path, criteria.getValue());
      }

      default -> throw new BadRequestException("Invalid filter number operation");
    }
  }

  private Predicate convertStringToPredicate(CriteriaBuilder builder, Path<T> path) {
    switch (criteria.getMatchMode()) {
      case FilterOperationEnum.EQUALS -> {
        return builder.equal(path, criteria.getValue());
      }

      case FilterOperationEnum.CONTAINS -> {
        return builder.like(path.as(String.class), "%" + criteria.getValue() + "%");
      }

      case FilterOperationEnum.STARTS_WITH -> {
        return builder.like(path.as(String.class), criteria.getValue() + "%");
      }

      case FilterOperationEnum.ENDS_WITH -> {
        return builder.like(path.as(String.class), "%" + criteria.getValue());
      }

      case FilterOperationEnum.NOT_EQUALS -> {
        return builder.notEqual(path, criteria.getValue());
      }

      case FilterOperationEnum.NOT_CONTAINS -> {
        return builder.notLike(path.as(String.class), "%" + criteria.getValue() + "%");
      }

      default -> throw new BadRequestException("Invalid filter string operation");
    }
  }

  private Path<T> getPathForNestedProperties(Root<T> root, String key) {
    Path<T> path = root;
    if (key.contains(".")) {
      String[] parts = key.split("\\.");
      for (String part : parts) {
        path = path.get(part);
      }
    } else {
      path = root.get(key);
    }
    return path;
  }
}
