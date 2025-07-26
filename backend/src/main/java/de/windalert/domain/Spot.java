package de.windalert.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(exclude = {"windWindows"})
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Spot extends AbstractIdEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Column(unique = true)
    private String name;

    @OneToMany(
            mappedBy = "spot",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Set<WindWindow> windWindows = new HashSet<>();

    private float latitude;
    private float longitude;
}
