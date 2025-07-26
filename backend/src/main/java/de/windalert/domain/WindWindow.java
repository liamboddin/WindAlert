package de.windalert.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(exclude = {"spot"})
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WindWindow extends AbstractIdEntity {
    Integer speed;
    Integer startAngle;
    Integer endAngle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", nullable = false)
    private Spot spot;
}
