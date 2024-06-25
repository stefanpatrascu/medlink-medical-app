package com.medical.app.pagination.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenericRequestDTO {
  @NotNull
  @Min(value = 0L, message = "The value must be positive")
  private Integer page;

  @NotNull
  @Min(value = 1L, message = "The value must be higher than 0")
  @Max(value = 100L, message = "The value must be less than or equal to 100")
  private Integer size;

  @NotNull
  @Valid
  private List<SortDTO> sorts;

  @NotNull
  @Valid
  private List<FilterCriteriaDTO> filters;
}
