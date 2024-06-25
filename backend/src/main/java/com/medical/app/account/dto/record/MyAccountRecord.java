package com.medical.app.account.dto.record;

import java.util.List;

public record MyAccountRecord(
    Long id,
    String email,
    String fullName,
    String firstName,
    String lastName,
    List<String> roles
){
}
