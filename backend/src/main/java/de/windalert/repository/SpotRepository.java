package de.windalert.repository;

import de.windalert.domain.Spot;
import de.windalert.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpotRepository extends JpaRepository<Spot, Long> {
    Optional<Spot> findByNameAndUser(String name, User user);

    List<Spot> findAllByUser(User user);

    Optional<Spot> findByIdAndUser(Long id, User user);
}
