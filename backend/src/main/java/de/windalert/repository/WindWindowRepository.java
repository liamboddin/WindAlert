package de.windalert.repository;

import de.windalert.domain.WindWindow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WindWindowRepository extends JpaRepository<WindWindow, Long> {
}
