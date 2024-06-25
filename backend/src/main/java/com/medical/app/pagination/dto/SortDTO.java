package com.medical.app.pagination.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Sort;

@Getter
@Setter
public class SortDTO {

  @NotNull
  private String key;

  @NotNull
  private Sort.Direction order;
}
