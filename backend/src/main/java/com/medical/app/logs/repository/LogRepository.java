package com.medical.app.logs.repository;

import com.medical.app.logs.entity.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
  Page<Log> findAll(Specification<Log> specification, Pageable pageable);
}
