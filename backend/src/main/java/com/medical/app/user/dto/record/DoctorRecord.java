package com.medical.app.user.dto.record;

import com.medical.app.clinics.entity.Clinic;
import com.medical.app.employee.entity.WorkProgram;
import com.medical.app.employee.enums.SpecializationEnum;
import java.util.List;

public record DoctorRecord(
    Long id,
    String fullName,
    SpecializationEnum specialization,
    Clinic clinic,
    List<WorkProgram> workProgram
    ) {
}
