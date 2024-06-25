package com.medical.app.pagination.dto;
import com.medical.app.pagination.enums.FieldTypeEnum;
import com.medical.app.pagination.enums.FilterOperationEnum;
import com.medical.app.pagination.enums.LogicalOperatorEnum;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FilterCriteriaDTO {

  @NotEmpty
  private String key;

  private String value;

  @NotNull
  private FilterOperationEnum matchMode;

  @NotNull
  private LogicalOperatorEnum operator;

  @NotNull
  private FieldTypeEnum fieldType;

}
