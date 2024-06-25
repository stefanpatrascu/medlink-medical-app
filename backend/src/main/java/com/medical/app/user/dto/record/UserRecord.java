package com.medical.app.user.dto.record;

import com.medical.app.employee.enums.EmployeeType;
import com.medical.app.employee.enums.SpecializationEnum;
import com.medical.app.user.enums.RoleEnum;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

public record UserRecord(Long id,
                         String fullName,
                         String cnp,
                         String email,
                         String phoneNumber,
                         Optional<LocalDate> hireDate,
                         LocalDateTime lastLogin,
                         Set<RoleEnum> roles,
                         Optional<SpecializationEnum> specialization,
                         Optional<EmployeeType> employeeType,
                         Boolean enabled,
                         LocalDateTime updatedAt) {
}
